<script setup lang="ts">
import { computed } from 'vue'
import { useDocsLocale } from '../composables/useDocsLocale'

const { text, link } = useDocsLocale()
const colors = computed(() => [
  { name: text('晴空蓝', 'Sky blue'), token: '--ylf-c-brand', role: text('主操作', 'Primary actions') },
  { name: text('明黄', 'Sun yellow'), token: '--ylf-accent-sun', role: text('精选', 'Featured') },
  { name: text('青色', 'Cyan'), token: '--ylf-accent-cyan', role: text('工具', 'Tools') },
  { name: text('珊瑚橙', 'Coral'), token: '--ylf-accent-coral', role: text('活动', 'Events') },
  { name: text('桃粉', 'Pink'), token: '--ylf-accent-pink', role: text('创作', 'Creation') },
  { name: text('鲜绿', 'Green'), token: '--ylf-accent-green', role: text('完成', 'Completion') },
])
</script>

<template>
  <section class="design-specimens" aria-labelledby="specimens-title">
    <div class="design-specimens__intro">
      <h2 id="specimens-title">
        {{ text('一种语言，', 'A shared language,') }}<br>{{ text('从细节开始。', 'from the details.') }}
      </h2>
      <a :href="link('/guide/foundations.html')">{{ text('探索视觉基础', 'Visual foundations') }}</a>
    </div>
    <div class="design-specimens__colors">
      <h3>{{ text('颜色有自己的职责', 'Every color has a purpose') }}</h3>
      <div class="design-specimens__palette">
        <div v-for="color in colors" :key="color.name">
          <span class="design-specimens__swatch" :style="{ background: `var(${color.token})` }" aria-hidden="true" />
          <strong>{{ color.name }}</strong>
          <span>{{ color.role }}</span>
        </div>
      </div>
    </div>
    <div class="design-specimens__type">
      <h3>{{ text('让内容自在呼吸', 'Give content room to breathe') }}</h3>
      <p class="design-specimens__letters">
        {{ text('Aa 云间', 'Aa Cloud') }}
      </p>
      <p>{{ text('清晰的文字，舒适的间距。', 'Clear type. Comfortable spacing.') }}<br>{{ text('把注意力留给真正重要的内容。', 'Keep the focus on what matters.') }}</p>
    </div>
  </section>
</template>

<style scoped>
.design-specimens {
  display: grid;
  grid-template-columns: 0.9fr 1.15fr 1fr;
  gap: var(--ylf-space-8);
  padding: var(--ylf-space-8) 0;
  border-bottom: 1px solid var(--ylf-c-border);
}
.design-specimens h2 {
  margin: 0 0 var(--ylf-space-4);
  font-size: var(--ylf-text-xl);
  line-height: 1.5;
  font-weight: 600;
}
.design-specimens a {
  color: var(--ylf-c-brand);
  font-size: var(--ylf-text-sm);
  text-underline-offset: 4px;
}
.design-specimens a:hover {
  text-decoration: underline;
}
.design-specimens h3 {
  margin: 0 0 var(--ylf-space-4);
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-sm);
  font-weight: 500;
}
.design-specimens__palette {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ylf-space-3);
}
.design-specimens__palette > div {
  display: flex;
  flex-direction: column;
  gap: var(--ylf-space-1);
  font-size: var(--ylf-text-xs);
  color: var(--ylf-c-text-3);
}
.design-specimens__palette strong {
  color: var(--ylf-c-text);
  font-size: var(--ylf-text-sm);
  font-weight: 500;
}
.design-specimens__swatch {
  display: block;
  height: 48px;
  margin-bottom: var(--ylf-space-2);
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius-sm);
}
.design-specimens__type {
  padding-left: var(--ylf-space-6);
  border-left: 1px solid var(--ylf-c-border);
}
.design-specimens__letters {
  margin: 0 0 var(--ylf-space-2);
  font-family: var(--ylf-font-heading);
  font-size: var(--ylf-text-2xl);
  line-height: 1.25;
}
.design-specimens__type > p:last-child {
  margin: 0;
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-xs);
  line-height: var(--ylf-leading-body);
}
@media (max-width: 767px) {
  .design-specimens {
    grid-template-columns: 1fr;
    gap: var(--ylf-space-8);
  }
  .design-specimens__intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ylf-space-3);
  }
  .design-specimens h2 {
    margin: 0;
    font-size: var(--ylf-text-lg);
  }
  .design-specimens__type {
    border: 0;
    padding: 0;
  }
}
</style>
