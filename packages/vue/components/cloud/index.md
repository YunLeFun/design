---
title: Cloud
title_zh: 云朵
---

云乐坊各站点共用的云朵插画：五种轮廓、左上方来光、顶部逆光描边与空气透视，配色来自 `@yunlefun/ui` 的 `--ylf-cloud-*` token，随明暗主题切换。纯装饰，`aria-hidden="true"`，不接收指针事件。

## 选择轮廓

画布统一为 `490 × 250`，轮廓都是一条连续曲线，缩放或翻转后不会露出圆形拼接。同一画面中混用不同轮廓，避免重复。

- `billow`：层层鼓起的主云，适合视觉焦点。
- `heap`：宽厚的近景积云，右侧更高。
- `bank`：贴着地平线的扁长云堤。
- `puff`：圆鼓鼓的小团云，适合空状态或吉祥物。
- `wisp`：远处拉长的薄云。

## 层次与性能

用 `--ylf-cloud-haze`（0–1）表达远近：数值越大，云体、阴影越接近 `--ylf-cloud-haze-color`，底部阴影和逆光描边同步减弱。把它写在组件或父元素上即可。

`volumetric` 用高斯模糊塑造亮面体积，只给一两朵焦点云开启；其余云使用渐变近似，降低绘制开销。

## 小脸与动效

`face` 只渲染一张默认隐藏的小脸，由宿主设置 `--ylf-cloud-face-opacity` 唤醒，例如悬停、聚焦或被戳之后设为 `0.85`；淡入使用 `--ylf-duration-slow`。眼睛偶尔眨一下。

组件本身不移动。漂浮、入场、被戳回弹由宿主添加，软的位移使用 `--ylf-ease-spring` 与 `--ylf-duration-slow`，颜色与透明度使用 `--ylf-ease-standard`。开启“减少动态效果”时，这些时长归零，眨眼停止；宿主自己的循环动画也要处理该偏好。

## Props

| 属性         | 说明                            | 类型                                     | 默认值   |
| ------------ | ------------------------------- | ---------------------------------------- | -------- |
| `shape`      | 云朵轮廓                        | `billow \| heap \| bank \| puff \| wisp` | `billow` |
| `volumetric` | 用模糊滤镜塑造亮面体积          | `boolean`                                | `false`  |
| `face`       | 渲染隐藏的小脸，由 CSS 变量唤醒 | `boolean`                                | `false`  |

## CSS 变量

| 变量                       | 说明                               | 默认值（浅色 / 深色） |
| -------------------------- | ---------------------------------- | --------------------- |
| `--ylf-cloud-haze`         | 空气透视强度，0 为近景，1 融入天空 | `0`                   |
| `--ylf-cloud-haze-color`   | 远处云融入的天空色                 | `#9cc6ef` / `#1f3354` |
| `--ylf-cloud-face-opacity` | 小脸透明度                         | `0`                   |
| `--ylf-cloud-highlight`    | 亮面                               | `#fffefa` / `#a6bcd8` |
| `--ylf-cloud-body`         | 云体                               | `#f2f8ff` / `#3e5679` |
| `--ylf-cloud-shade`        | 背光面                             | `#c6dff5` / `#1c2b44` |
| `--ylf-cloud-shadow`       | 底部阴影                           | `#83addb` / `#0a1424` |
| `--ylf-cloud-rim`          | 顶部逆光描边                       | `#ffffff` / `#cfdff2` |
| `--ylf-cloud-face`         | 小脸颜色                           | `#5a7fae` / `#0e1a2d` |

深色主题默认是月光下的夜空蓝。站点有自己的天空时，在天空容器上覆盖这组 token，例如黄昏：

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

轮廓列表也可从包根入口取得：`import { ylfCloudShapes } from '@yunlefun/vue'`，类型为 `YlfCloudShape`。token 随 `@yunlefun/ui` 0.0.7 发布；未加载共享样式时组件回退到浅色配色。
