---
outline: deep
---

# Application migration {#应用迁移}

This page tracks migration from application specific styles to YunLeFun Design. System changes, npm publication, dependency upgrades and deployment are separate steps.

## Site navigation extraction (2026-10-04) {#站点导航回流-2026-10-04}

The spacing and state rules validated on the main site now live in `YlfNavigation`, `YlfNavigationLink` and `YlfNavigationTrigger`; see [Navigation](/en/vue/components/navigation/). This is new Design source, not a published npm release. The main site still uses its local implementation.

After release, upgrade to a pinned package version, wrap existing `NuxtLink` instances with `YlfNavigationLink as-child`, replace the site-switch trigger, then remove local navigation CSS. Preserve routing, menu contents, authentication slots and drawer behavior. Recheck adjacent current/focus states, focus restoration, themes and mobile layout.

## Current status {#当前状态}

| Scope                             | Status                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| Repository/documentation name     | Repository: Design; Chinese brand: 云乐坊; English: YunLeFun    |
| Design/UI boundaries and packages | Documented in this library                                      |
| Shared theme                      | Sky blue with vivid solid accents                               |
| Vue and documentation             | Shared tokens with brand display variants                       |
| npm and online Registry           | Tokens/components published; Registry accepted per release      |
| Main site                         | Loads `@yunlefun/ui/css`; retains business `App*` wrappers      |
| Other applications                | Dependency and visual acceptance not yet completed individually |
| Documentation domain              | `ui.yunle.fun`; renaming a repository does not migrate a domain |

## Main site differences to converge {#主站需要收敛的差异}

| Area              | Current implementation                                  | Target                                                             |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| Brand             | Main site sky blue; shared library formerly iris purple | Shared sky blue from the same source                               |
| Variables         | Shared CSS plus business theme variables                | Map reusable framework variables to tokens; retain business values |
| Font roles        | ZCOOL XiaoWei display and local subsets                 | Consistent heading/body roles; explicitly scoped brand fonts       |
| Controls          | `AppButton` and other legacy API adapters               | Gradual page migration to public `Ylf*` APIs                       |
| Clouds/membership | Business coupled `SkyScene`, `SkyHero`, `MemberPass`    | Separate presentation data before proposing shared brand modules   |

## Variable adaptation {#变量适配}

Load shared styles first, then compatible aliases at the application theme boundary. This is a **mapping example**, not a released adapter:

```css
:root,
.dark {
  --ui-primary: var(--ylf-c-brand);
  --ui-bg: var(--ylf-c-bg);
  --ui-bg-muted: var(--ylf-c-bg-soft);
  --ui-bg-elevated: var(--ylf-c-surface);
  --ui-text: var(--ylf-c-text);
  --ui-text-muted: var(--ylf-c-text-2);
  --ui-border: var(--ylf-c-border);
  --ylf-surface: var(--ylf-c-surface);

  --background: var(--ylf-c-bg);
  --foreground: var(--ylf-c-text);
  --primary: var(--ylf-c-brand);
  --primary-foreground: var(--ylf-c-text-on-accent);
}
```

Map shared tokens to framework variables in one direction to avoid cycles. Remove conflicting hardcoded values and check CSS order, nested themes and Portals. Appending aliases alone does not complete migration.

## Migration order {#迁移顺序}

1. Publish and pin shared versions; install themes and verify light/dark and style order.
2. Validate brand expression on home, cards/filters on explore, and forms/states in settings.
3. Refine public APIs and composition on real pages before expanding to authentication, profiles, membership and wallets.
4. Record scope, verification and exceptions per application, then remove unused legacy styles and wrappers.

Applications retain authentication, payment state machines, permissions and data fetching. The library receives presentation props/state and emits actions for the application to handle.
