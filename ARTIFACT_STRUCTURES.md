# Kvasar Agile Artifacts: Data Structure Reference

This document describes the required and optional fields for creating and managing agile artifacts in Kvasar: **Epics**, **Features**, **User Stories**, and **Enabler Stories**.

## Overview

All artifacts share a common base structure (the `Item` schema) and require a **type discriminator** field `name` to identify the artifact type.

> **Important**: The `name` field must contain the literal string value corresponding to the artifact type (e.g., `"epic"`, `"feature"`, `"userstory"`, `"enablerstory"`). This is not your title.

### SAFe Hierarchy

```
Epic (Portfolio) → Feature (Program/Solution) → User Story / Enabler Story (Team)
```

---

## 1. Epic

**Type discriminator**: `"name": "epic"`

Epics are large initiatives that live in a **Portfolio Kanban**. They represent significant investments and are broken down into Features.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Must be `"epic"` |
| `itemName` | string | Display name for the epic (required) |
| `code` | string | Short code identifier (e.g., `"CLINICAL"`) |
| `description` | string | Epic title and detailed description |
| `epicType` | string | One of: `"solutionEpic"`, `"portfolioEpic"`, `"programEpic"` |
| `epicOwnerId` | string | User ID of the Epic Owner |
| `kanbanId` | string | Portfolio Kanban board ID |
| `columnId` | string | Kanban column ID where the epic is placed |
| `ownerId` | string | User ID of the owner (often same as epicOwnerId) |
| `portfolioId` | string | Portfolio ID |

### Required Base Item Fields

These fields come from the base `Item` schema:

| Field | Type | Description |
|-------|------|-------------|
| `columnId` | string | Column ID where the item is found |
| `kanbanId` | string | Kanban board ID |
| `name` | string | **Type discriminator**: `"epic"` |
| `ownerId` | string | Owner user ID |
| `parentId` | string | Parent item ID |
| `portfolioId` | string | Portfolio ID |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `dueDate` | string (date-time) | Target completion date |
| `startDate` | string (date-time) | Planned start date |
| `expectedBenefit` | integer | Quantified expected benefit (at completion) |
| `valueStreams` | array | Array of ValueStream objects |
| `economicalData` | object | Economic data (budget, ROI, etc.) |
| `problemStatement` | string | Problem being addressed |
| `businessOutComeHypothesis` | string | Expected business outcome |
| `leadingIndicators` | string | Key performance indicators |
| `nonFunctionalRequirements` | string | Non-functional requirements |
| `notes` | string | Additional notes |
| `WSJF` | string | Weighted Shortest Job First score (often calculated) |
| `assigned` | boolean | Assignment status |
| `assignedToArt` | boolean | Whether assigned to an ART |
| `forecastedEpicCost` | integer | Predicted cost |
| `forecastedEpicDurationInTime` | integer | Predicted duration |
| `ARTId` | string | Agile Release Train ID |

### Example Epic JSON

```json
{
  "name": "epic",
  "itemName": "Clinical Epic",
  "code": "CLINICAL",
  "description": "Clinical Forecasting Platform with Foresight",
  "epicType": "portfolioEpic",
  "epicOwnerId": "63f66a33e3a92300120c5ee4",
  "portfolioId": "6406330ba1c8c35d1c5edb66",
  "kanbanId": "6406330ba1c8c35d1c5edb65",
  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",
  "ownerId": "63f66a33e3a92300120c5ee4"
}
```

---

## 2. Feature

**Type discriminator**: `"name": "feature"`

Features are capabilities that deliver value to users/customers. They live in a **Program or Solution Kanban** and are children of Epics.

> **SAFe Hierarchy Note**: Features belong to a Program Kanban (ART) or Solution Kanban, not to the Portfolio Kanban directly.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Must be `"feature"` |
| `description` | string | Feature title and detailed description |
| `kanbanId` | string | **Program/Solution** Kanban board ID (not Portfolio) |
| `columnId` | string | Kanban column ID |
| `ownerId` | string | User ID of the feature owner |
| `portfolioId` | string | Portfolio ID |
| `parentId` | string | Parent epic ID |

### Required Base Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `columnId` | string | Column ID |
| `kanbanId` | string | Kanban board ID |
| `name` | string | **Type discriminator**: `"feature"` |
| `ownerId` | string | Owner user ID |
| `parentId` | string | Parent item ID (epic ID) |
| `portfolioId` | string | Portfolio ID |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `benefitHypothesis` | string | Expected benefit and how it will be measured |
| `acceptanceCriteria` | string | Criteria for feature acceptance |
| `dor` | string | Definition of Ready status: `"todo"`, `"inProgress"`, or `"ready"` |
| `featureOwnerId` | string | User ID of the designated Feature Owner |
| `normalizedStoryPoints` | string | Normalized story points for estimation |
| `priorizationId` | integer | Prioritization identifier |
| `isMvp` | boolean | Whether this feature is part of the Minimum Viable Product |
| `teams` | array | Array of `{ "id": "team-id" }` objects |
| `programIncrementId` | string | Program Increment (PI) ID |
| `solutionId` | string | Solution ID (for solution context) |
| `artId` | string | ART ID (read-only) |
| `context` | string | Context for the feature: `"Continuous Improvement"`, `"Technologic Evolution"`, or `"Others"` |
| `notes` | string | Additional notes |

