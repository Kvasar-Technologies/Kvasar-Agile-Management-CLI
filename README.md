# Kvasar Agile Management CLI
**AI-native, JSON-first CLI for Kvasar Agile Management.**

https://landing.kvasar.tech

>Kvasar Agile Management has a powerful web platform for agile planning and SAFe execution — but there is no dedicated developer CLI for interacting with agile entities, AI workflows, portfolio planning, ARTs, PIs, epics, features, sprints, dependencies, or Jira integrations directly from the terminal.

Kvasar CLI brings agile operations into:

- the terminal
- AI agents
- automation workflows
- MCP-compatible tools
- CI/CD pipelines
- developer environments

Built for:

- Product Managers
- RTEs
- Agile Coaches
- Engineering Teams
- AI Agents
- Enterprise Automation

## Quick Start

### Installation

```bash
npm install -g kvasar-cli
# or
npm link  # from source
```

### Configuration

The CLI uses Auth0 Device Flow for authentication. Set these environment variables:

```bash
export AUTH0_DOMAIN=https://kvasar-pro.eu.auth0.com
export AUTH0_CLIENT_ID=TJAjLrdPvFPDBqtSr15fvIer15Ocl9EI
export AUTH0_AUDIENCE=https://api.kvasar.tech/api/v1/
export KVASAR_API_URL=https://api.kvasar.tech
```

These defaults are already embedded in the CLI. Override via env vars if needed.

### Authentication

```bash
kvasar login
```

Follow the browser-based flow to authenticate.

### Example Commands

```bash
# Value Streams
kvasar value-streams list
kvasar value-streams get <id>
kvasar value-streams create --file data.json

# Strategic Themes
kvasar strategic-themes list
kvasar strategic-themes create --file data.json
kvasar strategic-themes add-keyresult <id> --file kr.json

# Solutions
kvasar solutions list
kvasar solutions create --file data.json
kvasar solutions add-relation <id> --file relation.json

# Teams
kvasar teams list
kvasar teams create --file data.json

# Epics
kvasar epics list
kvasar epics list --organization <org-id> --portfolio <portfolio-id> --state <state>

# And many more...
```

All commands support:
- `--output json|pretty` (default: json)
- `--quiet` (exit codes only)
- `--fields field1,field2` (filter output)

## Command Groups

- `kvasar value-streams` - Full CRUD + stages, solutions, arts, copy
- `kvasar strategic-themes` - Full CRUD + keyresults, budgetdistribution
- `kvasar solutions` - Full CRUD + relations
- `kvasar pis` - Program Increments (get, update, delete, add-sprint)
- `kvasar portfolios` - List, create, update
- `kvasar organizations` - Get, update, delete, patch
- `kvasar items` - Get, update, delete, patch, add-relation (for epics, features, stories, etc.)
- `kvasar epics` - List epics with filtering (organization, portfolio, state)
- `kvasar teams` - List, create, update
- `kvasar users` - List, create, update
- `kvasar arts` - List, create, update (Agile Release Trains)
- `kvasar kpis` - List, create, update
- `kvasar kanbans` - List, create, update (portfolio, program, solution, team)
- `kvasar objectives` - List, update


## Development

```bash
npm install
npm run dev    # Run directly
npm run build  # Build to dist/
npm run typecheck
```

See [CLI_IMPLEMENTATION.md](CLI_IMPLEMENTATION.md) for full implementation details.

## License

MIT © Kvasar Technologies