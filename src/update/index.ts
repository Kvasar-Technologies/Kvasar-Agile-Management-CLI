/**
 * Kvasar CLI Update Detection and Upgrade Module
 *
 * Checks for new versions, caches results, and supports interactive
 * and non-interactive upgrades — all without blocking normal CLI execution.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { confirm } from '@inquirer/prompts';
import semver from 'semver';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UpdateCache {
  lastChecked: string | null;
  latestVersion: string | null;
  ignoredVersion: string | null;
}

export type InstallMethod = 'npm' | 'standalone';

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  error?: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const UPDATE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 2000; // 2 seconds max for remote check
const NPM_PACKAGE_NAME = 'kvasar-cli';
const UPDATE_DIR = join(homedir(), '.kvasar');
const UPDATE_FILE = join(UPDATE_DIR, 'update-check.json');

// ─────────────────────────────────────────────
// Current Version
// ─────────────────────────────────────────────

// Use import.meta.url to resolve the workspace root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Walk up from src/update/ to the package root
const PROJECT_ROOT = join(__dirname, '..', '..');
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json');

let _currentVersion: string | undefined;

/**
 * Retrieve the currently installed version from package.json.
 * Cached after first read.
 */
export function getCurrentVersion(): string {
  if (_currentVersion !== undefined) return _currentVersion;
  try {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    _currentVersion = String(pkg.version ?? '0.0.0');
    return _currentVersion as string;
  } catch {
    return '0.0.0';
  }
}

// ─────────────────────────────────────────────
// Update Cache
// ─────────────────────────────────────────────

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Read the local update-check cache.
 */
export function readUpdateCache(): UpdateCache {
  try {
    if (existsSync(UPDATE_FILE)) {
      const raw = readFileSync(UPDATE_FILE, 'utf-8');
      return JSON.parse(raw) as UpdateCache;
    }
  } catch {
    // Corrupted or missing — return defaults
  }
  return { lastChecked: null, latestVersion: null, ignoredVersion: null };
}

/**
 * Write the update-check cache.
 */
export function writeUpdateCache(cache: UpdateCache): void {
  try {
    ensureDir(UPDATE_DIR);
    writeFileSync(UPDATE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch {
    // Fail silently — caching is a best-effort feature
  }
}

/**
 * Determine whether enough time has passed to check again.
 */
export function shouldCheckUpdate(cache: UpdateCache): boolean {
  if (!cache.lastChecked) return true;
  const elapsed = Date.now() - new Date(cache.lastChecked).getTime();
  return elapsed >= UPDATE_CACHE_TTL_MS;
}

// ─────────────────────────────────────────────
// Remote Version Check
// ─────────────────────────────────────────────

/**
 * Fetch the latest published version from the NPM registry.
 * Times out after 2 seconds and fails silently.
 */
export async function fetchLatestVersion(): Promise<string | null> {
  const url = `https://registry.npmjs.org/${NPM_PACKAGE_NAME}/latest`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data = (await response.json()) as { version?: string };
    return data.version ?? null;
  } catch {
    return null; // Fail silently if offline/unavailable
  } finally {
    clearTimeout(timeout);
  }
}

// ─────────────────────────────────────────────
// Version Comparison
// ─────────────────────────────────────────────

/**
 * Compare two semver strings. Returns true when `latest` > `current`.
 */
export function isUpdateAvailable(current: string, latest: string): boolean {
  return semver.gt(latest, current);
}

/**
 * Check if a version has been ignored by the user.
 */
export function isVersionIgnored(
  version: string,
  cache: UpdateCache,
): boolean {
  if (!cache.ignoredVersion) return false;
  return semver.eq(version, cache.ignoredVersion);
}

// ─────────────────────────────────────────────
// Installation Method Detection
// ─────────────────────────────────────────────

/**
 * Detect how the CLI was installed.
 * Checks for npm global installation and falls back to standalone binary.
 */
export function detectInstallMethod(): InstallMethod {
  try {
    // Check if the CLI is a global npm package
    const result = execSync('npm list -g --depth=0 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 3000,
    });
    if (result.includes(NPM_PACKAGE_NAME)) {
      return 'npm';
    }
  } catch {
    // Not an npm global install or npm not available
  }
  return 'standalone';
}

// ─────────────────────────────────────────────
// Upgrade Execution
// ─────────────────────────────────────────────

/**
 * Execute the upgrade based on installation method.
 * Returns true on success, false on failure.
 */
