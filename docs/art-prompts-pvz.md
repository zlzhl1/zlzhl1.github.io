# 庭院与角色插画生成记录

日期：2026-11-04。用于“戴夫（Dave）的后备箱”植物大战僵尸风格博客。

## 生成与文件处理

- 方式：内置 `image_gen`，四个独立生成任务，没有外部参考图片输入。
- 背景为原创生成庭院插画；角色依据用户指定的《植物大战僵尸》设定生成。没有从游戏安装文件提取图片，也没有把游戏截图作为网站资源。
- 角色请求真实透明背景，保留 alpha；输出用项目已有的 `sharp` 仅转码为 WebP，质量 86、alpha 质量 100，未重绘、抠图或改变构图。
- 原始生成 PNG 留在 `.local/art-originals/`（Git 忽略目录），网站只引用 `public/garden/` 内的 WebP。
- 稳定资源路径：`public/garden/garden-backdrop.webp`、`public/garden/dave.webp`、`public/garden/peashooter.webp`、`public/garden/sunflower.webp`。

## 文件验收

四张生成 PNG 已逐张实际查看：背景中央留空、无车或人物；戴夫手势朝右；豌豆射手炮口朝右；向日葵正面微笑。所有角色完整可见，无文字或水印。

| 文件 | 像素尺寸 | 文件字节数 | Alpha |
| --- | --- | ---: | --- |
| `garden-backdrop.webp` | 1672 × 941 | 163994 | 无 |
| `dave.webp` | 1134 × 1387 | 168938 | 有，最小 0 / 最大 255 |
| `peashooter.webp` | 1312 × 1199 | 130562 | 有，最小 0 / 最大 255 |
| `sunflower.webp` | 1230 × 1278 | 141902 | 有，最小 0 / 最大 255 |

四个 WebP 总大小为 605396 字节（约 591 KiB）。尺寸和 Alpha 来自转码后文件的元数据及像素通道统计，不是根据预览黑底推断。

## 最终提示词

### garden-backdrop

透明背景：否。

```text
Use case: illustration-story. Asset type: landscape background for a playful Plants vs. Zombies inspired personal blog. Create a polished original 2D hand-painted cartoon suburban garden in the familiar classic Plants vs. Zombies 1 visual style: bright cyan blue sky, small soft puffy clouds, sculpted rounded green hedges, white picket fence across the midground, warm checkerboard lawn in foreground, a glimpse of a cozy suburban house only at the far left edge and foliage at the far right edge. Landscape wide framing, straight-on eye level, broad central 75% open low-detail lawn/sky because a large green car trunk website UI will overlay it. Warm daylight, vivid greens, cheerful but tasteful, thick soft charcoal outlines, subtle painted texture and gentle shading. No car, no characters, no plants with faces, no text, no logo, no UI, no watermark, no dark vignette. High resolution landscape.
```

### dave

透明背景：是。

```text
Use case: illustration-story. Asset type: transparent full-body character cutout for a Plants vs. Zombies style blog. Create a polished original illustration of Crazy Dave from classic Plants vs. Zombies 1, his recognizable upside-down metal saucepan helmet, scruffy orange-red beard, round bulbous nose, friendly eccentric wide eyes, white short-sleeved shirt, slightly chubby body, blue trousers and brown shoes. Standing facing slightly to the right and cheerfully gesturing with one hand toward an unseen open car trunk on his right. Classic 2D hand-painted PVZ cartoon art, thick organic charcoal outlines, gentle painterly cel shading, vivid warm colors, charming humorous expression. Entire body and pot hat visible, generous transparent margin, isolated character only on a genuinely transparent alpha background. No floor, no scenery, no text, no speech bubble, no logo, no watermark, no cast shadow plane. Not 3D, not a generic vector icon.
```

### peashooter

透明背景：是。

```text
Use case: illustration-story. Asset type: transparent character sprite for a Plants vs. Zombies themed website. A polished original illustration of the classic Plants vs. Zombies Peashooter, green round head with tubular trumpet snout facing right, two small expressive dark oval eyes, curved green stem and broad two-leaf base. Cute recognizable classic PVZ1 2D hand-painted cartoon style, thick organic charcoal outlines, rich lime and leaf-green colors, soft painterly cel shading. Full plant visible, centered with generous margins, sprite isolated on a genuinely transparent alpha background. No pot, no dirt, no floor, no scenery, no projectile, no text, no logos, no watermark. Not 3D, not pixel art, not flat generic vector.
```

### sunflower

透明背景：是。

```text
Use case: illustration-story. Asset type: transparent character sprite for a Plants vs. Zombies themed website. A polished original illustration of the classic Plants vs. Zombies Sunflower: smiling warm brown round face, tiny black oval eyes and cheerful curved smile, large golden yellow and orange petals in a full ring, slender curved green stem, two broad green leaves at its base. Friendly recognizable classic PVZ1 2D hand-painted cartoon style, thick organic charcoal outlines, soft painterly cel shading and warm vivid colors. Entire plant including petals and leaves visible, centered with generous transparent margins. Isolated sprite on genuinely transparent alpha background. No flowerpot, no dirt, no floor, no scenery, no sun icon, no text, no logo, no watermark. Not 3D, not pixel art, not a generic vector icon.
```

