# Kvasar Agile Management CLI

**AI-native, JSON-first CLI for Kvasar Agile Management.**

<https://landing.kvasar.tech>

> Kvasar Agile Management has a powerful web platform for agile planning and SAFe execution — but there is no dedicated developer CLI for interacting with agile entities, AI workflows, portfolio planning, ARTs, PIs, epics, features, sprints, dependencies, or Jira integrations directly from the terminal.

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

## AI Model Compatibility

> ⚠️ Known performance issues with specific models when used in a skill

The following model has been observed to have **low performance** when used with this plugin inside a skill:

| Model | Performance | Note |
|-------|-------------|------|
| `Mistralai/mistral-nemotron` | Low | Poor performance when used in a skill |

## Quick Start

### Installation

```bash
npm install -g @kvasar/cli
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
# Create with minimal JSON: {"name": "My Org"}
kvasar organizations create --file org.json

 `create`: Accepts JSON with `name` (optional), `logo` (optional), 
kvasar organizations get <id>
kvasar organizations update <id> --file org.json
kvasar organizations delete <id>

# Solutions
kvasar solutions list
kvasar solutions create --file data.json
kvasar solutions add-relation <id> --file relation.json


```

## Lean Portfolio Management

- Every Portfolio has a dedicated **Portfolio Kanban**.
- **Epics** are the top-level work items within a Portfolio Kanban.
- Each **Epic** can be broken down into one or more **Features**.
- Features can contain **User Stories**, **Enabler Stories**, and **Issues**.

### Example Commands

```bash

# Portofolios
kvasar portfolios list
kvasar portfolios get <id>
kvasar portfolios create --file data.json

# Get portfolio Kanban
kasar kanbans get <kanban-id>



# Epics List (Epics are the only items in Portfolio Kanban)
kvasar epics list
kvasar epics list --organization <org-id> --portfolio <portfolio-id> --state <state>



# Strategic Themes
kvasar strategic-themes list
kvasar strategic-themes create --file data.json
kvasar strategic-themes add-keyresult <id> --file kr.json

# Value Streams
kvasar value-streams list
kvasar value-streams get <id>
kvasar value-streams create --file data.json

```

## Agile Release Trains (ARTs) management

## Notes

- Every ART (Agile Release Train) has a dedicated **Program Kanban**. (ART= multiple teams)
- **Features** are the top-level work items within a Program Kanban.
- **Features** are the requirements that flow through the Program Kanban.
- Each **Feature** can be broken down into one or more **User Stories**, **Enabler Stories**, and **Issues**.

## Team management

## Notes

- Every Team has a dedicated **Team Kanban**.
- **Stories and Issues** are the top-level work items within a Team Kanban.
- **Stories and Issues** are the requirements that flow through the Team Kanban.

```bash

# Teams
kvasar teams list
kvasar teams create --file data.json

# Get Team Kanban
kasar kanbans get <kanban-id>

# Arts
kvasar arts list
kvasar arts create --file data.json
kvasar arts assign --feature KV-101 --art ART-1 --status "In Progress"

# Get Program Kanban
kasar kanbans get <kanban-id>

```


## Task / Requirements Management

- Each **Epic** can be broken down into one or more **Features**.
- Features can contain **User Stories**, **Enabler Stories**, and **Issues**

### Type of tasks and requirements

epic, feature, userstory, enablerstory, issue  

### Requirements Hierarchy Breakdown  


```bash

              [EPIC]
                │
                ▼
            [FEATURE]
                │
   ┌────────────├────────────┐
   ▼            ▼            ▼
[USER STORY] [ENABLER] [ISSUE]



## Single Epic
kvasar epic create

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

- `kvasar value-streams` — Full CRUD + stages, solutions, arts, copy
- `kvasar strategic-themes` — Full CRUD + keyresults, budgetdistribution
- `kvasar solutions` — Full CRUD + relations
- `kvasar pis` — Program Increments (get, update, delete, add-sprint)
- `kvasar portfolios` — List, create, update
- `kvasar organizations` — Get, update, delete, patch
- `kvasar items` — Get, update, delete, patch, add-relation (for epics, features, stories, etc.)
- `kvasar epics` — List epics with filtering (organization, portfolio, state)
- `kvasar teams` — List, create, update
- `kvasar users` — List, create, update
- `kvasar arts` — List, create, update (Agile Release Trains)
- `kvasar kpis` — List, create, update
- `kvasar kanbans` — List, create, update (portfolio, program, solution, team)
- `kvasar objectives` — List, update
- `kvasar items` - Full CRUD: list (with pagination), get, get-by-key, update, delete, patch, add-relation, children (for epics, features, stories, etc.)
- `kvasar epics list` - List epics with filtering (organization, portfolio, state)
- `kvasar epic create` - Create epic
- `kvasar feature create` - Create feature
- `kvasar userstory create` - Create user story
- `kvasar enablerstory create` - Create enabler story
- `kvasar issue create` - Create issue

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

## Publishing

### Build

```bash
npm run build
```

### Pre-publish validation

```bash
npm pack --dry-run  # Inspect what will be published
npm pack            # Create .tgz for manual inspection
```

### Publish

```bash
npm publish          # Uses prepublishOnly → build + typecheck first
npm publish --tag beta  # For pre-release versions
```

### Version bumping

```bash
npm run version:patch  # 0.2.0 → 0.2.1
npm run version:minor  # 0.2.0 → 0.3.0
npm run version:major  # 0.2.0 → 1.0.0
```

### Release checklist

1. Update version with one of the `npm run version:*` scripts
2. Run `npm pack --dry-run` and verify the file list
3. Run `npm pack` and inspect the `.tgz` manually
4. Publish with `npm publish`
5. Verify installation from a clean directory: `npm install -g @kvasar/cli`
6. Tag the release in git: `git tag v<version> && git push --tags`

## License

MIT © Kvasar Technologies
