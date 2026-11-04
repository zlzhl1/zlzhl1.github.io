---
title: "两个模型的loss能直接比较吗？我追到了监督token和填充样本"
description: "解释token加权loss、普通重复与全mask填充的差别，以及tokenizer元数据变化为什么值得单独回归。"
date: 2026-11-04
column: engineering-issues
tags: ["Loss", "Tokenizer", "数据对齐", "SFT"]
draft: false
---

一条27B SFT记录在某个截点的验证loss约1.905，另一条125B记录的best约1.975。能据此说27B更好吗？我检查数据对齐、模板、编码器和loss聚合后，答案是：这两个数还不能拿来做质量排名。

本文复盘截至2026年11月4日的参数和代码核读记录。我参与的是训练方案、记录对照和结果解释，文章没有重新运行编码器或业务评测。

## 先问loss除以了什么

对这次核对的SFT实现，系统累计有效监督位置的token loss和有效label数量，再跨microbatch与数据并行组求和后相除。被mask的位置不参与分子和分母。

```text
loss = 所有有效监督token的损失总和 / 有效监督token数量
```

这不是每条QA的平均分，也不是把每个batch的均值等权再平均。下面是构造例子：短答案10个token、平均loss为1；长答案90个token、平均loss为3。token加权结果是2.8，两个样本均值等权则是2，含义不同。

[PyTorch CrossEntropyLoss文档](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) 解释了 `ignore_index` 和归约方式；具体分布式训练的聚合还必须查看所用实现，不能把某个框架默认行为套到所有项目。

## 对齐后的总行数相同，监督量仍可能不同

| 历史路线 | 训练对齐 | 实际含义 |
| --- | --- | --- |
| 125B某组SFT | 26969条原记录＋7条普通重复 | 重复内容可能再次参与监督 |
| 新27B fullSFT | 26969条原记录＋7个虚拟filler | filler的labels全部为-100，不增加有效监督 |

27B验证另将3029条原记录补到3040，新增11个全mask filler。125B对应的是另一套batch尾部处理，不能将“都是补齐”解释成相同监督。

全mask filler仍可能占用计算和调度位置，zero loss并不意味着zero cost。普通物理重复也不能因为用于凑batch就默认当成零权重。

## 为什么相同验证行数仍不足以比较

相同文本经过不同模板、tokenizer、截断长度和mask策略，会产生不同输入及监督位置。回答的suffix/EOS可能仍计入分母；被忽略的空思考段则可能不计入。

因此我需要同时核对原始数据身份、模板、实际编码器、长度、重复/填充、有效label规则及聚合实现。文件哈希证明输入版本，静态统计和运行实际消费又是不同层次。

## tokenizer的一个细节让我停止了“只是格式变化”的判断

一次核对中，vocab与added-token映射相同，有序merge pair在规范化后也一致。但pretokenizer和decoder的部分布尔选项发生变化，包括trim_offsets与其他ByteLevel相关配置。

这说明编码器整体并非已证明完全相同；也不能反过来断言输入ID一定变了。部分设置影响偏移、部分可能影响解码，具体影响要在实际API和代表样本上回归。

我的后续检查方案会固定空白、中文、特殊token、空思考段和长文本样本，对比input IDs、解码文本、offset及label mask。当前记录没有执行完整回归，因此变化的后果仍保留为待验证。

## 我现在怎样使用loss

在同一run、同一验证口径中，loss适合观察趋势和选候选权重。跨模型、跨阶段的排名，则先统一数据和计分方式，最后回到业务任务、事实与条件完整性、拒答和通用能力。

这次最有价值的发现是：解释一个指标，往往要先解释它的分母。忽略分母，训练表格上的小数很精确，结论却可能完全不在同一个问题上。

相关实测见 [最佳权重与验证回升](../validation-best-and-early-stop/)。
