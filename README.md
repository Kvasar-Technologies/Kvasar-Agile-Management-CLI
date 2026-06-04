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


## Organization & Business management


### Example Commands


```bash

## Organization
kvasar organizations list

# Solutions
kvasar solutions list
kvasar solutions create --file data.json
kvasar solutions add-relation <id> --file relation.json


```

## Lean Portfolio Management
### Example Commands

```bash

# Portofolios
kvasar portfolios list
kvasar portfolios get <id>
kvasar portfolios create --file data.json

# Get portfolio Kanban
kasar kanbans get <kanban-id>

# Strategic Themes
kvasar strategic-themes list
kvasar strategic-themes create --file data.json
kvasar strategic-themes add-keyresult <id> --file kr.json

# Value Streams
kvasar value-streams list
kvasar value-streams get <id>
kvasar value-streams create --file data.json

```

## Team and Agile Release Trains (ARTs) managment

```bash

# Teams
kvasar teams list
kvasar teams create --file data.json

# Get Team Kanban
kasar kanbans get <kanban-id>

# Arts
kvasar arts list
kvasar arts create --file data.json

# Get Program Kanban
kasar kanbans get <kanban-id>

```


## Task / Requirements Management

## Type of tasks and requirements:

epic, feature, userstory, enablerstory, issue

## Requirements Hierarchy

- Epic
  - Feature
    - User Story
    - Enabler Story
    - Issue

```bash

# Epics List
kvasar epics list
kvasar epics list --organization <org-id> --portfolio <portfolio-id> --state <state>

## Single Epic
kvasar **epic** create

# Items
kvasar items list --parentId <parentId> --page 0 --size 20 --sort field:direction
kvasar items children <parentId>
kvasar items get <id>
kvasar items update <id> --file data.json
kvasar items delete <id>



## List & Search
kvasar items list [--parentId <id>] [--kanbanId <id>] [--portfolioId <id>] [--ownerId <id>]
                  [--name <type>] [--itemType <BUSINESS|ENABLER>] [--columnId <id>]
                  [--itemName <text>] [--description <text>]
                  [--page <n>] [--size <n>] [--sort <field:direction>]

# --name filters by item type: epic, feature, userstory, enablerstory, defect, spike, issue
# --itemName and --description support partial match (case-insensitive)

## Examples
kvasar items list --name epic
kvasar items list --name feature --portfolioId <id>
kvasar items list --itemName "login" --kanbanId <id>
kvasar items list --itemType BUSINESS --page 0 --size 20 --sort itemName:asc

## Hierarchy
kvasar items children <parentId> [--output <json|pretty>] [--quiet]
kvasar items list --parentId <id>

# Examples
kvasar items children 507f1f77bcf86cd799439011
kvasar items children 507f1f77bcf86cd799439011 --output pretty

## Mutations
kvasar items update <id> --file data.json
kvasar items delete <id>

## Special Requirement Elements

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
- `kvasar organizations` - List, get, update, delete, patch
- `kvasar items` - Full CRUD: list (with pagination), get, get-by-key, update, delete, patch, add-relation, children (for epics, features, stories, etc.)
- `kvasar epics list` - List epics with filtering (organization, portfolio, state)
- `kvasar epic create` - Create epic
- `kvasar feature create` - Create feature
- `kvasar userstory create` - Create user story
- `kvasar enablerstory create` - Create enabler story
- `kvasar issue create` - Create issue
- `kvasar teams` - List, create, update
- `kvasar users` - List, create, update
- `kvasar arts` - List, create, update (Agile Release Trains)
- `kvasar kpis` - List, create, update
- `kvasar kanbans` - List, create, update (portfolio, program, solution, team)
- `kvasar objectives` - List, update

## Artifact Structures

See [ARTIFACT_STRUCTURES.md](ARTIFACT_STRUCTURES.md) for detailed field reference and JSON schemas for all agile artifacts (Epics, Features, User Stories, Enabler Stories).


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