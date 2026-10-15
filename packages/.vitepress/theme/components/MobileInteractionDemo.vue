<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { ref, useId } from 'vue'
import YlfAccordion from '../../../vue/components/YlfAccordion.vue'
import YlfButton from '../../../vue/components/YlfButton.vue'
import YlfCard from '../../../vue/components/YlfCard.vue'
import YlfCheckbox from '../../../vue/components/YlfCheckbox.vue'
import YlfDialog from '../../../vue/components/YlfDialog.vue'
import YlfDropdownMenu from '../../../vue/components/YlfDropdownMenu.vue'
import YlfPopover from '../../../vue/components/YlfPopover.vue'
import YlfRadioGroup from '../../../vue/components/YlfRadioGroup.vue'
import YlfSegmentedControl from '../../../vue/components/YlfSegmentedControl.vue'
import YlfSelect from '../../../vue/components/YlfSelect.vue'
import YlfSwitch from '../../../vue/components/YlfSwitch.vue'

const dark = ref(false)
const view = ref('ready')
const pantry = ref(true)
const checked = ref(false)
const sort = ref('match')
const density = ref('normal')
const clicks = ref(0)
const lastAction = ref('尚未选择')
const portalId = `mobile-demo-${useId()}`
const groups = [
  { value: 'ready', label: '食材齐全' },
  { value: 'one', label: '还差一种' },
  { value: 'two', label: '还差两种' },
]
</script>

<template>
  <section class="mobile-demo ylf-theme-light" :class="{ 'ylf-theme-dark': dark }" aria-label="移动端交互示例">
    <ConfigProvider :teleport-to="`#${portalId}`">
      <header class="mobile-demo__header">
        <div>
          <p class="mobile-demo__eyebrow">
            YUNLEFUN DESIGN
          </p>
          <h2>轻触，即有回应</h2>
        </div>
        <YlfButton size="sm" variant="secondary" :aria-pressed="dark" @click="dark = !dark">
          {{ dark ? '浅色' : '深色' }}
        </YlfButton>
      </header>
      <p class="mobile-demo__intro">
        按压、切换与展开使用同一套动效。系统开启减少动态效果后，状态立即更新。
      </p>
      <YlfSegmentedControl v-model="view" :options="groups" label="推荐分组" />
      <YlfCard :hoverable="false" padding="var(--ylf-space-4)">
        <h3>常备食材</h3>
        <div class="mobile-demo__row">
          <label :for="`${portalId}-pantry`">使用常备调料</label>
          <YlfSwitch :id="`${portalId}-pantry`" v-model="pantry" size="sm" />
        </div>
        <div class="mobile-demo__row">
          <label :for="`${portalId}-remember`">记住我的选择</label>
          <YlfCheckbox :id="`${portalId}-remember`" v-model="checked" />
        </div>
        <label :for="`${portalId}-sort`">推荐排序</label>
        <YlfSelect :id="`${portalId}-sort`" v-model="sort" size="sm" :options="[{ label: '匹配程度优先', value: 'match' }, { label: '制作时间优先', value: 'time' }, { label: '暂不可用', value: 'disabled', disabled: true }]" />
      </YlfCard>
      <YlfAccordion :items="[{ value: 'why', title: '为什么推荐这道菜？', content: '已选番茄和鸡蛋，已记录的食材均已具备。展开时内容自然推移，关闭时及时收起。' }]" />
      <div class="mobile-demo__actions">
        <YlfButton size="sm" @click="clicks++">
          查看推荐 {{ clicks || '' }}
        </YlfButton>
        <YlfDialog title="调整推荐偏好" description="保存后可继续查看当前结果。">
          <template #trigger>
            <YlfButton size="sm" variant="secondary">
              偏好设置
            </YlfButton>
          </template>
          <YlfRadioGroup v-model="density" aria-label="结果显示" :options="[{ label: '标准显示', value: 'normal' }, { label: '显示匹配详情', value: 'detail' }]" />
          <p v-for="n in 8" :key="n">
            偏好说明 {{ n }}：长内容可在弹层内滚动，关闭后回到原来的入口。
          </p>
        </YlfDialog>
        <YlfPopover>
          <template #trigger>
            <YlfButton size="sm" variant="ghost">
              查看说明
            </YlfButton>
          </template>
          <p>浮层根据可用空间排布，窄屏也能完整阅读。</p>
          <YlfButton size="sm" variant="secondary" @click="lastAction = '已了解'">
            我知道了
          </YlfButton>
        </YlfPopover>
        <YlfDropdownMenu :items="[{ label: '分享推荐', value: '分享推荐' }, { label: '收藏推荐', value: '收藏推荐' }, { label: '暂不可用', value: 'disabled', disabled: true }]" @select="lastAction = $event">
          <template #trigger>
            <YlfButton size="sm" variant="ghost">
              更多操作
            </YlfButton>
          </template>
        </YlfDropdownMenu>
      </div>
      <div class="mobile-demo__actions">
        <YlfButton size="sm" disabled>
          暂不可用
        </YlfButton>
        <YlfButton size="sm" loading>
          正在保存
        </YlfButton>
      </div>
      <output aria-live="polite">{{ groups.find(group => group.value === view)?.label }} · {{ lastAction }}</output>
      <div :id="portalId" />
    </ConfigProvider>
  </section>
</template>

<style scoped>
.mobile-demo {
  box-sizing: border-box;
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  display: grid;
  gap: var(--ylf-space-4, 16px);
  padding: var(--ylf-space-4, 16px);
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius-lg);
  color: var(--ylf-c-text);
  background: var(--ylf-c-bg);
  font: 15px / 1.6 var(--ylf-font-body);
}
.mobile-demo__header,
.mobile-demo__row,
.mobile-demo__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ylf-space-2, 8px);
}
.mobile-demo__actions {
  justify-content: flex-start;
  flex-wrap: wrap;
}
.mobile-demo__row {
  min-height: var(--ylf-touch-target, 44px);
}
.mobile-demo__eyebrow {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ylf-c-text-2);
}
.mobile-demo h2 {
  margin: 4px 0;
  padding: 0;
  border: 0;
  font-size: 22px;
  line-height: 1.3;
}
.mobile-demo h3 {
  margin: 0 0 8px;
  font-size: 16px;
}
.mobile-demo p {
  margin: 0;
}
.mobile-demo__intro,
.mobile-demo output {
  color: var(--ylf-c-text-2);
  font-size: 14px;
}
.mobile-demo :deep(.ylf-select__trigger) {
  display: flex;
  width: 100%;
  margin-top: 8px;
}
</style>
