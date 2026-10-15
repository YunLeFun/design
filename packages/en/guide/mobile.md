---
outline: deep
---

<script setup>
import MobileInteractionDemo from '../../.vitepress/theme/components/MobileInteractionDemo.vue'
</script>

# Mobile interaction and motion

Mobile interfaces share the same colors, typography roles, radii and state semantics. Adapt target sizes to the input device; retain the application's navigation framework. The interactive example uses Chinese labels and the actual shared components.

<MobileInteractionDemo />

## Touch and layout

On coarse pointers, buttons, segmented choices, menu options, selects and close buttons have targets of at least **44 × 44 CSS px**, including small variants. Switch and Checkbox retain their visual dimensions while reserving margins for larger transparent hit areas. Keep those margins and associate visible labels with controls. CSS pixels are a Web convention, not a universal conversion of native points; see [Apple's button guidance](https://developer.apple.com/design/human-interface-guidelines/buttons).

Hover feedback only runs with a fine pointer that supports hover. Touch uses pressed, selected and expanded states. Long button labels wrap; use two or three short segmented choices. In crowded headers, place infrequent view choices in an existing toolbar menu and show the current view. Prefer 16px editable text and allow zoom; inputs and application navigation remain outside this change.

## Motion tokens

| Purpose                | Token                                        | Default                      |
| ---------------------- | -------------------------------------------- | ---------------------------- |
| Touch target           | `--ylf-touch-target`                         | 44px                         |
| Dialog viewport gutter | `--ylf-viewport-gutter`                      | 16px                         |
| Press                  | `--ylf-duration-press` / `--ylf-press-scale` | 100ms / 0.98                 |
| State / release        | `--ylf-duration-fast`                        | 160ms                        |
| Enter / expand         | `--ylf-duration-enter`                       | 240ms                        |
| Dialog exit / collapse | `--ylf-duration-exit`                        | 160ms                        |
| Switch / indicator     | `--ylf-duration-normal`                      | 240ms                        |
| Pointer hover lift     | `--ylf-hover-lift`                           | -1px                         |
| Standard easing        | `--ylf-ease-standard`                        | `cubic-bezier(0.2, 0, 0, 1)` |
| Soft spring            | `--ylf-ease-spring` / `--ylf-duration-slow`  | `linear()` spring / 480ms    |

Use the soft spring only for small movements that answer an action, such as the switch thumb stretching on press and settling on release; colors, opacity and overlays keep the standard easing. Existing tokens, including the bounce easing, remain available. Static cards should use `:hoverable="false"`. Motion explains state changes without delaying input. Following the optional-motion principle in [Apple's motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion), reduced motion disables transitions, overlay/disclosure animations, button/card movement and spinner rotation. Final state, readable loading labels and `aria-busy` remain available.

## Overlays and integration

Dialog uses `100dvh` with a `vh` fallback, safe-area gutters and internal scrolling. Popover, Select and DropdownMenu use Reka's available-space and collision handling. Preserve Reka keyboard behavior, Escape and focus restoration. Use `portalTo` or `ConfigProvider.teleportTo` to keep overlays inside a local theme boundary.

Public models and events stay compatible. Touch hit areas, wrapping and overlay bounds improve, so check compact consumer layouts. Map variables within the new view before replacing components. Cook retains Ionic navigation and its classic view. Repository changes do not automatically upgrade or publish consumer packages.

Run `pnpm exec vite --config test/mobile/vite.config.ts`, then `python3 scripts/qa/mobile.py http://127.0.0.1:3102` with Python Playwright and Chrome installed. The script records touch, narrow-screen, dark-theme, reduced-motion, disabled-state, scroll and focus checks with screenshots. Browser emulation does not replace real iOS, keyboard and VoiceOver verification.
