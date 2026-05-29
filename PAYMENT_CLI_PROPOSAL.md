# Proposal: Add Payment Support to Kvasar CLI

**Jira:** KC2-3  
**Status:** Draft Proposal  
**Author:** Assistant  
**Date:** 2025-05-29

---

## 1. Current State Analysis

### 1.1 CLI Architecture

The Kvasar CLI is built with Node.js and TypeScript, using the following key components:

- **Command registration:** Located in `src/commands/index.ts`. Commands are grouped by domain and registered with a top-level `commander` program.
- **API client:** `src/core/client.ts` defines `KvasarClient` which wraps authenticated `fetch` calls to the Kvasar backend.
- **Authentication:** `src/core/auth.ts` implements an Auth0 Device Flow for login. Tokens are stored securely via `token-store` and refreshed automatically.
- **CLI options:** `--access-token` overrides stored credentials; `--output json|pretty` controls formatting; `--quiet` suppresses output.
- **Command structure:** Each command module exports a `Command` instance and an execution function that uses `getClient()` for API interaction.

### 1.2 Existing Payment Infrastructure

The backend API (`api-docs.txt`) already contains Stripe-related endpoints:

- `POST /api/v1/stripe/create-customer` – Creates a Stripe customer linked to the user.
- `POST /api/v1/stripe/checkout-session` – Creates a Stripe Checkout session for a given `priceId`, with `successUrl` and `cancelUrl`.
- `GET /api/v1/stripe/prices` – Lists available Stripe products and prices.
- `/stripe/webhook` – Receives Stripe events (signature verification required).

Additionally, the `User` schema includes an optional `stripeCustomerId` field, indicating that a user can be associated with a Stripe customer.

**Missing pieces for a full billing CLI:**

- No endpoint to retrieve the current subscription status or usage.
- No billing portal session creation (for managing subscriptions).
- No direct CLI commands to trigger these operations.

---

## 2. Proposed Solution

### 2.1 New Backend Endpoints

These endpoints should be added to the Kvasar API (prefixed with `/api/v1/`). They must require a valid access token.

#### GET `/billing/current`

Returns the authenticated user’s current billing information.

**Response:**
```json
{
  "subscription": {
    "status": "active|past_due|canceled|incomplete",
    "plan": {"name": "Pro", "priceId": "price_123", "interval": "month"},
    "periodEnd": "2025-07-15T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "usage": {
    "used": 120,
    "limit": 200,
    "unit": "hours"
  },
  "paymentMethod": {
    "type": "card",
    "brand": "Visa",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025
  },
  "customerId": "cus_ABC123"
}
```

#### POST `/stripe/billing-portal`

Creates a Stripe Billing Portal session for the authenticated user. The portal allows the user to manage payment methods, view invoices, and cancel the subscription.

**Query parameters:**
- `returnUrl` (optional) – Where to redirect after leaving the portal.

**Response:**
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

#### (Optional) POST `/billing/credits`

For one-time credit purchases. Accepts a credit package identifier and creates a Checkout session. Returns the session URL.

**Body:**
```json
{ "packageId": "credits_100" }
```
**Response:**
```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

### 2.2 New CLI Commands

We propose a top-level `kvasar billing` command group with subcommands:

#### `kvasar billing status`

Shows current subscription and usage in a human-friendly table.

**Implementation:**
- Call `GET /billing/current`.
- Format output with `console.table` or a styled box.
- Return exit code 0 on success, 1 on error.

#### `kvasar billing portal`

Opens the Stripe Billing Portal in the user’s default browser.

**Flow:**
1. Call `POST /stripe/billing-portal?returnUrl=http://localhost` (return URL optional).
2. Use `opn` (cross-platform) or `child_process.exec` with `open` (macOS), `start` (Windows), `xdg-open` (Linux) to open the returned URL.
3. Print a message: “Opening billing portal in your browser…”

#### `kvasar upgrade`

Interactive command to upgrade or change subscription.

