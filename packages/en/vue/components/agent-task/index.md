---
title: Agent Task
---

Display a task, execution state, identifier and waiting reason. Use it for running, awaiting approval, completed, failed or idle tasks. No percentage is invented when progress is unknown, and busy does not imply completion.

## Props

| Property      | Description                            | Type            | Default  |
| ------------- | -------------------------------------- | --------------- | -------- |
| `title`       | Region title                           | `string`        | Required |
| `state`       | Presentation state                     | `YlfAgentState` | Required |
| `statusLabel` | Localized, truthful task status        | `string`        | Required |
| `taskId`      | Optional wrapping monospace identifier | `string`        | —        |
| `description` | Current status or waiting reason       | `string`        | —        |

## Slots

| Name      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `default` | Additional task information                                      |
| `actions` | Application-controlled details, interruption or approval actions |

The application must explicitly handle approval and interruption. Cards have no default actions and closing a card never implies approval. Use `unknown` and backend status text for unfamiliar model states. See [agent components](/en/guide/agent-ui).
