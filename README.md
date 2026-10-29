# 戴夫（Dave）的 AI 手记

使用官方 [withastro/astro](https://github.com/withastro/astro) 框架构建的个人博客。文章和栏目均由 Markdown 文件管理，通过 GitHub Actions 发布到 [GitHub Pages](https://zlzhl1.github.io/)。

## 在 GitHub 管理内容

打开 [网站源码仓库](https://github.com/zlzhl1/zlzhl1.github.io)，登录你的 `zlzhl1` 账号后操作。只有具有仓库写入权限的账号才能提交或合并内容到 `main` 并发布网站；保持仓库写入权限只授予你，就只有你能维护。公开网站没有新增、编辑或转移入口，访客的 Fork 或 Pull Request 不会直接改动网站。

每次提交到 `main` 后，在仓库的 **Actions** 查看部署结果。成功后，变更才会出现在网站上。

### 新增栏目

网站不预设栏目。你需要时再添加，无需修改页面或程序代码。

1. 在仓库点击 **Add file → Create new file**。
2. 文件名填写 `src/content/columns/ai-notes.md`。`ai-notes` 是栏目 ID，可换成你自己的英文短名，建议使用小写字母、数字和连字符。
3. 从 [栏目模板](templates/column.md) 复制内容，填写名称，例如：

```markdown
---
title: "大模型笔记"
description: ""
order: 0
---
```

4. 点击 **Commit changes**，提交到 `main`。新增的栏目会在下次部署后自动出现在网站中，即使暂时没有文章也可访问。

`title` 必填；`description` 可省略；`order` 可省略，默认 `0`，数字越小越靠前。修改 `title` 只改显示名称，不改变栏目链接。栏目 ID 来自文件名，重命名文件时需要同步修改引用它的文章。

### 新增文章

1. 点击 **Add file → Create new file**，填写 `src/content/posts/my-first-note.md`。
2. 从 [文章模板](templates/article.md) 复制内容，填写文章信息与 Markdown 正文。
3. 如果要放入某个栏目，在开头的 `---` 之间填写 `column: ai-notes`；先确认 `src/content/columns/ai-notes.md` 已存在。也可以省略 `column`，文章仍会显示在首页、全部文章和归档中。
4. 草稿完成后把 `draft` 改为 `false`，确认发布日期，再提交到 `main`。

```markdown
---
title: "文章标题"
description: "用一句话说明文章内容。"
date: 2026-10-29
column: ai-notes
tags: ["大模型"]
draft: true
featured: false
---

正文使用 Markdown 编写。
```

| 字段 | 用法 |
| --- | --- |
| `title` | 必填，文章标题 |
| `description` | 必填，列表摘要与页面描述 |
| `date` | 必填，发布日期，格式为 `YYYY-MM-DD` |
| `column` | 可选，只填写一个已存在的栏目 ID，不填写数组 |
| `tags` | 可选，字符串数组 |
| `draft` | 可选，默认 `false`；设为 `true` 后不公开 |
| `featured` | 可选，保留的精选标记，默认 `false` |

文章地址由文件名生成，例如 `/posts/my-first-note/`。发表后保留原文件名，修改标题和栏目不会改变文章链接。

草稿和未来日期的文章不会公开。到达发布日期后，需要再次提交或在 **Actions** 手动运行部署，网站才会重新构建。模板在 `templates/`，写作计划在 `editorial/`，都不会自动成为文章或栏目。

### 将文章转移到其他栏目

1. 打开**原来的**文章文件，例如 `src/content/posts/my-first-note.md`，点击铅笔图标编辑。
2. 将原有的 `column: ai-notes` 改为目标栏目的 ID，例如 `column: engineering-notes`。目标栏目必须已存在。
3. 提交这一个文件的修改到 `main`。

这是转移原文章：原栏目不再列出它，目标栏目开始列出它，文章总数与链接保持不变。不要复制文章，不要新增第二个 `column` 字段，也不要为了转移栏目而改文件名。要取消栏目归属，删除 `column` 这一行即可。

删除栏目之前，先把引用它的文章转移到其他栏目或删除其 `column` 字段，再删除栏目文件。引用不存在的栏目会导致构建失败，避免文章被悄悄归错栏目。

## 本地运行

使用 `package.json` 要求的 Node.js 版本。在 Windows PowerShell 中使用 `npm.cmd`，无需调整执行策略。

```powershell
npm.cmd ci
npm.cmd run dev
```

发布前检查：

```powershell
npm.cmd run check
npm.cmd run verify:content
npm.cmd run build
npm.cmd run verify
```

## 网站配置与部署

- 名称、简介、作者和 GitHub 入口：`src/config.ts`。网站统一使用 **戴夫（Dave）**。
- 融合背景：`public/images/ai-unified-background.webp`；提示词见 [背景记录](docs/background-prompt.md)。
- 页面样式：`src/styles/global.css` 与 `src/styles/themes.css`。
- 部署流程：`.github/workflows/deploy.yml`，提交到 `main` 后自动执行。

当前仓库为 `zlzhl1/zlzhl1.github.io`，网站地址为 `https://zlzhl1.github.io/`。项目也支持普通仓库的子路径部署，由 Astro 配置根据 `GITHUB_REPOSITORY` 推断；如需覆盖，设置 `PUBLIC_SITE_URL` 和 `SITE_BASE`。自定义域名还需要配置 GitHub Pages 和域名解析。

## 官方参考

- [Astro 内容集合](https://docs.astro.build/en/guides/content-collections/)
- [Astro 中的 Markdown](https://docs.astro.build/en/guides/markdown-content/)
- [部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
