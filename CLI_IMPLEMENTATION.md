# CLI Implementation Status

## Implemented Commands

All core API endpoints have been implemented as CLI commands with the following structure:

- `kvasar value-streams` - list, get, create, update, delete, patch, stages, add-stage, add-solutions, add-art, copy
- `kvasar users` - list, create, update
- `kvasar teams` - list, create, update
- `kvasar strategic-themes` - list, get, create, update, delete, patch, add-keyresult, add-budget
- `kvasar solutions` - list, get, create, update, delete, patch, add-relation
- `kvasar products` - list, get, create (wraps solutions with type="product")
- `kvasar services` - list, get, create (wraps solutions with type="service")
- `kvasar systems` - list, get, create (wraps solutions with type="system")
- `kvasar portfolios` - list, create, update
- `kvasar pis` - get, update, delete, add-sprint
- `kvasar organizations` - list, get, create, update, delete, patch
  - `create`: Accepts JSON with `name` (optional), `logo` (optional), `file` (optional)
- `kvasar items` - list (paged), get, get-by-key, update, delete, patch, add-relation, children
- `kvasar epics` - list (with filters: organization, portfolio, state)
- `kvasar epic create`   
- `kvasar feature create`   
- `kvasar userstory create`  
- `kvasar enablerstory create`
- `kvasar issue create` 
- `kvasar kpis` - list, create, update
- `kvasar kanbans` - list, create, update
- `kvasar objectives` - list, update
- `kvasar arts` - list, create, update, assign
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

## Pagination Response Format

List operations (e.g., `kvasar items list`) return a paginated response with the following JSON structure:

```json
{
  "content": [],           // Array of items (empty if no results)
  "totalElements": 0,      // Total number of items across all pages
  "totalPages": 0,         // Total number of pages
  "sort": {                // Sorting metadata
    "sorted": false,
    "empty": true,
    "unsorted": true
  },
  "size": 20,              // Page size (items per page)
  "pageable": {            // Pagination metadata
    "pageNumber": 0,       // Current page number (0-based)
    "pageSize": 20,        // Number of items per page
    "sort": {              // Sort applied
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "offset": 0,           // Offset into the dataset
    "paged": true,         // Whether result is paginated
    "unpaged": false       // Whether result is unpaged
  },
  "numberOfElements": 0,   // Number of elements in current page
  "number": 0,             // Current page number (0-based)
  "first": true,           // Whether this is the first page
  "last": true,            // Whether this is the last page
  "empty": true            // Whether the content array is empty
}
```

### Notes

- **`content`** contains the actual items (artifacts) for the current page
- Pagination parameters: `--page` (0-based), `--size` (items per page), `--sort` (e.g., `itemName:asc`)
- Use `--page` and `--size` to navigate through pages
- Check `empty`, `first`, and `last` to understand pagination state
- `totalElements` and `totalPages` help calculate whether more pages exist

## JSON Patch Support

The `items patch` command uses JSON Patch (RFC 6902) to partially update items. The backend expects:
- Content-Type: `application/json-patch+json`
- Body: array of patch operations, e.g.:
  ```json
  [
    { "op": "replace", "path": "/itemName", "value": "New Name" }
  ]
  ```

For user convenience, the CLI accepts either:
1. **JSON Patch array** (as above)
2. **Simple object** with fields to update – auto-converted to `replace` operations:
   ```json
   { "itemName": "New Name", "description": "Updated description" }
   ```

The auto-conversion maps each top-level field to `/fieldName` path with `replace` operation.

### Important Notes
- Use `items update` for full replacements (PUT)
- Patch paths must start with `/` and use JSON Pointer notation
- Supported operations: `replace` (add via replace also works for existing fields)
- Patching `parentId` triggers color inheritance
- Patching `columnId` + `kanbanId` together may set `index` and `released` flags
