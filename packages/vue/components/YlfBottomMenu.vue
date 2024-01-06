<template>
  <nav class="ylf-bottom-menu mx-auto flex justify-between">
    <slot />
  </nav>
</template>

<style>
.ylf-bottom-menu {
  background-color: var(--ylf-bottom-menu-c-bg, #fff);
}

.dark .ylf-bottom-menu {
  background-color: var(--ylf-bottom-menu-c-bg, #222);
}
</style>