### Example Feature JSON

```json
{
  "name": "feature",
  "description": "Data Anonymization Service",
  "portfolioId": "6406330ba1c8c35d1c5edb66",
  "kanbanId": "63fb12339001225a2af32ce5",
  "columnId": "91dafed8-d4c4-48b6-b788-8f12cfd6bda6",
  "ownerId": "63f66a33e3a92300120c5ee4",
  "parentId": "6a19ce037c6bb2446519df03",
  "benefitHypothesis": "Implementing data anonymization will improve privacy compliance by 100%",
  "acceptanceCriteria": "All PII fields are masked before storage",
  "isMvp": true,
  "context": "Continuous Improvement"
}
```

---

## 3. User Story

**Type discriminator**: `"name": "userstory"`

User Stories represent small, user-valued pieces of functionality. They are children of Features and belong to a team.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Must be `"userstory"` |
| `itemName` | string | Display name for the user story (required) |
| `description` | string | Story title and description (often formatted as "As a [role], I want [capability] so that [benefit]") |
| `kanbanId` | string | Team Kanban board ID |
| `columnId` | string | Kanban column ID |
| `ownerId` | string | User ID of the story owner |
| `portfolioId` | string | Portfolio ID |
| `parentId` | string | Parent feature ID |

### Required Base Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `columnId` | string | Column ID |
| `kanbanId` | string | Kanban board ID |
| `name` | string | **Type discriminator**: `"userstory"` |
| `ownerId` | string | Owner user ID |
| `parentId` | string | Parent item ID (feature ID) |
| `portfolioId` | string | Portfolio ID |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `acceptanceCriteria` | string | Acceptance criteria for the story |
| `storyPoints` | integer | Story point estimate (complexity) |
| `priorityId` | integer | Priority ranking (lower = higher) |
| `notes` | string | Additional notes |
| `teamId` | string | Team ID (auto-derived, read-only) |

### Example User Story JSON

```json
{
  "name": "userstory",
  "description": "As a user, I want to upload a dataset for anonymization so that I can protect sensitive information",
  "portfolioId": "6406330ba1c8c35d1c5edb66",
  "kanbanId": "6406330ba1c8c35d1c5edb65",
  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",
  "ownerId": "63f66a33e3a92300120c5ee4",
  "parentId": "69447ddae31fcc4aa35a873f",
  "storyPoints": 5,
  "priorityId": 1,
  "acceptanceCriteria": "The system accepts CSV and JSON files up to 1GB in size",
  "notes": "Needs to integrate with S3 storage"
}
```

---

## 4. Enabler Story

**Type discriminator**: `"name": "enablerstory"`

Enabler Stories address technical debt, infrastructure, or non-functional requirements. They are similar to User Stories but focus on architectural, compliance, or DevOps concerns.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Must be `"enablerstory"` |
| `itemName` | string | Display name for the enabler story (required) |
| `kanbanId` | string | Team or Program Kanban board ID |
| `columnId` | string | Kanban column ID |
| `ownerId` | string | User ID of the story owner |
| `parentId` | string | Parent feature or epic ID |
| `portfolioId` | string | Portfolio ID |

### Required Base Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `columnId` | string | Column ID |
| `kanbanId` | string | Kanban board ID |
| `name` | string | **Type discriminator**: `"enablerstory"` |
| `ownerId` | string | Owner user ID |
| `parentId` | string | Parent item ID (feature or epic ID) |
| `portfolioId` | string | Portfolio ID |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Story title and description |
| `acceptanceCriteria` | string | Acceptance criteria |
| `priorityId` | integer | Priority ranking |
| `storyPoints` | integer | Story point estimate |
| `notes` | string | Additional notes |
| `teamId` | string | Team ID (read-only) |
| `enablerType` | string | Type of enabler (see below) |

### Enabler Types

The `enablerType` field accepts these enum values:

| Value | Description |
|-------|-------------|
| `defect` | Fixing bugs or quality issues |
| `devOps` | Infrastructure, CI/CD, automation |
| `refactoring` | Code restructuring for maintainability |
| `spike` | Research or investigation tasks |
| `execution` | Performance tuning or optimization |
| `configuration` | System configuration changes |
| `performance` | Performance improvements |

### Example Enabler Story JSON

