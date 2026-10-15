<script setup lang="ts">
import { computed } from 'vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfSeparator from '../../../vue/components/YlfSeparator.vue'
import { useDocsLocale } from '../composables/useDocsLocale'
import DesignPlayground from './DesignPlayground.vue'
import DesignSpecimens from './DesignSpecimens.vue'

const { text, link } = useDocsLocale()
const entries = computed(() => [
  { title: text('理解设计', 'Understand the design'), description: text('从品牌、视觉基础到页面与交互，了解每一个选择。', 'Explore the choices behind the brand, visual foundations and interactions.'), href: '/guide/design-system', label: text('设计体系', 'Design system'), icon: 'i-ri-compasses-2-line', tone: 'pink' },
  { title: text('开始构建', 'Start building'), description: text('按需接入样式与 Vue 组件，让界面拥有共同的起点。', 'Bring shared styles and Vue components into your next interface.'), href: '/guide/', label: text('接入指南', 'Get started'), icon: 'i-ri-code-s-slash-line', tone: 'cyan' },
  { title: text('逐步统一', 'Build consistency'), description: text('梳理现有界面，从颜色和排版开始迁移到共享规范。', 'Move existing interfaces toward shared colors, typography and patterns.'), href: '/guide/migration', label: text('迁移指南', 'Migration guide'), icon: 'i-ri-route-line', tone: 'coral' },
] as const)
</script>

<template>
  <div class="ylf-design-home">
    <section class="design-hero" aria-labelledby="design-title">
      <div class="design-hero__intro">
        <p class="design-hero__name">
          {{ text('云乐坊设计系统', 'YunLeFun Design') }}
        </p>
        <h1 id="design-title">
          {{ text('让每个界面，', 'A little sky,') }}<br>{{ text('都有晴空的轻盈。', 'in every interface.') }}
        </h1>
        <p class="design-hero__description">
          {{ text('云乐坊的设计语言与组件。以清晰的秩序承载内容，用一点云的想象，连接每一次轻松的交互。', 'The design language and components of YunLeFun. Clear structure, a little imagination, and room for effortless interactions.') }}
        </p>
        <div class="design-hero__actions">
          <YlfButton tag="a" :href="link('/guide/design-system.html')" size="lg">
            {{ text('了解设计体系', 'Explore the design') }}
          </YlfButton>
          <YlfButton tag="a" :href="link('/vue/')" variant="secondary" size="lg">
            {{ text('浏览组件', 'Browse components') }}
          </YlfButton>
        </div>
        <p class="design-hero__note">
          {{ text('轻盈的表面，清晰的反馈。每个细节都可亲手体验。', 'Light surfaces. Clear feedback. Try every detail yourself.') }}
        </p>
      </div>
      <DesignPlayground />
    </section>

    <YlfSeparator variant="spectrum" />
    <DesignSpecimens />

    <section class="design-start" aria-labelledby="design-start-title">
      <div class="design-section-heading">
        <h2 id="design-start-title">
          {{ text('从设计到界面', 'From design to interface') }}
        </h2>
        <p>{{ text('同一套语言，用在不同的产品里。', 'One shared language, across your products.') }}</p>
      </div>
      <!-- 三个入口是一条从理解到落地的航线：彩色航点 + 虚线航迹，卡面保持中性。 -->
      <ol class="design-start__route">
        <li v-for="entry in entries" :key="entry.href" class="design-start__leg" :data-ylf-tone="entry.tone">
          <a class="design-start__stop" :href="link(`${entry.href}${entry.href.endsWith('/') ? '' : '.html'}`)">
            <span class="design-start__marker" aria-hidden="true">
              <span :class="entry.icon" />
            </span>
            <div class="design-start__text">
              <h3>{{ entry.title }}</h3>
              <p class="design-start__description">
                {{ entry.description }}
              </p>
              <span class="design-start__destination">{{ entry.label }}</span>
            </div>
          </a>
        </li>
      </ol>
    </section>
    <footer class="design-home-footer">
      <span>{{ text('云乐坊设计系统', 'YunLeFun Design') }}</span>
      <a href="https://github.com/YunLeFun/design">{{ text('在 GitHub 参与共建', 'Contribute on GitHub') }}</a>
    </footer>
  </div>
</template>

