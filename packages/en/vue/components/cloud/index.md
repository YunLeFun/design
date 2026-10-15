---
title: Cloud
---

The cloud illustration shared by every YunLeFun site: five silhouettes, top-left light, a backlit rim and atmospheric perspective. Colors come from the `--ylf-cloud-*` tokens in `@yunlefun/ui` and follow the light and dark themes. It is decorative only: `aria-hidden="true"` and no pointer events.

## Choosing a silhouette

Every shape shares a `490 × 250` canvas and is one continuous curve, so scaling or mirroring never reveals overlapping circles. Mix shapes within a scene to avoid repetition.

- `billow`: a tall layered cloud for focal points.
- `heap`: a broad foreground cumulus, higher on the right.
- `bank`: a long, flat bank along the horizon.
- `puff`: a small round cloud for empty states or mascots.
- `wisp`: a thin, stretched cloud in the distance.

## Depth and performance

Use `--ylf-cloud-haze` (0–1) for distance: higher values mix the body and shadows toward `--ylf-cloud-haze-color` and fade the underside shadow and rim. Set it on the component or a parent.

`volumetric` shapes the lit side with a Gaussian blur. Enable it for one or two focal clouds only; the rest use a gradient approximation that is cheaper to paint.

## Face and motion

`face` renders a small face that stays hidden until the host sets `--ylf-cloud-face-opacity`, for example `0.85` on hover, focus or after a poke. It fades in over `--ylf-duration-slow`, and the eyes blink now and then.

The component itself does not move. Hosts add drifting, entrances and poke squishes: soft movement uses `--ylf-ease-spring` with `--ylf-duration-slow`, while color and opacity use `--ylf-ease-standard`. Under reduced motion these durations become 0 and blinking stops; any looping animation the host adds must respect the same preference.

## Props

| Prop         | Description                                      | Type                                     | Default  |
| ------------ | ------------------------------------------------ | ---------------------------------------- | -------- |
| `shape`      | Cloud silhouette                                 | `billow \| heap \| bank \| puff \| wisp` | `billow` |
| `volumetric` | Shape the lit side with a blur filter            | `boolean`                                | `false`  |
| `face`       | Render a hidden face, revealed by a CSS variable | `boolean`                                | `false`  |

## CSS variables

| Variable                   | Description                                     | Default (light / dark) |
| -------------------------- | ----------------------------------------------- | ---------------------- |
| `--ylf-cloud-haze`         | Atmospheric depth: 0 is near, 1 blends into sky | `0`                    |
| `--ylf-cloud-haze-color`   | Sky color that distant clouds blend into        | `#9cc6ef` / `#1f3354`  |
| `--ylf-cloud-face-opacity` | Face opacity                                    | `0`                    |
| `--ylf-cloud-highlight`    | Lit side                                        | `#fffefa` / `#a6bcd8`  |
| `--ylf-cloud-body`         | Body                                            | `#f2f8ff` / `#3e5679`  |
| `--ylf-cloud-shade`        | Shaded side                                     | `#c6dff5` / `#1c2b44`  |
| `--ylf-cloud-shadow`       | Underside shadow                                | `#83addb` / `#0a1424`  |
| `--ylf-cloud-rim`          | Backlit rim                                     | `#ffffff` / `#cfdff2`  |
| `--ylf-cloud-face`         | Face color                                      | `#5a7fae` / `#0e1a2d`  |

The dark theme defaults to a moonlit night blue. Sites with their own sky can override these tokens on the sky container, for example a dusk palette:

```css
.dark .my-sky {
  --ylf-cloud-highlight: #fff0e7;
  --ylf-cloud-body: #e8d7ed;
  --ylf-cloud-shade: #b6a5d0;
  --ylf-cloud-shadow: #8377ad;
  --ylf-cloud-rim: #ffd9c4;
  --ylf-cloud-face: #6d5a92;
  --ylf-cloud-haze-color: #a48cc4;
}
```

The shape list is also available from the package root: `import { ylfCloudShapes } from '@yunlefun/vue'`, typed as `YlfCloudShape`. The tokens ship in `@yunlefun/ui` 0.0.7; without the shared styles the component falls back to the light palette.