**Flow:**
1. Call `GET /stripe/prices` to fetch available recurring price options.
2. Display a list (e.g., “1) Basic – $10/month, 2) Pro – $30/month”).
3. Prompt the user to select a price ID or cancel.
4. If a selection is made:
   - Generate a success URL (e.g., `https://kvasar.tech/billing/success?session_id={CHECKOUT_SESSION_ID}`) and cancel URL (`https://kvasar.tech/billing/cancel`).
   - Call `POST /stripe/checkout-session?priceId=<selected>&successUrl=<...>&cancelUrl=<...>`.
   - Open the returned `url` in the browser.
   - Enter a waiting state: print “Waiting for payment confirmation…” and poll `GET /billing/current` every 5 seconds for up to 10 minutes until the subscription status becomes `active` or `past_due`.
   - Once confirmed, print a success message with the new plan and next billing date.
5. If the user cancels, exit gracefully.

**Scripting mode:** `--price-id <id>` can be used to bypass interaction for automation.

#### `kvasar credits purchase` (Optional)

Purchase one-time credits.

**Flow:** Similar to `upgrade`, but works with a credit package ID either passed via `--package-id` or selected from a list.

### 2.3 UX Principles

- **Browser-based checkout:** Follow the pattern used by `kvasar login` (which uses a browser for Auth0 device flow). Payment flows will also open the browser because Stripe Checkout must be completed in a browser. The CLI will open the URL automatically using system utilities.
- **Polling for status:** After checkout, the CLI will poll the `/billing/current` endpoint until the subscription becomes active or a timeout occurs. This avoids needing a local web server or ngrok.
- **Clear feedback:** Spinners or progress messages during waiting. Summaries after completion.
- **Error handling:** If the checkout is cancelled, print “Payment cancelled.” and exit with code 0. If polling fails, print error and suggest `kvasar billing status` to verify manually.

### 2.4 Required Code Changes in the CLI

#### 1. Extend `KvasarClient` (`src/core/client.ts`)

Add methods:
```typescript
async getBillingStatus(): Promise<any> {
  return this.get('/api/v1/billing/current');
}

async createBillingPortal(returnUrl?: string): Promise<any> {
  const params = new URLSearchParams();
  if (returnUrl) params.append('returnUrl', returnUrl);
  return this.post(`/api/v1/stripe/billing-portal?${params.toString()}`);
}

async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string): Promise<any> {
  const params = new URLSearchParams({
    priceId,
    successUrl,
    cancelUrl,
  });
  return this.post(`/api/v1/stripe/checkout-session?${params.toString()}`);
}

async listStripePrices(): Promise<any> {
  return this.get('/api/v1/stripe/prices');
}
```

#### 2. Add command files

- `src/commands/billing/status.ts`
- `src/commands/billing/portal.ts`
- `src/commands/billing/upgrade.ts`
- `src/commands/billing/credits.ts` (optional)

Register them in `src/commands/billing/index.ts` as a subcommand group `billing` under the main program.

**Example skeleton for status:**
```typescript
import { Command } from 'commander';
import { formatOutput } from '../utils/output.js';
import { getClient } from '../utils/client.js';

export async function executeBillingStatus(options: any): Promise<any> {
  const client = await getClient();
  const data = await client.getBillingStatus();
  return { data };
}

export const billingStatusCommand = new Command('status')
  .description('Show current billing status and usage')
  .option('--json', 'Output raw JSON')
  .action(async (options) => {
    const result = await executeBillingStatus(options);
    if (options.json) {
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      // Pretty print logic
      renderBillingStatus(result.data);
    }
  });
```

The `upgrade` command will require polling logic with a timeout. Use `setTimeout` and `setInterval`.

#### 3. Register commands

In `src/commands/index.ts`:
```typescript
import { billingCommand } from './billing.js';
// ...
program.addCommand(billingCommand);
```

The `billingCommand` is a group:
```typescript
export const billingCommand = new Command('billing')
  .description('Billing and subscription management')
  .addCommand(billingStatusCommand)
  .addCommand(billingPortalCommand)
  .addCommand(billingUpgradeCommand);
```

#### 4. Documentation updates

- Update `README.md` with new commands.
- Update `CLI_INVENTORY.md` for OpenClaw plugin mapping (if the plugin will expose these as tools later).

---

## 3. Security Considerations

