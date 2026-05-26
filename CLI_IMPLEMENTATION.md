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
