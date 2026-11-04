戴夫（Dave）｜训练文章配套汇总数据

来源：作者整理的历史训练配置、日志与评测复核记录，冻结整理日期2026-11-04（Asia/Shanghai）。这是公开文章采用的脱敏汇总，不包含企业原文、问答数据、服务地址或完整训练日志；未为本次写作重新训练或重新评测。

microbatch-summary.csv：同一125B性能探针的三组汇总。每组运行6步，排除2步warmup后n=4；global batch为32。三组依次执行，模型/优化器/RNG状态没有独立重置，不能据此承诺端到端加速或质量不变。

validation-summary.csv：文章引用的已知验证观测，不是完整轨迹。9B的CPT和SFT是不同阶段、不同监督；27B为2026-11-04核对的新执行，验证pack有重复权重；125B前两个点来自micro8原段，后两个点来自micro32恢复段。不同run和阶段的loss不直接用于模型质量排名。

图表由仓库scripts/render-training-figures.py使用Matplotlib从上述CSV生成。cpt-best-last.svg只画27B的两个已知观测，不插值、不构造未公开的曲线。microbatch.svg展示median、mean以及min/max范围；范围不是置信区间。

这些汇总使读者可以复算本文中的比例和差值；不声称仅凭这些文件即可复现全部训练或验证企业业务效果。后续结果请使用新的日期记录，避免覆盖历史截点。
