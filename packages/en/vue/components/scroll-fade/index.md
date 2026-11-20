---
title: Scroll Fade
---

Use `YlfScrollFade` to indicate that content continues beyond a vertical scroll edge. Each fade disappears when you reach that edge. The component respects reduced transparency and forced colors.

Wrap the scroll element and pass its template ref as `viewport`. That element still owns the height, overflow, keyboard focus, and semantics. Pass a CSS color or theme token as `surface` to match a custom background, and a CSS length as `size` to change the default 24px fade.

`YlfSelect` already includes scroll fades. Layouts with sticky headers can import `useScrollFade` from `@yunlefun/vue/components/scroll-fade` and use the edge opacity variables to position the gradients independently.
