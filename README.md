# 戴夫（Dave）的后备箱

这是 Dave 的个人技术博客，也是一个可以复用的 Astro + Markdown 博客模板。

网站用《植物大战僵尸》式的明亮庭院、木质导航和绿色后备箱承载文章。内容以纸卡形式直接放在后备箱里，页面保留轻量的阳光、植物和戴夫互动。博客当前记录 AI 应用、Agent、知识库、模型训练、工程问题、项目实践和个人思考。

如果你是来了解 Dave 的，可以先看 [关于 Dave](https://zlzhl1.github.io/about/)、[项目全景](https://zlzhl1.github.io/practice/) 和首页文章。如果你想把这套代码作为自己的博客起点，可以从“使用这套模板”开始。

## 关于 Dave

Dave 用这个站点记录具体项目、工程排查和个人学习。文章尽量从真实问题出发，说明背景、判断、实现过程、结果和适用边界，避免只留下零散的工具名或结论。

网站目前有三个栏目：

| 栏目 | 内容方向 | ID |
| --- | --- | --- |
| 项目分享 | 项目目标、方案、实现和复盘 | `project-sharing` |
| 工程问题 | 排错、系统设计、工具和工程经验 | `engineering-issues` |
| 个人随笔 | 学习记录、工作方法和阶段性想法 | `personal-notes` |

## 这个模板适合谁

这套模板适合想用 GitHub 管理 Markdown 内容、用 GitHub Pages 发布静态博客，并且希望保留清晰栏目、文章归档、RSS、搜索和响应式阅读体验的人。

它适合个人技术博客、项目记录、学习笔记和作品集。访客只能阅读网站，内容维护仍由仓库写入者完成，不需要额外的数据库或公开 CMS。

## 模板提供什么

- Astro 静态站点和 Markdown 内容集合。
- 自定义栏目、栏目文章统计和空栏目页面。
- 文章列表、文章详情、归档、站内搜索、RSS 和 sitemap。
- 通过修改文章 frontmatter，将原文章直接转移到其他栏目，原文件名、正文和链接保持不变。
- GitHub Pages 工作流：提交到 `main` 后自动检查、构建和部署。
- 主题化的首页场景、响应式布局、键盘可操作的互动和清晰的文章阅读页面。

## 使用这套模板

下面的步骤按“把它改成你的博客”来写。你可以 Fork 这个仓库，也可以复制代码后建立自己的 GitHub 仓库。

### 1. 复制仓库并安装依赖

```powershell
git clone https://github.com/zlzhl1/zlzhl1.github.io.git my-blog
cd my-blog
npm.cmd ci
```

如果你使用自己的 GitHub 仓库，请把后续命令中的远程地址换成你的仓库地址。Node.js 版本以 `package.json` 的 `engines` 为准。

### 2. 先改网站身份

编辑 `src/config.ts`，把模板中的 Dave 信息换成你的公开信息：

```ts
export const SITE = {
  title: '你的网站名称',
  description: '一句话介绍你的网站。',
  author: '你的公开称呼',
  githubUrl: 'https://github.com/你的账号',
  siteUrl: 'https://你的账号.github.io',
};
```

再编辑 `src/pages/about.astro`，把 About 页面改成你的个人介绍。首页的视觉主题可以继续使用，也可以按自己的品牌替换 `public/garden/` 和组件样式。

### 3. 新建栏目

栏目是 Markdown 文件，不需要修改页面代码。复制 `templates/column.md`，在 `src/content/columns/` 下新建文件，例如 `ai-notes.md`：

```markdown
---
title: "AI 笔记"
description: ""
order: 40
---
```

文件名就是栏目 ID，只建议使用小写字母、数字和连字符。`title` 必填，`description` 和 `order` 可省略，`order` 越小越靠前。

### 4. 新建文章

复制 `templates/article.md`，在 `src/content/posts/` 下新建 Markdown 文件，例如 `my-first-note.md`：

```markdown
---
title: "文章标题"
description: "用一句话说明文章内容。"
date: 2026-11-10
column: ai-notes
tags: ["AI"]
draft: false
featured: false
---

从一个具体问题开始写正文。
```

`column` 只能填写一个已经存在的栏目 ID，也可以完全省略。`draft: true` 的文章不会公开；文章日期晚于当前日期时，也不会出现在公开页面中。文章 URL 由文件名生成，发表后不要为了改标题或栏目而重命名文件。

### 5. 把文章转移到其他栏目

编辑原文章的 frontmatter，把原来的栏目 ID 改成目标栏目：

```diff
- column: ai-notes
+ column: engineering-issues
```

这会直接改变原文章的栏目归属：原栏目不再列出它，目标栏目会列出它，文章正文、文件名、URL 和总数都保持不变。不要复制文章，也不要同时保留两个 `column` 字段。

### 6. 本地预览和发布

开发时运行：

```powershell
npm.cmd run dev
```

发布前运行：

```powershell
npm.cmd run check
npm.cmd run verify:content
npm.cmd run build
npm.cmd run verify
```

确认检查通过后，将修改提交到 GitHub 仓库的 `main` 分支。`.github/workflows/deploy.yml` 会自动执行检查、构建和 GitHub Pages 部署；部署完成后，打开你的 Pages 地址即可看到更新。

## 项目结构

```text
src/
├─ config.ts                 # 网站名称、简介、作者和 GitHub 地址
├─ content/posts/            # 文章 Markdown
├─ content/columns/          # 栏目 Markdown
├─ pages/                    # 首页、文章、栏目、归档、About 等页面
├─ components/               # 导航、后备箱、文章列表和互动组件
└─ styles/                   # 全局样式和页面样式
templates/                   # 栏目和文章模板
public/                      # 静态图片、图标和其他资源
.github/workflows/           # GitHub Pages 自动部署
```

## 维护规则

- 内容维护入口是 GitHub 仓库中的 Markdown 文件。
- 栏目 ID 一旦被文章引用，删除或重命名栏目之前要先处理这些文章的 `column` 字段。
- 文章迁移只修改原文章的单个 `column` 字段，不复制文章。
- `templates/` 和 `editorial/` 只是模板与写作参考，不会自动成为公开文章。
- 主题中的互动是阅读体验增强项，不影响文章阅读和键盘操作。

## 相关链接

- [在线网站](https://zlzhl1.github.io/)
- [Dave 的 GitHub](https://github.com/zlzhl1)
- [Astro](https://github.com/withastro/astro)
- [Astro 内容集合文档](https://docs.astro.build/en/guides/content-collections/)
- [部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [庭院设计记录](docs/garden-design.md)
- [插画与提示词记录](docs/art-prompts-pvz.md)
