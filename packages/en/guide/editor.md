---
outline: deep
---

<script setup>
import EditorSpecimen from '../../.vitepress/theme/components/EditorSpecimen.vue'
</script>

# Editor interfaces {#editor-复杂操作界面}

Editor is the YunLeFun design profile for drawing, image editing, timelines and other complex workspaces. It shares sky-blue branding and semantic states while maintaining its own density, neutral surfaces and property controls. Its first application is the **Saier** canvas and watermark plugin.

Consumer pages retain generous reading space and larger corners. Editor puts the work at the center. Borrow clear hierarchy, compact property rows and fine separators from macOS tool panels; omit decorative window controls that have no corresponding browser behavior.

## Interactive specimen {#交互样板}

Switch themes, select layers and adjust opacity. This specimen demonstrates the design language without simulating a drawing engine.

<EditorSpecimen english />

## Visual foundations {#视觉基础}

| Role      | Light     | Dark      |
| --------- | --------- | --------- |
| Panel     | `#f6f6f7` | `#292a2d` |
| Toolbar   | `#ebebed` | `#303033` |
| Input     | `#ffffff` | `#353639` |
| Workspace | `#d7d7da` | `#202123` |
| Body text | `#292a2e` | `#eeeef0` |
| Accent    | `#2563eb` | `#60a5fa` |

- Use the system UI font, including the macOS system font and PingFang for Chinese. Do not download display fonts. Use 12px property labels, 11px supporting text and tabular numbers.
- Use 5px control corners and 10px floating-panel corners. Distinguish layers through surfaces, 1px separators and soft neutral shadows.
- Keep the six brand colors in the logo. Blue marks selection, keyboard focus and primary actions. Keep canvas surroundings neutral; theme changes must not alter the image itself.
- Avoid consumer-style large headings, marketing cards, repeated nested cards and broad gradients in editor panels.

## Density and controls {#密度与控件}

| Element                 | Mouse / trackpad | Coarse pointer        |
| ----------------------- | ---------------- | --------------------- |
| Small button            | 24px             | 40px                  |
| Input / standard button | 28px             | 40px                  |
| Layer / toolbar row     | 32px             | 44px                  |
| Panel heading           | 32px             | 44px                  |
| Panel width             | From 272px       | Adapt to the viewport |

Property inspectors align labels, values and units. Group coordinates and dimensions instead of making a card for each number. Keep the opacity label, slider and value in one row, and show colors as a swatch with a value. Place export formats side by side and emphasize the primary format with the solid brand color.

Icon buttons need accessible names and tooltips. Toolbars support arrow-key navigation; properties are reached with Tab. Focus must be distinguishable beyond color alone. A native file input may transparently cover a clearly labeled import control while retaining keyboard focus and file selection behavior.

Preserve values when advanced settings collapse. Selecting a layer does not modify the work. Continuous changes such as dragging opacity produce one undo step when committed. Closing a plugin panel retains the document. Touch devices need adequate target sizes; viewport width alone must not shrink controls.

## Integration {#接入}

Load Editor styles explicitly. They do not modify consumer `--ylf-c-*` or `--ylf-radius-*` tokens:

```ts
import '@yunlefun/ui/css'
import '@yunlefun/ui/editor.css'
```

```html
<section data-ylf-editor-theme="dark" class="my-editor">
  <!-- Editor components consume --ylf-editor-* tokens. -->
</section>
```

```css
.my-editor {
  background: var(--ylf-editor-panel);
  color: var(--ylf-editor-fg);
  font: var(--ylf-editor-text) / 1.45 var(--ylf-editor-font);
}
.my-editor input {
  min-height: var(--ylf-editor-control);
  border-radius: var(--ylf-editor-radius);
  background: var(--ylf-editor-field);
}
```

This entry provides tokens only. It neither styles global native elements nor automatically reduces `YlfButton` sizes. Keep complex behavior in Reka UI and connect existing editor controls through an application adapter.

The entry is currently local source. Try it through a workspace or a local package before publication. Saier temporarily vendors the same `editor.css` and maps it through `--saier-*`; switch to a versioned dependency after release. Synchronize and verify vendored copies against the source rather than treating them as a separate design authority.

## Acceptance {#验收}

Verify light and dark themes with mouse and touch input. Truncate long layer names while keeping the full name discoverable. Align numbers, colors and units, and avoid horizontal panel overflow on narrow screens. Import, undo, export and canvas output must remain correct. Respect reduced motion and avoid decorative filters that affect canvas or color judgments.
