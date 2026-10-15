# AI agent components

Agent overview, connection status and task cards come from the el-bot local console and are maintained as reusable design components. Source and Registry changes are experimental and pending npm and hosted Registry publication.

- [Agent Status](/en/vue/components/agent-status/): semantic connection and task indicators.
- [Agent Card](/en/vue/components/agent-card/): identity, connection content and action slots.
- [Agent Task](/en/vue/components/agent-task/): task status, identifier, waiting reason and action slots.

## Adoption and maintenance

Use the same tokens as other `Ylf*` controls. Load published styles from `@yunlefun/ui/css`; the application follows the system theme by applying `ylf-theme-dark` to the root. Consume existing buttons, selects and dialogs from the published `@yunlefun/vue` package.

Run `pnpm registry:build` and install source from `packages/public/r/ylf-agent.json` into the application's `src/components/ui/`. The hosted URL is usable only after deployment. Registry payloads come from canonical source, but installed copies do not update automatically. el-bot provides a local sync command and byte-for-byte `--check` for the four component/type files, retaining the MIT license.

New components become available through public component subpaths in the next Vue package release. Do not depend on absolute local paths or unpublished npm versions.

## Application boundary

Components display explicit state and localized text. They do not connect QQ, invoke models, store credentials, start or stop agents, or approve actions. Applications own state mapping, task admission, permissions, interruption confirmation and execution.

Show transport, model and task states separately. A running process does not prove that all services are ready. Listening callbacks do not prove QQ connectivity; unverified state must remain explicit. Do not invent percentage progress. The application owns buttons in action slots.

Long identifiers, paths and descriptions wrap. Information cards have no continuous animation. Enable `live` only on a single summary that needs announcements.
