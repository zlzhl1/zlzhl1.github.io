# Astro 官方博客模板

本次基础模板采用 [withastro/astro 的 examples/blog](https://github.com/withastro/astro/tree/main/examples/blog)，来源核对日期为 2026-11-03。

## 复用内容

- `src/components/Header.astro`、`HeaderLink.astro`：官方页头、导航和当前页面状态。
- `src/components/Footer.astro`：官方页脚结构与基础样式。
- `src/components/BaseHead.astro`：公共元数据、全站样式导入与字体加载。
- `src/components/FormattedDate.astro`：日期显示组件。
- `src/styles/global.css`：官方全局排版与配色，保留原始来源注释。
- 官方 `src/layouts/BlogPost.astro` 的文章阅读结构与排版。
- 官方模板附带的 Atkinson 普通、粗体 WOFF 字体，放在 `src/assets/fonts/`，通过 Astro 本地字体提供器加载。

## 必要适配

站名替换为“戴夫（Dave）的后备箱”，导航使用中文和现有站点路径，社交链接指向作者 GitHub。页面保留中文语言元数据、RSS、站点地图和 GitHub Pages 子路径支持。

继续使用本项目的 Markdown 内容集合、发布日期及草稿规则，以及单值 `column` 栏目引用。文章 URL 仍由文章文件名生成，修改栏目只改变同一篇文章的归属。GitHub 仓库仍是唯一内容维护入口，网站没有公开写入接口。

不引入官方模板中的示例文章、团队社交账号和占位封面。原先的 AI 背景图不再作为网站资源加载。

## 来源与许可

- [官方模板源目录](https://github.com/withastro/astro/tree/main/examples/blog)
- [官方字体配置](https://github.com/withastro/astro/blob/main/examples/blog/astro.config.mjs)
- [Astro MIT 许可](../licenses/astro.txt)
- [Atkinson 字体内嵌许可原文](../licenses/atkinson.txt)
- 完整说明见 [第三方许可](../THIRD_PARTY_NOTICES.md)。
