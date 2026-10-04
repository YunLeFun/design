---
outline: deep
---

# Component acceptance {#组件验收}

On 2026-10-01, `@yunlefun/vue@0.4.0` completed baseline acceptance of the existing 15 Reka UI wrappers: public APIs, keyboard/focus, accessible names, themes and distribution. New components follow actual product needs.

## Environment and results {#验收环境与结果}

- Chromium at 1280px desktop, 768px tablet and 390px mobile, in both themes: 90 component/layout/theme scenarios.
- axe WCAG 2 A/AA and WCAG 2.1 AA checks on previews and expanded Dialog, Popover, Select, Dropdown Menu and Tooltip.
- Real browser keyboard selection, disabled item skipping, dialog focus trap, Escape, focus restoration, native FormData and local theme Portals.
- Touch checks for dialog close controls, menu items and slider targets; reduced motion checks for Progress and Slider.
- 85 baseline Vitest tests, type checks, lint, Nuxt/docs builds, Registry installation and independent consumer builds passed.
- All 22 `Ylf*` components were imported from npm tarball public paths and type checked/built in an independent Vue/Vite project.

This browser acceptance covers Chromium. Safari, Firefox, physical screen readers and application specific form/theme configuration still need validation where consumed.

## Components and public behavior {#组件与公开行为}

| Component         | Verified behavior                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Accordion         | Single/multiple, collapse, named slots, disabled items, Home/End focus                                            |
| Avatar            | Alt text, failed image fallback, complete fallback name                                                           |
| Checkbox          | Three state ARIA, Space, labels, disabled state, native form values                                               |
| Dialog            | Titles/descriptions, hidden title, focus trap, Escape/backdrop/close, focus restoration, attributes, local Portal |
| Dropdown Menu     | Arrows, Home/End, disabled items, empty value, controlled state, attributes, local Portal                         |
| Popover           | State, Escape, content attributes/name, local Portal                                                              |
| Progress          | Matching visual/ARIA values, bounds, invalid maximum, indeterminate state, reduced motion                         |
| RadioGroup        | Selection, disabled state, group name, rapid arrows, matching focus/value, disabled skipping                      |
| Segmented Control | Reselect retention, arrows, Space, disabled state, icon names, count contrast                                     |
| Select            | Selection, keyboard, disabled state, trigger name, FormData/required, local Portal                                |
| Separator         | Decorative/semantic sections, vertical orientation                                                                |
| Slider            | Endpoint names, keyboard steps/bounds, disabled focus, valueCommit, touch, reduced motion                         |
| Switch            | Space/Enter, controlled state, disabled state, name, native form values                                           |
| Tabs              | Tab/panel ARIA, automatic arrow selection, disabled items, content slots                                          |
| Tooltip           | Trigger attributes/name, focus, description association, Escape, disabled state, local Portal                     |

## Fixes in this acceptance {#本轮修复}

Select forwards name/required to its form control. Overlay `portalTo` preserves local themes. Dialog, Popover and Dropdown Menu forward content attributes; Tooltip forwards trigger attributes.

RadioGroup synchronizes selection after Reka moves focus, handling rapid keyup selection gaps in 2.10.x. Reka still owns focus movement and disabled filtering.

Slider names single/range endpoints. Checkbox examples associate labels. Avatar fallback retains complete alt text. Segmented counts use readable text tokens. Progress keeps display and ARIA consistent for invalid/unknown values.

Pregenerated declarations on component subpaths avoid internal Reka resolution problems for independent pnpm consumers. Runtime SFCs remain compilable/customizable with unchanged import paths.

## Visual refinement (0.4.1) {#视觉打磨-0-4-1}

Controls, recesses and overlays have separate surface/shadow tokens. Buttons gain fine edges and pressed feedback; overlays gain highlights, frosted surfaces and layered shadows. Selection, Tabs and Accordion have clearer active states. The homepage demonstrates day/night and dialogs; the Dialog demo includes saving a creation.

Behavior, light/dark, 390px/768px/desktop, text contrast and reduced motion were checked again. Component scoped animation names prevent collisions between overlays.

## Bilingual documentation and night refinement (0.4.2) {#双语与夜空优化-0-4-2}

Guidelines and component documentation have corresponding Simplified Chinese and English pages, including preview controls, interactive labels, source examples and accessible names. Language switching retains pages and sections while keeping the global appearance preference. Dialog adds optional `closeLabel`, retaining its Chinese default.

Night backgrounds use subdued blue gray with a brightness ladder for pages, content and raised surfaces. Silver blue cloud highlights, shaded faces and contact shadows retain volume. Light mode supporting text is slightly darker for readability on recessed and soft surfaces.

## Site navigation (2026-10-04, unreleased source) {#站点导航-2026-10-04-源码待发布}

`YlfNavigation`, `YlfNavigationLink` and `YlfNavigationTrigger` reuse shared tokens and Reka's attribute merging and menu behavior. Seven regression tests cover landmark names/current pages, single router anchors with event forwarding, Enter/Escape menu operation, native disabled buttons, shared-underline movement, resizing/wrapping, static mode and observer cleanup. Independent tarball verification imports the components and compiles a navigation template.

Chinese and English demos cover horizontal/vertical navigation, current pages, local light/dark themes, site switching and disabled triggers. Browser checks cover adjacent current/focus states, menu selection and restored focus, wrapping and no horizontal overflow on narrow screens. The main site retains its local implementation until a package release and dependency upgrade.

## Reproduction and future releases {#重现与后续发布}

```bash
pnpm lint
pnpm typecheck
pnpm exec vitest run
pnpm audit
pnpm ui:verify
pnpm vue:verify
pnpm nuxt:verify
pnpm registry:verify
pnpm docs:build
```

`vue:verify` packs UI/Vue, installs tarballs independently, imports every component and compiles real templates using readonly options, v-model and form props. Release includes this check.

Registry verification installs Button/Dialog by URL, compares source and builds consumers. Inline SVGs and an empty local icon map avoid reliance on a third party icon service.

Update regression tests and documented scope when public components change, following [Component architecture](/en/guide/architecture).
