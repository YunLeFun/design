<script setup lang="ts">
import { computed } from 'vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfCard from '../../../vue/components/YlfCard.vue'
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
          YunLeFun Design
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
      <div class="design-start__links">
        <YlfCard v-for="entry in entries" :key="entry.href" variant="tinted" :tone="entry.tone" :hoverable="false">
          <span :class="entry.icon" class="design-start__icon" aria-hidden="true" />
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.description }}</p>
          <YlfButton tag="a" variant="accent" :tone="entry.tone" appearance="outline" size="sm" :href="link(`${entry.href}${entry.href.endsWith('/') ? '' : '.html'}`)">
            {{ entry.label }}
          </YlfButton>
        </YlfCard>
      </div>
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
.design-start__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: var(--ylf-space-8);
  gap: var(--ylf-space-4);
}
.design-start__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 10px;
  border-radius: var(--ylf-radius-sm);
  font-size: 24px;
  color: var(--ylf-accent-text);
}
.design-start h3 {
  margin: var(--ylf-space-4) 0 var(--ylf-space-2);
  font-size: var(--ylf-text-lg);
  font-weight: 600;
}
.design-start__links p {
  margin: 0 0 var(--ylf-space-4);
  color: var(--ylf-c-text-2);
  line-height: var(--ylf-leading-body);
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
  .design-start__links {
    grid-template-columns: 1fr;
    gap: var(--ylf-space-8);
  }
  .design-home-footer {
    flex-wrap: wrap;
  }
}
</style>