export async function performUpdate(
  latestVersion: string,
  method: InstallMethod,
): Promise<boolean> {
  try {
    if (method === 'npm') {
      execSync(`npm install -g ${NPM_PACKAGE_NAME}@${latestVersion}`, {
        stdio: 'inherit',
        timeout: 120_000,
      });
      return true;
    }

    // Standalone binary — download the latest release artifact
    const releaseUrl = `https://github.com/Kvasar-Technologies/${NPM_PACKAGE_NAME}/releases/latest/download/index.js`;
    const currentExe = process.argv[1];
    if (!currentExe) return false;

    const response = await fetch(releaseUrl);
    if (!response.ok) return false;

    // Write the new binary over the current one
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(currentExe, buffer, { mode: 0o755 });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Interactive Prompt
// ─────────────────────────────────────────────

/**
 * Display the interactive update prompt after command execution.
 * Returns the action taken: 'updated', 'ignored', 'skipped', or 'error'.
 */
export async function displayUpdatePrompt(
  currentVersion: string,
  latestVersion: string,
  cache: UpdateCache,
): Promise<'updated' | 'ignored' | 'skipped' | 'error'> {
  // ── Boxed banner ──
  const border = '━'.repeat(47);
  console.error(`\n${border}`);
  console.error('  🚀  A new version of Kvasar CLI is available');
  console.error(`  Current version:  ${currentVersion}`);
  console.error(`  Latest version:   ${latestVersion}`);
  console.error(`${border}\n`);

  try {
    const shouldUpdate = await confirm({
      message: 'Would you like to update now?',
      default: true,
    });

    if (shouldUpdate) {
      const method = detectInstallMethod();
      const ok = await performUpdate(latestVersion, method);
      if (ok) {
        console.error(`\n  ✅  Kvasar CLI successfully updated to v${latestVersion}\n`);
        // Clear cache so the new version is picked up next time
        writeUpdateCache({
          lastChecked: new Date().toISOString(),
          latestVersion,
          ignoredVersion: cache.ignoredVersion,
        });
        return 'updated';
      }
      console.error('\n  ❌  Update failed. Please try manually:');
      console.error(`      npm install -g ${NPM_PACKAGE_NAME}\n`);
      return 'error';
    }

    // User declined — ask whether to ignore this version
    const ignore = await confirm({
      message: `Do not ask again for version ${latestVersion}?`,
      default: true,
    });

    if (ignore) {
      writeUpdateCache({
        ...cache,
        lastChecked: new Date().toISOString(),
        latestVersion,
        ignoredVersion: latestVersion,
      });
      console.error(`  ℹ️  Version ${latestVersion} will be ignored until a newer release.\n`);
      return 'ignored';
    }

    // User doesn't want to update or ignore — just skip this time
    writeUpdateCache({
      ...cache,
      lastChecked: new Date().toISOString(),
      latestVersion,
    });
    return 'skipped';
  } catch {
    // If the prompt fails (e.g. non-TTY), silently skip
    return 'skipped';
  }
}

// ─────────────────────────────────────────────
// Non-blocking Update Check (background)
// ─────────────────────────────────────────────

/**
 * Run a non-blocking update check.
 * Intended to be called after command execution without awaiting.
 */
export async function backgroundUpdateCheck(): Promise<void> {
  try {
    const cache = readUpdateCache();
    if (!shouldCheckUpdate(cache)) return;

    const latestVersion = await fetchLatestVersion();
    if (!latestVersion) return; // Offline or unavailable

    const currentVersion = getCurrentVersion();

    // Update cache timestamp regardless
    const updatedCache: UpdateCache = {
      lastChecked: new Date().toISOString(),
      latestVersion,
      ignoredVersion: cache.ignoredVersion,
    };
    writeUpdateCache(updatedCache);

    // Check if update is available and not ignored
    if (
      isUpdateAvailable(currentVersion, latestVersion) &&
      !isVersionIgnored(latestVersion, cache)
    ) {
      await displayUpdatePrompt(currentVersion, latestVersion, updatedCache);
    }
  } catch {
    // Background check must never throw
  }
}

// ─────────────────────────────────────────────
// Explicit Manual Commands
// ─────────────────────────────────────────────

/**
 * Check for updates without installing.
 * Returns structured result for the CLI command handler.
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  const currentVersion = getCurrentVersion();
  const latestVersion = await fetchLatestVersion();

  if (!latestVersion) {
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      error: 'Could not reach the update server. Check your internet connection.',
    };
  }

  // Update the cache
  const cache = readUpdateCache();
  writeUpdateCache({
    lastChecked: new Date().toISOString(),
    latestVersion,
    ignoredVersion: cache.ignoredVersion,
  });

  const available = isUpdateAvailable(currentVersion, latestVersion);

  return {
    currentVersion,
    latestVersion,
    updateAvailable: available,
  };
}

/**
 * Check for updates and upgrade immediately without confirmation.
 */
export async function forceUpdate(): Promise<boolean> {
  const result = await checkForUpdate();
  if (!result.latestVersion || !result.updateAvailable) {
    return false;
  }
  const method = detectInstallMethod();
  return performUpdate(result.latestVersion, method);
}
