# Admin interfaces

YunLeFun interfaces have two families: Consumer for user-facing experiences and Workspace for task-oriented work. Workspace has Admin and Editor profiles with different densities. They share brand and semantic colors while configuring surfaces, font roles and control sizes separately.

| Dimension        | Consumer                                      | Admin                                                 | Editor                                    |
| ---------------- | --------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| Main tasks       | Browse, explore, convert                      | Query, review, configure, batch operations            | Canvas, timeline, property editing        |
| Visual priority  | Brand and content                             | Data and action hierarchy                             | Working content and tools                 |
| Typography       | System body font; optional brand display font | System font; monospace IDs and logs                   | Compact system font; monospace parameters |
| Default controls | Depends on the product                        | 32px; secondary 28px                                  | 28px; secondary 24px                      |
| Surfaces         | More expressive branding                      | Neutral backgrounds, fine borders, restrained shadows | Continuous panels and workspace           |

## Integration

```ts
import '@yunlefun/ui/css'
import '@yunlefun/ui/admin.css'
```

`admin.css` is an optional token layer. It declares only `--ylf-admin-*`, does not override Consumer or Editor, and has no TDesign, Vue or Reka UI dependency. The entry is currently a source change: confirm that your installed release includes it before importing. YunLeFun/admin temporarily vendors the same file and can switch to the package entry after publication.

Colors support `.dark` / `.ylf-theme-dark` and `.light` / `.ylf-theme-light`. For an isolated preview, set `data-ylf-admin-theme="dark"` or `"light"` on its container. Also load the base theme and select its matching appearance; brand and semantic colors still come from the base.

## Pages and controls

- Keep the title, description and primary action in the page header. Put filters and refresh in the table toolbar, with consistent gaps when filters wrap.
- Use the primary color for primary actions, selected states and links. Pair status colors with text labels; use explicit verbs for destructive actions.
- Use 10px panel corners and 6px control corners, 14px body text, 12–13px supporting text and 22px page titles.
- Center icons and labels in one flex row. Give a separate icon slot an 8px label gap without doubling the component library's existing SVG or loading-icon margin.
- Tables fill their containers. Set minimum column widths where needed and scroll inside the table. Keep short fields fixed and the main field flexible; do not fix the whole table to a width narrower than its container.
- Use semantic tokens for input, hover, selection, disabled, focus, error, empty and loading states. Logs and editors also follow the theme.

## Light, dark and mobile

- Admin has independent neutral surface tokens and inherits `--ylf-c-brand`. Check text, status labels and boundaries in both appearances.
- Below 768px or with a coarse pointer, standard controls grow to 44px and secondary controls to 40px. Do not enlarge text simply because the control is taller.
- Allow headers, filters and forms to wrap. Use `minmax(0, 1fr)` in form grids and wrap or locally scroll long IDs, URLs and logs.
- Tables can become cards with field labels. Preserve tables with local scrolling when comparing columns is essential.
- Drawers fit the viewport. Dialogs retain 16px outer margins and scroll their bodies; cancel, confirm and close remain accessible. Respect the bottom safe area.
- Provide visible keyboard focus and accessible names for icon buttons. Respect reduced motion and theme overlays teleported to the document body.

## Component boundaries

YunLeFun/admin keeps TDesign table, form, pagination and overlay behavior. Its adapter maps `--ylf-admin-*` / `--ylf-*` to `--td-*`. Visual consistency does not require rewriting these controls. Use Reka UI for custom interactions when needed, and avoid maintaining duplicate behavior for the same feature.

Acceptance covers a 1440px desktop, the 768px breakpoint, 390px and 320px screens, both appearances, populated/empty/error states, filters, long forms and overlays. Screenshots establish appearance; also check keyboard operation, scrolling, filtering, closing and persisted theme preferences.

## Reference

[Modern Data Table Variants](https://dribbble.com/shots/27574900-Modern-Data-Table-Variants-for-SaaS-Dashboard-UI) provides visual references for table hierarchy, status labels, filters and mobile lists. Adapt its information organization to the product's own branding, permissions, responsive behavior and accessibility requirements.
