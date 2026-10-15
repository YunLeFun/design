---
title: Agent Card
---

An overview container for agent identity, description, state, connection information and actions. Surfaces, typography and spacing use shared tokens. Information cards stay still rather than lifting on hover.

## Props

| Property      | Description                           | Type            | Default  |
| ------------- | ------------------------------------- | --------------- | -------- |
| `name`        | Agent name and accessible region name | `string`        | Required |
| `description` | Purpose or current project            | `string`        | —        |
| `state`       | Presentation state                    | `YlfAgentState` | Required |
| `statusLabel` | Localized status text                 | `string`        | Required |

## Slots

| Name      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `avatar`  | Custom identity image; the default is decorative                      |
| `default` | Application content such as connections                               |
| `actions` | Buttons; the application owns permissions, disabled states and events |

The component does not receive credentials, connect services, store approvals or execute actions. Names and descriptions render as escaped text. See [agent components](/en/guide/agent-ui).
