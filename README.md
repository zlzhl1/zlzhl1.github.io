# 朝辉的 AI 手记

一个使用 Astro 构建的中文个人博客，记录 AI 应用实践、技术解释、可复用方法和个人成长。网站静态生成，文章使用 Markdown 维护，通过 GitHub Actions 部署到 GitHub Pages。

## 背景主题

网站使用一张融合大模型、训练、AI 工作流与 Agent 协作元素的完整背景图。图片位于 `public/images/ai-unified-background.webp`，生成提示词记录在 `docs/background-prompt.md`。背景与阅读区域样式集中在 `src/styles/themes.css`，图片组件在 `src/components/AIBackdrop.astro`。

## 本地运行

先安装符合项目 `package.json` 要求的 Node.js。在 Windows PowerShell 中使用 `npm.cmd`，不需要调整执行策略。

```powershell
# 在项目目录中安装依赖
npm.cmd install

# 启动开发服务器，打开终端显示的本地地址
npm.cmd run dev

# 生成静态网站
npm.cmd run build

# 预览构建结果
npm.cmd run preview
```

仓库已有 `package-lock.json` 时，自动部署使用 `npm ci` 安装锁定依赖；本地也可以使用 `npm.cmd ci`。

## 写一篇文章

在 `src/content/posts/` 下新增一个英文短名的 `.md` 文件，例如 `my-first-experiment.md`。文件名会作为文章链接的一部分，发表后尽量保持稳定。

```markdown
---
title: "文章标题"
description: "用一句话说明读者能从文章中获得什么。"
date: 2026-11-03
category: project
tags: ["知识库", "验收"]
draft: true
featured: false
---

从一个具体问题开始写正文。

## 发生了什么

说明输入、过程、结果，以及适用范围。
```

字段说明：

| 字段 | 用法 |
| --- | --- |
| `title` | 文章标题 |
| `description` | 列表摘要与页面描述 |
| `date` | 发布日期，使用 `YYYY-MM-DD` |
| `category` | 下面四个栏目 ID 之一 |
| `tags` | 字符串数组，帮助描述内容 |
| `draft` | 草稿设为 `true`，不会出现在公开网站中；确认后改为 `false` |
| `featured` | 是否作为精选文章，具体展示由首页决定 |

本地预览和生产构建都隐藏草稿。写作计划放在 `editorial/`，不会被文章集合读取。

未来日期的文章也会隐藏。到达发布日期后，需要再次推送或手动运行部署工作流，网站才会重新构建并显示文章。

## 四个栏目

| ID | 栏目 | 适合的内容 |
| --- | --- | --- |
| `project` | 项目现场 | 问题、方案选择、实现、验证与复盘 |
| `lab` | 效率实验室 | 工作流、模板、清单和小工具 |
| `explain` | 技术白话 | 用具体例子解释 Agent、RAG、训练与评测 |
| `journal` | 个人手记 | 工作判断、学习过程、职业选择与生活观察 |

修改网站名称、简介和 GitHub 入口时，查看 `src/config.ts`。新增栏目还需要同步内容 Schema 与栏目配置。

## 部署到 GitHub Pages

源码仓库可以采用以下两种名称：

| 仓库 | 默认网站地址 |
| --- | --- |
| `zlzhl1/zlzhl1.github.io` | `https://zlzhl1.github.io/` |
| `zlzhl1/chaohui-ai-notes` | `https://zlzhl1.github.io/chaohui-ai-notes/` |

项目的 Astro 配置会根据 GitHub Actions 提供的 `GITHUB_REPOSITORY` 推断网站域名和基础路径：个人站点仓库使用根路径，普通项目仓库使用仓库名作为路径前缀。不要手动把所有链接改成以 `/` 开头的固定地址。

发布步骤：

1. 在 GitHub 创建用于本站的仓库，将本项目源码推送到 `main` 分支。
2. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
3. 确认仓库允许执行 Actions；查看 **Actions** 中的部署工作流。
4. 等构建与部署完成后，使用 Pages 返回的网站地址访问。
5. 以后修改文章并推送到 `main`，工作流会重新构建和部署。

GitHub Free 的 Pages 使用公开仓库。公开前只保留网站源码、可公开文章和必要配置；不要放入内部材料、凭据或私人附件。

需要自定义地址时，可以使用这些构建环境变量：

- `PUBLIC_SITE_URL`：完整站点域名，例如 `https://notes.example.com`。
- `SITE_BASE`：手动覆盖基础路径，例如 `/` 或 `/chaohui-ai-notes`。

示例，仅影响当前 PowerShell 会话：

```powershell
$env:PUBLIC_SITE_URL = 'https://notes.example.com'
$env:SITE_BASE = '/'
npm.cmd run build
```

自定义域名还需要在 GitHub Pages 设置和域名服务商处配置。构建环境变量本身不会完成域名绑定。

## 维护约定

- 修改文章后先运行构建，再检查本地页面、手机布局和文章链接。
- 网站没有自建后台、用户登录、邮件订阅或提交表单。内容通过 Markdown 与 Git 管理，联系入口使用 GitHub。
- 文章涉及实验时，写清资料、运行环境、验证方法和实际观察；构造案例明确标注为示例。
- 不把本地演示、历史数据或未验证方案写成当前线上成果。
- 旧文章需要更正时直接修改源文件，必要时在正文中补充更新说明。

## 参考文档

- [Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub：创建 GitHub Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub：配置发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