```json
{
  "name": "enablerstory",
  "description": "Set up CI/CD pipeline for automated testing",
  "portfolioId": "6406330ba1c8c35d1c5edb66",
  "kanbanId": "6406330ba1c8c35d1c5edb65",
  "columnId": "477cefb0-00c2-48f8-b653-05942a0335c3",
  "ownerId": "63f66a33e3a92300120c5ee4",
  "parentId": "69447ddae31fcc4aa35a873f",
  "enablerType": "devOps",
  "storyPoints": 3,
  "acceptanceCriteria": "Pipeline runs tests on every PR with 95% coverage"
}
```

---

## Common Base Item Fields (All Artifacts)

These fields are inherited from the base `Item` schema and are required for all artifact types unless otherwise noted.

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
| `name` | string | **Yes** | Type discriminator (artifact type) |
| `columnId` | string | **Yes** | ID of the kanban column where the item resides |
| `kanbanId` | string | **Yes** | ID of the kanban board |
| `ownerId` | string | **Yes** | ID of the user who owns the item |
| `parentId` | string | **Yes (except Epics)** | ID of the parent item. Required for Features, User Stories, and Enabler Stories. For Epics, this field is optional or can be omitted. |
| `portfolioId` | string | **Yes** | ID of the portfolio |
| `creationDate` | string (date-time) | No | Timestamp of creation (read-only) |
| `lastUpdate` | string (date-time) | No | Timestamp of last modification (read-only) |
| `keyResultsId` | array | No | References to Key Results |
| `color` | string | No | Color of the item on the kanban board |
| `released` | boolean | No | Whether the item has been released |
| `index` | integer | No | Sort order within the column |
| `files` | array | No | Array of file attachments |
| `numeration` | string | No | Human-readable numeration (auto-generated) |
| `numerationId` | string | No | Numereration pattern ID |
| `comments` | array | No | Array of comments |
| `itemName` | string | No | name of the item field |
| `state` | string | No | Current workflow state (read-only) |
| `type` | string | No | Either `"business"` or `"enabler"` |
| `relations` | array | No | Related items |
| `children` | array | No | Child items (read-only) |
| `numChildren` | integer | No | Count of children (read-only) |
| `parent` | object | No | Parent summary (read-only) |

---

## Fetching Child Items

Use the dedicated `children` endpoint to retrieve all direct children of an item:

- **CLI**: `kvasar items children <parentId>`
- **API**: `GET /api/v1/items/{parentId}/children`

For nested hierarchies, recursively fetch children of each item.

---

## Field Type Reference

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"My Epic Title"` |
| `integer` | Whole number | `5`, `100` |
| `boolean` | True/false | `true`, `false` |
| `date-time` | ISO 8601 timestamp | `"2026-01-01T00:00:00.000Z"` |
| `array` | List of values | `[1, 2, 3]` or `[{"id": "abc"}]` |
| `object` | Nested structure | `{ "key": "value" }` |

---

## Quick Reference: Required Fields Summary

### Epic

```json
{
  "name": "epic",
  "itemName": "string",
  "code": "string",
  "description": "string",
  "epicType": "solutionEpic | portfolioEpic | programEpic",
  "epicOwnerId": "userId",
  "kanbanId": "kanbanId",
  "columnId": "columnId",
  "ownerId": "userId",
  "portfolioId": "portfolioId"
}
```

### Feature

```json
{
  "name": "feature",
  "description": "string",
  "kanbanId": "programKanbanId",
  "columnId": "columnId",
  "ownerId": "userId",
  "parentId": "epicId",
  "portfolioId": "portfolioId"
}
```

### User Story

```json
{
  "name": "userstory",
  "itemName": "string",
  "description": "string",
  "kanbanId": "teamKanbanId",
  "columnId": "columnId",
  "ownerId": "userId",
  "parentId": "featureId",
  "portfolioId": "portfolioId"
}
```

### Enabler Story

```json
{
  "name": "enablerstory",
  "itemName": "string",
  "kanbanId": "kanbanId",
  "columnId": "columnId",
  "ownerId": "userId",
  "parentId": "featureOrEpicId",
  "portfolioId": "portfolioId"
}
```

---

## Notes

- All IDs (e.g., `userId`, `portfolioId`, `kanbanId`, `columnId`) must be valid UUIDs or database IDs from your Kvasar instance.
- The `parentId` for top-level items (Epics in Portfolio Kanban) is typically `"root"` or a specific root epic ID depending on your configuration.
- When creating features, ensure the `kanbanId` points to the **Program** or **Solution** kanban, not the Portfolio kanban.
- The `type` field is not required for creation; it defaults based on the artifact type.
- Field `m_Task` for User Stories expects an array of Task objects with structure like `{ "name": "Task description", "status": "todo" | "inProgress" | "done" }`.
- Read-only fields (e.g., `artId`, `teamId`, `state`) are populated automatically by the system and should not be included in creation requests.

---

## See Also

- [CLI Commands](../README.md#command-groups)
- [API Documentation](api-docs.txt)
- [SAFe Framework](https://www.scaledagileframework.com/)
