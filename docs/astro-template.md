# Astro 基础结构与原创外观

网站继续使用 [withastro/astro](https://github.com/withastro/astro) 框架、Markdown 与内容集合。初始基础结构来自 [官方 examples/blog](https://github.com/withastro/astro/tree/main/examples/blog)，来源核对日期为 2026-11-03；当前外观已根据个人网站调研重新设计，并非官方 Blog Starter 原样主题。

## 复用内容

- `src/components/BaseHead.astro`：沿用公共元数据、样式导入与字体加载结构。
- `src/components/Header.astro`、`HeaderLink.astro`、`Footer.astro`：基于原有组件职责重新设计页头、导航和页脚。
- `src/components/FormattedDate.astro`：日期显示组件，使用中文与上海时区。
- `src/layouts/BlogPost.astro`：沿用文章阅读结构，调整中文排版、深色阅读表面和代码区域。
- 官方模板附带的 Atkinson 普通、粗体 WOFF 字体，放在 `src/assets/fonts/`，通过 Astro 本地字体提供器加载。

## 原创设计与必要适配

站名为“戴夫（Dave）的后备箱”。当前设计使用深墨色背景、薄荷色强调、局部玻璃导航和原创交互后备箱；`src/styles/global.css`、页面样式与交互均已重做。设计参考及逐项验收要求见 [设计方向](design-direction.md)。

参考站仅用于研究配色、排版、信息层级及交互节奏，不引入其源码、图片、字体、项目数据或文案。导航使用中文和现有站点路径，社交链接指向作者 GitHub。页面保留中文语言元数据、RSS、站点地图和 GitHub Pages 子路径支持。

继续使用本项目的 Markdown 内容集合、发布日期及草稿规则，以及单值 `column` 栏目引用。文章 URL 仍由文章文件名生成，修改栏目只改变同一篇文章的归属。GitHub 仓库仍是唯一内容维护入口，网站没有公开写入接口。

不引入官方模板中的示例文章、团队社交账号和占位封面，不为展示效果创建假项目或预设栏目。原先的 AI 背景图不再作为网站资源加载。

## 来源与许可

- [官方模板源目录](https://github.com/withastro/astro/tree/main/examples/blog)
- [官方字体配置](https://github.com/withastro/astro/blob/main/examples/blog/astro.config.mjs)
- [Astro MIT 许可](../licenses/astro.txt)
- [Atkinson 字体内嵌许可原文](../licenses/atkinson.txt)
- 完整说明见 [第三方许可](../THIRD_PARTY_NOTICES.md)。
