# 2026-11-04 内容更新

保留开篇 `getting-started.md` 原文与原URL，删除原来的两篇概念/清单文章，新增12篇实践文章：项目分享5篇、工程问题7篇。保持戴夫（Dave）的公开身份与既有Astro/GitHub Pages发布方式。

## 阅读路径

| 主题 | 文章文件 |
| --- | --- |
| OpenClaw客户端与个人增量 | `openclaw-enterprise-client.md` |
| LightRAG实体归一与策略管理 | `lightrag-entity-resolution.md` |
| Data-Juicer实践与DataFlow比较 | `data-juicer-dataflow-practice.md` |
| LLaMA-Factory、ms-swift与并行路线 | `llamafactory-training-stack.md` |
| EvalScope及业务对照 | `evalscope-comparable-evaluation.md` |
| 文档转换与恢复 | `document-conversion-recovery.md` |
| 请求调度、事件投影与补偿队列 | `agent-scheduling-and-outbox.md` |
| 9B CPT→SFT参数与实验复盘 | `cpt-sft-experiment-review.md` |
| 微批性能探针 | `microbatch-speed-probe.md` |
| 验证回升、选模与早停 | `validation-best-and-early-stop.md` |
| 监督分母与tokenizer | `loss-denominator-and-tokenizer.md` |
| 实验身份、回退重算与权重父链 | `training-run-identity-and-resume.md` |

## 依据与表达

文章使用作者履历资料中的已确认职责、源码核对记录、历史训练配置、运行日志与评测复核汇总。涉及2026-11-04训练状态时按当时采集截点描述，没有为写作重新训练或重算评测。个人实现、团队执行、上游能力、设计解释、观察结果与后续建议分别表述。

公开内容仅包含方法和必要的脱敏数值，不发布企业原文、QA样本、内部服务地址、私人联系方式、服务器绝对路径或完整内部日志。公开上游链接支持框架介绍，不能作为私人实验数字的外部证明。数值与职责的逐项本地来源映射保存在忽略目录`.local`，不进入Git。

图表由`python scripts/render-training-figures.py`生成；绘图的可选依赖是Matplotlib 3.9.2，不影响网站构建。数据在`public/articles/2026-11-training/`，没有插值生成未记录的曲线。比例、样本数、warmup、停止状态及不可比较条件随文章保留。

## 验收范围

发布前执行现有`check`、`verify:content`、`build`、`verify`。另核对开篇字节、删除文章的路由/RSS/站点地图缺席、13篇总数、5/7栏目归属、所有内链与图表、公开身份及无内部路径。浏览器检查文章页和窄屏表格；GitHub Actions与线上HTTP验收在实际发布后单独记录，不以本地构建替代。

本地验收：类型检查33个文件，0错误/警告；构建22个HTML页面；417个站内链接/资源通过；RSS13项；栏目转移、草稿/未来日期隐藏、无效栏目拒绝及Pages子路径验证通过。开篇与原Git版本逐字节一致，两篇删除文章不出现在构建路由、RSS和站点地图。390px、427px与1280px宽度检查中，表格内部滚动、图片正确加载、页面无横向溢出，抽查文章控制台无错误。
