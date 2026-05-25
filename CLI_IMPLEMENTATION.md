# CLI Implementation Status

## Implemented Commands

All core API endpoints have been implemented as CLI commands with the following structure:

- `kvasar value-streams` - list, get, create, update, delete, patch, stages, add-stage, add-solutions, add-art, copy
- `kvasar users` - list, create, update
- `kvasar teams` - list, create, update
- `kvasar strategic-themes` - list, get, create, update, delete, patch, add-keyresult, add-budget
- `kvasar solutions` - list, get, create, update, delete, patch, add-relation
- `kvasar roadmaps` - list, create, update
- `kvasar portfolios` - list, create, update
- `kvasar pis` - get, update, delete, add-sprint
- `kvasar organizations` - get, update, delete, patch
- `kvasar items` - get, update, delete, patch, add-relation
- `kvasar kpis` - list, create, update
- `kvasar kanbans` - list, create, update
- `kvasar objectives` - list, update
- `kvasar arts` - list, create, update
- `kvasar teammembers` - list, create
- `kvasar auth-change` - password, name

## Skipped Commands

### Groups (`/api/v1/groups/`)

**Reason:** The `/api/v1/groups/` endpoint uses polymorphic types. The API accepts and returns one of:
- `Group`
- `BusinessOwner`
- `EpicOwners`
- `ProductManagers`
- `SolutionsGroup`

This complexity makes it difficult to manage via CLI without requiring users to know exactly which type they're creating/updating. The POST endpoint expects a specific type but the API determines it from the payload.

**Recommendation:** Implement separate commands for each group type:
- `kvasar groups create` (base Group)
- `kvasar business-owners` (BusinessOwner)
- `kvasar epic-owners` (EpicOwners)
- `kvasar product-managers` (ProductManagers)
- `kvasar solutions-groups` (SolutionsGroup)

### Stripe Endpoints

All Stripe-related endpoints have been intentionally excluded:
- `/stripe/webhook` (webhook handler, not a CLI command)
- `/api/v1/stripe/create-customer`
- `/api/v1/stripe/checkout-session`

**Reason:** Stripe functionality is payment-related and not needed for the core agile management CLI.

## Usage

All commands support these global options (inherited from `kvasar`):
- `--access-token <token>` - Override auth token
- `--output <format>` - Output format: `json` (default) or `pretty`
- `--quiet` - Suppress output, exit codes only
- `--fields <fields>` - Comma-separated list of fields to include (where supported)

For create/update operations, data can be provided via:
- `--file <path>` - JSON file containing the request body
- For some commands, inline JSON input could be added in the future

## Authentication

Authentication uses Auth0 Device Authorization Flow:
- `kvasar login` - Authenticate via browser
- `kvasar logout` - Clear stored credentials
- `kvasar whoami` - Show current user

Tokens are securely stored using system keychain/keytar.