- **Authentication required:** All billing endpoints must check for a valid access token and map the user to a Stripe customer ID. The backend must ensure the user cannot access other customers’ data.
- **Checkout session scoping:** The checkout session must be created with `customer` set to the user’s `stripeCustomerId` (creating it first if missing). This ties the payment to the existing account.
- **Webhook verification:** Backend should verify Stripe signatures on webhooks to prevent spoofing. The CLI does not handle webhooks.
- **No local secrets:** The CLI never handles credit card numbers or Stripe secret keys.
- **HTTPS enforcement:** All API calls use the configured base URL (should be HTTPS). The CLI can warn if `CONFIG.api.baseUrl` is not HTTPS in non-dev environments.
- **Token storage:** The CLI stores tokens in encrypted keychain via `token-store`. This is already in place and should not be altered.
- **Logging:** Avoid logging session URLs or tokens. If printing for debugging, redact.

---

## 4. Advantages & Disadvantages of Alternatives

| Approach | Pros | Cons |
|----------|------|------|
| **Browser Checkout + Polling (Proposed)** | Secure (PCI-compliant), familiar UX, works with existing Stripe Checkout, minimal backend changes | Requires polling; a few seconds delay; user must have a browser |
| **Direct Card Input in CLI** | No browser needed | Requires handling card data in CLI → PCI DSS Level 1 compliance burden; high risk; not recommended |
| **Magic Code Payment (like login)** | Can stay inside terminal if Stripe supports; no browser switching | Stripe doesn’t support device-flow for Checkout; not feasible |
| **Local Webhook Listener** | Immediate notification after checkout | Requires a publicly reachable URL or manual copy-paste of the session ID; extra complexity (ngrok, tunnels) |
| **Manual Copy-Paste of Checkout URL** | No automatic open | Worse UX; user might lose the URL; not seamless |

The proposed approach aligns with the existing `kvasar login` flow (which uses a browser and polling in the device flow). It balances security, developer effort, and user experience.

---

## 5. Impact on OpenClaw Plugin

The `kvasar-claude-plugin` (OpenClaw) can later expose these new capabilities as tools. For each CLI command:

- `kvasar billing status` → `billing_get` tool
- `kvasar billing portal` → `billing_open_portal` tool (opens browser automatically)
- `kvasar upgrade` → `billing_upgrade` tool (maybe interactive or with a suggested price ID)

Because the plugin’s `runCliCommand` already passes the access token and parses JSON, no plugin code change is needed beyond adding new tool registrations that invoke these commands. That can be done in a follow-up Jira ticket (e.g., KC2-4).

---

## 6. Implementation Plan & Timeline (High-Level)

1. **Backend (2–3 days)**
   - Implement `GET /billing/current` (query User.stripeCustomerId, get Stripe subscription via API or from DB).
   - Implement `POST /stripe/billing-portal` using Stripe’s billing portal creation.
   - Ensure Stripe webhook handler updates user subscription state.
   - Unit tests + Postman tests.

2. **CLI (2–3 days)**
   - Add methods to `KvasarClient`.
   - Implement `billing` command group with status, portal, upgrade.
   - Add browser-opening utility (cross-platform).
   - Add polling logic with a spinner.
   - Update README, CLI_INVENTORY.
   - Unit tests for new methods.

3. **QA & Staging (1–2 days)**
   - End-to-end tests using Stripe test cards.
   - Verify error handling (cancellations, network issues).
   - Confirm token refresh works during billing operations.

4. **Plugin exposure (optional, 1–2 days)**
   - Add tools to `kvasar-claude-plugin` and map to CLI commands.

Total: ~1–2 weeks with parallel work.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Stripe webhook not updating subscription quickly enough | Poll with a generous timeout (10 min) and provide a manual fallback (`kvasar billing status`). |
| Users on headless servers without browser | Provide `--no-open` flag to print the URL instead of opening; user can copy to another device. |
| Browser not opening automatically | Detect failure and print the URL for manual copy. |
| Backend endpoint not ready | Use feature flag; fallback to “billing not available”. |
| Polling consumes API rate limit | Use 5–10 second intervals; max 120 attempts = ~10 minutes. |

---

## 8. Conclusion

This proposal outlines a secure, user-friendly way to bring payment capabilities to the Kvasar CLI, reusing existing Stripe integration and following the established browser-based interaction pattern. The required code changes are minimal and well-contained, making it a practical next step.
