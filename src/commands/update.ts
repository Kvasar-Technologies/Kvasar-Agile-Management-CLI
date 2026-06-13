/**
 * `kvasar update` command — manual update check and upgrade.
 *
 * Subcommands:
 *   kvasar update          — Check for updates and upgrade with confirmation
 *   kvasar update --check  — Check for updates without installing
 *   kvasar update --force  — Update immediately without confirmation
 */

import { Command } from 'commander';
import {
  checkForUpdate,
  performUpdate,
  detectInstallMethod,
} from '../update/index.js';

export const updateCommand = new Command('update')
  .description('Check for updates and upgrade the CLI')
  .option('-c, --check', 'Check for updates without installing')
  .option('-f, --force', 'Update immediately without confirmation')
  .action(async (options) => {
    try {
      // ── kvasar update --check ──
      if (options.check) {
        const result = await checkForUpdate();
        console.log(`Current version: ${result.currentVersion}`);
        if (result.latestVersion) {
          console.log(`Latest version:  ${result.latestVersion}`);
        }
        if (result.error) {
          console.error(`Warning: ${result.error}`);
          process.exit(1);
        }
        if (result.updateAvailable) {
          console.log('Update available.');
        } else {
          console.log('You are up to date!');
        }
        return;
      }

      // ── kvasar update --force ──
      if (options.force) {
        const result = await checkForUpdate();
        if (!result.latestVersion) {
          console.error('Could not reach the update server.');
          process.exit(1);
        }
        if (!result.updateAvailable) {
          console.log(`You are up to date (${result.currentVersion}).`);
          return;
        }

        console.log(`Updating Kvasar CLI from ${result.currentVersion} to ${result.latestVersion}...`);
        const method = detectInstallMethod();
        const ok = await performUpdate(result.latestVersion, method);
        if (ok) {
          console.log(`✅ Kvasar CLI successfully updated to v${result.latestVersion}`);
        } else {
          console.error(
            '❌ Update failed. Please try manually:\n' +
            '      npm install -g kvasar-cli',
          );
          process.exit(1);
        }
        return;
      }

      // ── kvasar update (interactive) ──
      const result = await checkForUpdate();
      if (!result.latestVersion) {
        console.error('Could not reach the update server. Check your internet connection.');
        process.exit(1);
      }

      if (!result.updateAvailable) {
        console.log(`You are up to date (${result.currentVersion}).`);
        return;
      }

      // Prompt user
      const { confirm } = await import('@inquirer/prompts');
      const border = '━'.repeat(47);
      console.log(`\n${border}`);
      console.log('  🚀  A new version of Kvasar CLI is available');
      console.log(`  Current version:  ${result.currentVersion}`);
      console.log(`  Latest version:   ${result.latestVersion}`);
      console.log(`${border}\n`);

      const shouldUpdate = await confirm({
        message: 'Would you like to update now?',
        default: true,
      });

      if (shouldUpdate) {
        const method = detectInstallMethod();
        console.log('Updating...');
        const ok = await performUpdate(result.latestVersion, method);
        if (ok) {
          console.log(`\n  ✅  Kvasar CLI successfully updated to v${result.latestVersion}\n`);
        } else {
          console.error('\n  ❌  Update failed. Please try manually:');
          console.error(`      npm install -g kvasar-cli\n`);
          process.exit(1);
        }
      } else {
        console.log('Update cancelled.');
      }
    } catch (error: any) {
      console.error('Update failed:', error.message);
      process.exit(1);
    }
  });
