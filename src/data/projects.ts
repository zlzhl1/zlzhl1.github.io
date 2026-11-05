export interface Project {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  goal: string;
  role: string;
  scope: string;
  stack: string[];
  preview: { value: string; label: string; basis: string };
  architecture: { title: string; detail: string; collaborator?: boolean }[];
  architectureNote: string;
  contributions: { title: string; detail: string }[];
  decisions: { title: string; problem: string; choice: string; reason: string }[];
  outcomes: { value: string; label: string; basis: string; detail: string }[];
  reflection: string;
  next: string;
  articles: { id: string; note: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: 'fando', number: '01', title: 'FanDo 企业 Agent 客户端与模型服务', shortTitle: '企业 Agent 客户端',
    category: '员工使用入口 · 客户端工程',
    summary: '把员工身份、模型服务、会话历史和经验沉淀接成一个可持续使用的企业 AI 入口。',
    goal: '解决安装配置复杂、账号与模型入口分散、聊天历史不稳定等问题，让员工可以接着上一次的工作继续使用 AI。',
    role: '初版独立开发，后续担任技术负责人',
    scope: '我完成技术架构设计、客户端和模型跳板初版，并推进状态、调度与经验机制。项目后续由11人团队协作；会议与语音部分承担方案设计和技术评审。',
    stack: ['OpenClaw', 'Electron', 'React', 'TypeScript', 'Zustand', 'SQLite', 'Redis'],
    preview: { value: '近600', label: '内部日活用户', basis: '本人确认的项目使用规模' },
    architecture: [
      { title: '员工客户端', detail: '界面、会话与本地状态' },
      { title: '接入与调度', detail: '身份校验、模型接入、请求分流' },
      { title: 'Agent 执行', detail: 'Gateway、模型与工具调用' },
      { title: '事件回流', detail: '本地历史、投影与补偿' },
    ],
    architectureNote: '图为主要调用与结果回流。接入服务、客户端和 Gateway 各有运行边界；会议辅助与实时语音是并列能力入口。',
    contributions: [
      { title: '打通统一使用入口', detail: '完成架构设计和初版封装开发，衔接既有 OA 身份、模型接入、心跳及运行时会话，降低员工自行配置的负担。' },
      { title: '处理状态与交互可靠性', detail: '统一会话事件与本地状态，以 SQLite 本地优先、消息身份和持久化补偿处理历史覆盖、重复和错序；对聊天、交互读取与后台请求分别调度。' },
      { title: '让经验能够迭代', detail: '设计并落地 Handbook（自优化工作手册）的候选采集、结构化修订和验证后技能沉淀，保留经验来源与变更记录。' },
      { title: '评审会议与语音方案', detail: '围绕会议上下文、前后台任务、可打断交互和轮次隔离进行方案设计与技术评审，推动能力上线使用；不把语音内核及后续团队全部实现归为个人开发。' },
    ],
    decisions: [
      { title: '先保护正在等待的聊天', problem: '健康探测、历史和后台同步共用资源时，慢请求会拖住用户发送。', choice: '在统一 RPC 入口分类，独立管理并发、排队和超时；聊天活跃时后台让路。', reason: '不同请求的紧迫程度不同。提高全局并发可能把压力推向上游，分流才能明确保护交互。' },
      { title: '本地先显示，远端再补齐', problem: '远端读取慢，直接替换列表还可能覆盖刚生成的新回复。', choice: '本地历史优先展示，以事件身份组织增量回填，并将失败恢复登记为持久化补偿任务。', reason: '把即时可见与最终补齐分开处理。队列的幂等和重试也不自动构成消息与上传任务的共同事务。' },
    ],
    outcomes: [
      { value: '近600人', label: '内部日活', basis: '本人确认 · 项目整体规模', detail: '用于说明实际采用范围，不是某一个模块独立带来的新增用户数，也不代表今天的实时监控。' },
      { value: 'P95 < 100ms', label: '聊天历史读取', basis: '本人确认 · 历史指标', detail: '对应历史读取链路，不扩展为模型首字延迟、端到端回答速度或所有网络条件下的保证。' },
    ],
    reflection: '把开源 Agent 变成员工愿意继续使用的产品，关键工作常在组件之间：谁先处理、状态由谁写、失败后从哪里恢复。',
    next: '继续用完整用户操作链检验恢复能力，分别观察发送、历史补齐、后台同步和故障重开；新增性能结论需要同环境的测量。',
    articles: [
      { id: 'openclaw-enterprise-client', note: '架构选择与客户端增量' },
      { id: 'agent-scheduling-and-outbox', note: '请求分流、事件投影与事务边界' },
    ],
  },
  {
    id: 'knowledge', number: '02', title: '企业知识治理与图谱检索平台', shortTitle: '知识治理与图谱检索',
    category: '企业资料 · 可追溯知识',
    summary: '从复杂文档中保留原文和条件，建设图谱与向量知识服务，把证据交接到后续问答与审核环节。',
    goal: '解决资料格式混杂、知识缺少出处、实体异名和近名歧义等问题，使检索结果能回到原始证据。',
    role: '知识治理与检索平台开发',
    scope: '我负责资料处理、知识组织、实体归一、策略管理及工作流交接。QA生成与部门业务审核由协作方主责，多个阶段按批次衔接。',
    stack: ['Python', 'FastAPI', 'React', 'Neo4j', 'Milvus', 'MinerU', 'Data-Juicer'],
    preview: { value: '3 TB', label: '企业资料规模', basis: '本人确认的项目整体口径' },
    architecture: [
      { title: '资料与来源', detail: '原文、身份与版本' },
      { title: '解析与质检', detail: '格式路由、保真、候选分流' },
      { title: '知识服务', detail: '语义切分、图谱与向量' },
      { title: '证据批次', detail: '原文引用、输入快照与校验' },
      { title: 'QA与业务审核', detail: '协作方接收与确认', collaborator: true },
    ],
    architectureNote: '这是按批次衔接的多阶段流程。图谱关系与模型补充解释仍需回到原文核对；最后一环明确属于协作交接。',
    contributions: [
      { title: '组织可恢复的文档处理', detail: '集成PDF与Office分类解析，保留标题、表格、图片关系及来源身份，以输入和产物校验支持恢复，隔离异常文件。' },
      { title: '实现实体归一算子', detail: '先按类型召回，再结合相似度和第一、第二候选分差处理近名；保留歧义原因，同步关系端点和名称索引。' },
      { title: '管理抽取策略与版本', detail: '将提示词做成草稿、发布和历史版本，检查并发修改冲突，把有效策略指纹纳入缓存身份。' },
      { title: '交付可追踪的证据批次', detail: '以来源清单、原文引用、输入配置快照和可恢复任务衔接问答生成，避免把图谱描述直接当作已经业务确认的事实。' },
    ],
    decisions: [
      { title: '歧义先保留，不强行合并', problem: '同名可能指向不同对象，近名也可能属于不同类型；误合并会把关系一起混在错误节点上。', choice: '把同类型约束放在Top-K召回前，再设置相似度与候选分差门槛；低分、冲突和歧义保留原对象。', reason: '让不确定性成为可复核状态，比为了让图更整齐而强行归一更稳妥。' },
      { title: '完成标志必须能重新核验', problem: '文件存在不代表转换完整；同名来源、部分产物和中断可能造成错误复用。', choice: '用来源身份、哈希、页覆盖及图片引用等检查决定是否复用，失败项保留原因。', reason: '后续答案出现问题时，要能定位到某份资料和具体处理阶段，而不是整批从头猜。' },
    ],
    outcomes: [
      { value: '3 TB', label: '资料治理与交付规模', basis: '本人确认 · 项目整体口径', detail: '整体资料规模与历史单批次文档数分别记录，不能据此推断每一份内容均已人工逐字审核。' },
      { value: '可追溯批次', label: '从来源到下游交接', basis: '历史源码与贡献记录', detail: '已有来源校验、实体归一、策略版本及任务恢复机制；暂无严格的业务误合并率前后对照，不补写精度提升比例。' },
    ],
    reflection: '知识治理的重要产物，是有来源、有用途、有待确认状态的资料集合。文本更短、实体更多，都不能单独证明知识更可靠。',
    next: '建立包含异名、近名和同名异类型的标注集，分别检查误合并与漏合并，再验证它们对检索和答案的影响。',
    articles: [
      { id: 'lightrag-entity-resolution', note: '实体身份、提示词与索引一致性' },
      { id: 'document-conversion-recovery', note: '文档转换的保真与恢复' },
      { id: 'data-juicer-dataflow-practice', note: '候选分流与业务确认边界' },
    ],
  },
  {
    id: 'model-training', number: '03', title: '领域模型训练方案与评测', shortTitle: '领域模型训练与评测',
    category: '数据与模型 · 实验决策',
    summary: '围绕领域学习、回答对齐和通用能力保留，完成数据增强、分层实验、验证选模及可追溯评测。',
    goal: '改善单阶段SFT领域贴合不足的问题，同时识别领域收益与通用能力的取舍，让模型选择有同口径的证据。',
    role: '训练方案设计、实现与实验评估',
    scope: '按2026年11月4日最新本人确认稿，我设计并落地CPT→SFT，完成9B、27B及125B级模型训练与LoRA/全参对照，建立数据和评测追踪。6人项目团队的整体成果与个人实现分别表达。',
    stack: ['PyTorch', 'LLaMA-Factory', 'DeepSpeed', 'FSDP2', 'Megatron', 'EvalScope', 'vLLM', 'Optuna'],
    preview: { value: '93/100', label: '人工业务评审', basis: '本人确认；不表示准确率' },
    architecture: [
      { title: '版本化数据', detail: '事实约束增强、领域与通用混合' },
      { title: '分层实验', detail: '子集搜索与全量复验' },
      { title: 'CPT / SFT', detail: '不同规模与更新范围的对照' },
      { title: '独立评测', detail: '业务题、基座与通用基准' },
      { title: '选模与反馈', detail: '最佳权重、误例与数据规范' },
    ],
    architectureNote: '不同模型规模属于各自的实验线路；直接SFT也保留为基线。数据准备、训练验证和下游业务验收分别记录。',
    contributions: [
      { title: '落地分阶段训练路线', detail: '围绕领域文本学习与回答行为对齐组织CPT→SFT，以及LoRA/全参对照，保留父权重和每次执行身份。' },
      { title: '实现数据增强与混合', detail: '增强时保留数字、关系和适用条件，增加重复/完整性校验、失败恢复及来源追踪；按token组织领域与通用数据。' },
      { title: '建立实验和选模流程', detail: '通过子集搜索、全量复验和验证曲线选择权重，探索学习率、轮次、上下文，以及分片、张量/流水线并行与packing适配。' },
      { title: '让评测回到具体版本', detail: '追踪数据、配置、权重和输出，开展隔离推理、来源评分与基座逐题对照，将数字、条件冲突和问答长度等误例沉淀为规范与质检Skill。' },
    ],
    decisions: [
      { title: '按token控制混合，而不是按文档条数', problem: '长文与短问答长度差异大，按行数拼接不能说明模型实际接触了多少领域或通用内容。', choice: '统计混合token份额，保留验证集隔离、去重和构建版本；新确认方案采用30%通用token。', reason: '把领域学习预算与能力保留放在同一张账上，再用业务和通用评测检验取舍；不把旧20%实验倒填成新30%版本。' },
      { title: '先证明能比较，再解释提升', problem: '不同数据、模板、监督分母和裁判规则会改变分数；同一预测重新评分也可能变高。', choice: '分别固定模型身份、生成条件与评分协议，保留成功题分母；结合best/last及通用能力结果选模。', reason: '验证loss下降只能回答特定监督口径的拟合问题，不能替代事实、条件完整性、拒答与业务验收。' },
    ],
    outcomes: [
      { value: '93/100', label: '人工业务评审', basis: '最新本人确认', detail: '这是人工业务评审得分，不是93%准确率，也不与历史AI裁判分拼成提升。' },
      { value: '近三成', label: '相关任务处理耗时降低', basis: '最新本人确认 · 应用结果', detail: '范围是模型应用后的相关业务任务，不扩展为全公司效率、模型推理速度或算力成本改善。' },
      { value: '9B / 27B / 125B', label: '训练与对照规模', basis: '最新确认稿与历史实验记录', detail: '各线路有独立数据、配置、权重和状态。团队资源为16张本地H200与24张云端H200，不表示单次40卡联合训练。' },
    ],
    reflection: '额外训练阶段和更大的模型都不是默认收益。小差值、短探针、重复评分及恢复重算需要分别解释，才能决定下一轮把预算花在哪里。',
    next: '继续补齐同条件基线、代表性重复实验与源级隔离盲测，把质量变化和端到端计算成本放在一起评估。',
    articles: [
      { id: 'llamafactory-training-stack', note: '训练路线与并行策略' },
      { id: 'cpt-sft-experiment-review', note: '9B的参数设计与实际记录' },
      { id: 'evalscope-comparable-evaluation', note: '业务对照及评分口径' },
      { id: 'microbatch-speed-probe', note: '微批性能和长尾' },
      { id: 'validation-best-and-early-stop', note: '最佳权重、末点与早停' },
      { id: 'loss-denominator-and-tokenizer', note: '监督token与分母' },
      { id: 'training-run-identity-and-resume', note: '执行身份与恢复成本' },
    ],
  },
  {
    id: 'customer-service', number: '04', title: 'AI 客服复杂售后流程与回复协议', shortTitle: 'AI 客服售后工作流',
    category: '复杂对话 · 业务工具执行',
    summary: '把容易跳步和遗忘条件的售后对话，改造成有节点、有跨轮状态、有真实工具和人工兜底的流程。',
    goal: '让退货等复杂售后问题能持续推进：信息缺失时追问，金额交给代码计算，异常时有明确转人工路径。',
    role: 'Python工作流、提示词与回复协议开发',
    scope: '在既有客服系统中负责售后链路修复、已签收退货节点化工作流、Redis跨轮状态和多段回复协议；系统整体架构和业务规模来自团队。',
    stack: ['Python', 'Flask', 'Redis', 'MySQL', 'Milvus', 'Mermaid'],
    preview: { value: '10万+', label: '项目日对话次数', basis: '本人确认的团队整体规模' },
    architecture: [
      { title: '对话与场景', detail: '品牌、物流、历史与用户意图' },
      { title: '节点化流程', detail: '判断、话术与函数节点' },
      { title: '工具与状态', detail: '真实业务函数、Redis续跑状态' },
      { title: '回复与动作', detail: '语义分段、逐句action与终态' },
      { title: '下一轮或人工', detail: '恢复、结束清理与异常兜底' },
    ],
    architectureNote: 'Mermaid描述业务节点，Redis保留跨轮位置和金额。函数节点调用真实工具；金额计算由代码执行，未知或参数不足时追问或转人工。',
    contributions: [
      { title: '修复建单与重复请求', detail: '补齐接口请求字段，以品牌和原订单号形成幂等键，增加Redis锁、成功缓存和重复结果兼容，约束工具重试的副作用。' },
      { title: '把长提示词拆成显式节点', detail: '将已签收退货流程组织成判断、话术与函数节点，按场景动态装载模板与流程，避免每次都依靠模型重新猜进度。' },
      { title: '保留跨轮业务状态', detail: '用Redis记录节点轨迹、续跑位置和已计算金额，下一轮先恢复状态，再处理投诉、放弃等优先分支，必要时转人工。' },
      { title: '改造多段回复协议', detail: '让每句回复关联action与子流程状态，处理发送顺序、末段终态和旧协议兼容，使对话表达与业务动作分别有明确字段。' },
    ],
    decisions: [
      { title: '把流程状态从模型记忆中拿出来', problem: '用户会改口、补信息或插入投诉；长自然语言提示词容易跳步、重复追问或丢掉金额。', choice: '显式划分D/A/F节点，恢复Redis状态后再路由；计算交给代码，缺信息进入追问或人工兜底。', reason: '让模型处理语言理解和表达，让后端保存业务事实与可继续的位置，减少多轮执行的不确定性。' },
      { title: '每句回复也有业务语义', problem: '单条长回复机械，多段发送若只切字符串又可能错配动作或提前结束会话。', choice: '按语义输出reply列表，逐句关联action，最后一段承接终态，保留旧接口兼容。', reason: '用户看到的文本与后端执行的动作需要同一套顺序和状态协议，不能只优化文字外观。' },
    ],
    outcomes: [
      { value: '日对话10万+', label: '项目业务规模', basis: '本人确认 · 团队整体结果', detail: '说明所处系统的应用规模，不将全部业务承接归因于个人模块。' },
      { value: '98%', label: '项目覆盖率', basis: '本人确认 · 团队整体结果', detail: '与好评率分别使用，不当作售后流程正确率、单项修复成功率或本次独立复测结果。' },
      { value: '85%—90%', label: '项目好评率', basis: '本人确认 · 团队整体结果', detail: '个人交付由历史代码、提交和上线记录支持；没有单项改造的独立前后测量，不补写稳定性提升比例。' },
    ],
    reflection: '让模型理解用户意图，只完成了一部分工作。业务系统能执行、重复调用有约束、下一轮能接上，才构成一条可用的售后链路。',
    next: '继续按真实异常场景检查状态恢复、重复工具调用和人工兜底；同一订单不同售后类型的幂等边界需要单独验证。',
    articles: [],
  },
];