<style scoped>
.ylf-design-home {
  max-width: var(--ylf-layout-page);
  padding: 0 var(--ylf-space-8);
  margin: 0 auto;
}
.design-hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: var(--ylf-space-16);
  padding: 64px 0 72px;
}
.design-hero__name {
  margin: 0 0 var(--ylf-space-6);
  font: 600 26px/1.2 var(--ylf-font-display);
  color: var(--ylf-c-brand);
}
.design-hero h1 {
  margin: 0;
  font-family: var(--ylf-font-heading);
  font-size: var(--ylf-text-display);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.18;
}
.design-hero__description {
  max-width: 28em;
  margin: var(--ylf-space-6) 0 var(--ylf-space-8);
  font-size: 17px;
  color: var(--ylf-c-text-2);
  line-height: 1.9;
}
.design-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ylf-space-3);
}
.design-hero__note {
  margin-top: var(--ylf-space-6);
  color: var(--ylf-c-text-3);
  font-size: var(--ylf-text-sm);
}
.design-start {
  padding: var(--ylf-space-16) 0;
}
.design-section-heading {
  display: flex;
  justify-content: space-between;
  gap: var(--ylf-space-4);
  align-items: baseline;
}
.design-section-heading h2 {
  margin: 0;
  font-size: var(--ylf-text-xl);
  font-weight: 600;
}
.design-section-heading p {
  margin: 0;
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-sm);
}
.design-start__route {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ylf-space-4);
  /* 抵消航点卡片的内边距，让图标与区块标题对齐。 */
  margin: var(--ylf-space-6) -20px 0;
  padding: 0;
  list-style: none;
}
.design-start__leg {
  position: relative;
}
/* 航迹：从本站航点中心连到下一站，颜色取本站强调色。 */
.design-start__leg:not(:last-child)::after {
  position: absolute;
  top: 43px;
  left: 44px;
  right: calc(-1 * var(--ylf-space-4) - 44px);
  height: 2px;
  background: color-mix(in srgb, var(--ylf-accent) 55%, transparent);
  mask: repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 12px);
  content: '';
}
.design-start__stop {
  --_ring: var(--ylf-c-bg);

  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--ylf-space-4);
  height: 100%;
  box-sizing: border-box;
  padding: var(--ylf-space-5, 20px);
  border-radius: var(--ylf-radius-lg);
  color: inherit;
  text-decoration: none;
  transition: background-color var(--ylf-duration-fast) var(--ylf-ease-standard);
}
.design-start__stop:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 2px;
}
.design-start__marker {
  display: grid;
  place-items: center;
  flex: none;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--ylf-accent) 14%, var(--ylf-c-surface));
  color: var(--ylf-accent-text);
  font-size: 24px;
  box-shadow:
    0 0 0 6px var(--_ring),
    inset 0 0 0 1px color-mix(in srgb, var(--ylf-accent) 28%, transparent);
  transition:
    transform var(--ylf-duration-slow) var(--ylf-ease-spring, var(--ylf-ease-standard)),
    box-shadow var(--ylf-duration-fast) var(--ylf-ease-standard);
}
.design-start__text {
  display: flex;
  flex-direction: column;
  gap: var(--ylf-space-2);
}
.design-start h3 {
  margin: 0;
  font-size: var(--ylf-text-lg);
  font-weight: 600;
}
.design-start__description {
  margin: 0;
  color: var(--ylf-c-text-2);
  line-height: var(--ylf-leading-body);
}
.design-start__destination {
  width: fit-content;
  margin-top: var(--ylf-space-1);
  color: var(--ylf-accent-text);
  font-size: var(--ylf-text-sm);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
  text-underline-offset: 4px;
  transition: text-decoration-color var(--ylf-duration-fast) var(--ylf-ease-standard);
}
@media (hover: hover) and (pointer: fine) {
  .design-start__stop:hover {
    --_ring: var(--ylf-c-bg-soft);

    background: var(--ylf-c-bg-soft);
  }
  .design-start__stop:hover .design-start__marker {
    transform: translateY(-3px) rotate(-4deg);
  }
  .design-start__stop:hover .design-start__destination {
    text-decoration-color: currentColor;
  }
}
.design-start__stop:active .design-start__marker {
  transform: scale(var(--ylf-press-scale));
  transition-duration: var(--ylf-duration-press);
}
.design-home-footer a {
  color: var(--ylf-c-brand);
  text-underline-offset: 4px;
}
.design-home-footer a:hover {
  text-decoration: underline;
}
.design-home-footer {
  display: flex;
  justify-content: space-between;
  gap: var(--ylf-space-4);
  padding-top: var(--ylf-space-6);
  border-top: 1px solid var(--ylf-c-border);
  color: var(--ylf-c-text-3);
  font-size: var(--ylf-text-sm);
}
@media (max-width: 959px) {
  .design-hero {
    gap: var(--ylf-space-8);
  }
  .design-hero h1 {
    font-size: 40px;
  }
  .design-hero__actions :deep(.ylf-button) {
    padding-inline: 20px;
    font-size: 15px;
  }
}
@media (max-width: 767px) {
  .ylf-design-home {
    padding-inline: var(--ylf-space-6);
  }
  .design-hero {
    grid-template-columns: 1fr;
    padding-top: var(--ylf-space-12);
    gap: var(--ylf-space-8);
  }
  .design-hero h1 {
    font-size: clamp(32px, 7.5vw, 48px);
  }
  .design-hero__description {
    font-size: var(--ylf-text-base);
  }
  .design-section-heading {
    display: block;
  }
  .design-section-heading p {
    margin-top: var(--ylf-space-2);
  }
  .design-start__route {
    grid-template-columns: 1fr;
    gap: var(--ylf-space-2);
    margin-inline: calc(-1 * var(--ylf-space-4));
  }
  /* 手机上航线改为竖排：航点在左，文字在右。 */
  .design-start__stop {
    flex-direction: row;
    padding: var(--ylf-space-4);
  }
  .design-start__leg:not(:last-child)::after {
    top: 40px;
    right: auto;
    bottom: calc(-1 * var(--ylf-space-2) - 40px);
    left: 39px;
    width: 2px;
    height: auto;
    mask: repeating-linear-gradient(180deg, #000 0 6px, transparent 6px 12px);
  }
  .design-home-footer {
    flex-wrap: wrap;
  }
}
</style>
