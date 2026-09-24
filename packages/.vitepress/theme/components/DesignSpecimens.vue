<script setup lang="ts">
import { withBase } from 'vitepress'

const colors = [
  { name: '晴空蓝', token: '--ylf-c-brand', role: '主操作' },
  { name: '明黄', token: '--ylf-accent-sun', role: '精选' },
  { name: '青色', token: '--ylf-accent-cyan', role: '工具' },
  { name: '珊瑚橙', token: '--ylf-accent-coral', role: '活动' },
  { name: '桃粉', token: '--ylf-accent-pink', role: '创作' },
  { name: '鲜绿', token: '--ylf-accent-green', role: '完成' },
]
</script>

<template>
  <section class="design-specimens" aria-labelledby="specimens-title">
    <div class="design-specimens__intro">
      <h2 id="specimens-title">
        一种语言，<br>从细节开始。
      </h2>
      <a :href="withBase('/guide/foundations.html')">探索视觉基础</a>
    </div>
    <div class="design-specimens__colors">
      <h3>颜色有自己的职责</h3>
      <div class="design-specimens__palette">
        <div v-for="color in colors" :key="color.name">
          <span class="design-specimens__swatch" :style="{ background: `var(${color.token})` }" aria-hidden="true" />
          <strong>{{ color.name }}</strong>
          <span>{{ color.role }}</span>
        </div>
      </div>
    </div>
    <div class="design-specimens__type">
      <h3>让内容自在呼吸</h3>
      <p class="design-specimens__letters">
        Aa 云间
      </p>
      <p>清晰的文字，舒适的间距。<br>把注意力留给真正重要的内容。</p>
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
