'use client';
import { useState } from 'react';
import SparkCard from '@/components/ui/SparkCard';
import SparkInput from '@/components/ui/SparkInput';

// ---------- 完整的帮助目录 ----------
const helpCategories = [
  {
    title: '🚀 精英招募与入驻',
    faqs: [
      {
        q: '如何加入星火精英招募？',
        a: '点击导航栏“精英招募”或侧边栏“⭐ 精英招募”，你将看到四种角色：创作者、开发者、节点提供者、代理商。选择适合你的角色，填写真实姓名、联系电话、擅长领域等信息，阅读并同意对应协议后提交申请。平台将在1-3个工作日内完成审核。审核通过后，你将收到签约通知，在线签署电子协议后即可开通对应后台。'
      },
      {
        q: '入驻需要准备哪些材料？',
        a: '个人入驻：身份证或护照信息（用于实名认证）、手机号码、本人收款账户。企业入驻：营业执照、对公账户信息、授权委托书（非法人操作时）。不同角色可能还需要补充作品集（创作者）、技术栈说明（开发者）、硬件清单（提供者）或推广渠道（代理）。'
      },
      {
        q: '四种角色有什么区别？',
        a: '🎨 创作者：上传原创氛围包（音乐+灯光编排），酒吧等场所调用后你获得70%分账，前10个包更享100%分账。💻 开发者：发布智能体（AI模型服务），平台按API调用量与你70/30分账。🖥️ 节点提供者：将GPU服务器接入平台，完成任务后首年获得95%收入，次年起90%。🤝 代理商：拓展客户推广平台产品（算力、智能体、氛围包），按客户消费额获得1%-3%佣金。'
      },
      {
        q: '审核没通过怎么办？',
        a: '审核未通过时，你会收到驳回原因（例如信息不完整、资质不符、作品侵权等）。你可以根据驳回原因修改后重新提交。如果对驳回有异议，可联系平台客服或通过Orca助手进行申诉。'
      },
    ],
  },
  {
    title: '💻 任务与托管',
    faqs: [
      {
        q: '如何创建一个任务？',
        a: '进入“任务中心”，点击“+ 启动新任务”。填写任务名称，选择业务类型（图像识别/自然语言处理等）、工作负载（训练/推理/微调）、预计耗时，并勾选是否启用托管。系统会根据所选GPU型号和时长自动估算费用。点击“确认启动”后，平台将自动为你调度最优算力资源。'
      },
      {
        q: '什么是“托管任务”？',
        a: '托管是星火平台的极致服务承诺。启用托管后，如果任务因供应商宕机、平台故障等原因失败，平台将按不低于你支付费用的200%自动赔付，无需你主动申诉。托管任务的调度、监控、故障切换均由平台全权负责——你只需提交任务，然后去睡觉。'
      },
      {
        q: '任务执行失败时会发生什么？',
        a: '如果任务失败，系统会首先尝试自动重试（最多3次）。如果自动重试失败，会尝试切换到其他可用供应商。如果仍失败，将进入人工介入流程。对于启用了托管的失败任务，系统会自动按200%赔率计算赔付金额，并在你钱包中生成一笔赔付收入。赔付记录会写入不可篡改的信任账本，随时可查。'
      },
      {
        q: '如何查看任务详情和日志？',
        a: '在任务中心找到对应任务卡片，点击“📋 实时日志”（运行中的任务）或“📥 下载”（已完成的任务）。点击卡片本身也可以展开查看任务的完整调度决策日志、供应商信息、费用明细等。'
      },
    ],
  },
  {
    title: '💰 费用、赔付与钱包',
    faqs: [
      {
        q: '钱包里有哪些资金？',
        a: '钱包包含“可用余额”和“冻结资金”两部分。可用余额是你可以自由提现或用于创建任务的钱。冻结资金是你正在进行中的托管任务所需的保证金，任务完成后会自动解冻。总资产 = 可用余额 + 冻结资金。'
      },
      {
        q: '如何充值？',
        a: '在钱包页面点击“充值”按钮，输入金额并确认即可。当前版本为模拟充值，后续将接入微信、支付宝等真实支付渠道。'
      },
      {
        q: '如何提现？',
        a: '提现前必须完成两个步骤：① 在钱包页面或各后台的“提现”标签下，绑定本人实名的微信/支付宝/银行卡。② 在钱包页面设置6位以上数字支付密码。完成这两步后，输入提现金额，验证支付密码即可提交申请。提现预计1-2个工作日到账。'
      },
      {
        q: '赔付规则是什么？',
        a: '● 赔付触发条件：托管任务因平台方故障或供应商宕机导致失败。\n● 赔付金额：不低于服务费的200%，单次赔付上限为¥200。\n● 每日限额：每日赔付总额上限¥1,000，每日次数上限10次。\n● 大额审核：单次赔付超过¥100时，需人工审核。\n● 自动执行：赔付由代码自动完成，全程无人干预，不可篡改。\n● 24小时冷静期：赔付到账后24小时内，如果你认为赔付有误，可联系客服申诉撤销。'
      },
      {
        q: '什么是“信任准备金”？',
        a: '信任准备金是平台为保障赔付承诺而设立的独立资金池，初始金额为¥10,000。所有自动赔付均从此账户扣除，而非从平台营收中支出。当准备金余额低于¥8,000时，系统将自动触发全局熔断，暂停所有新任务的托管功能，直至准备金补充至安全水位。你可以在“信任仪表盘”实时查看准备金余额。'
      },
      {
        q: '如何查看我的赔付记录？',
        a: '在任务中心的失败任务卡片上，如果已触发赔付，会显示“已赔付 ¥XX”标签。点击“赔付详情”按钮可以看到完整的赔付记录：故障原因、赔付倍数、金额、执行时间、哈希值等。你也可以在“信任仪表盘”中查看所有公开的赔付记录。'
      },
    ],
  },
  {
    title: '🎛️ 智能嗨吧控台',
    faqs: [
      {
        q: '如何使用控台控制氛围？',
        a: '控台提供六大功能模块：🎬 媒体库（浏览和播放音频、MV、DJ视频），🎧 DJ模式（虚拟打碟机，支持双通道搓碟、混音、喊麦），🎤 唱歌模式（点歌队列、人声切换、自动修音），🎭 声光电智控（场景推荐、智能编排、手动调节灯光/烟雾/激光），🎚️ 智能调音（三段均衡器实时调节），🛒 嗨吧市场（选购专业DJ创作的氛围包一键应用）。'
      },
      {
        q: '虚拟打碟机怎么操作？',
        a: '进入DJ模式后，你将看到两个通道（A和B），每个通道有一个圆形转盘。● 拖拽转盘：模拟搓碟效果，BPM会随之变化。● 调节推子：控制每个通道的音量和EQ（高、中、低频）。● 横推子（Crossfader）：控制A/B通道的输出比例。● 自动混音：AI自动分析两首歌的BPM，平滑过渡切换。● 曲库：点击歌曲名字旁的A或B按钮，可将歌曲加载到对应通道。'
      },
      {
        q: '场景托管和智能编排有什么区别？',
        a: '场景托管：一键切换预设场景（暖场/高潮/Chill/应急），系统自动调整所有参数。智能编排：开启后，系统会根据当前时间段（如傍晚、深夜）自动判断最合适的氛围，并自动调整音乐风格、灯光模式、BPM等，无需人工干预。'
      },
      {
        q: '否决按钮（Soul Knob）是什么？',
        a: '否决按钮是物理否决权协议（PVP）的体现。按下否决按钮后，所有AI正在执行的自动混音、氛围切换、灯光控制将立即停止，系统进入安全模式（全场静音、灯光全亮白光）。否决信号通过独立于主系统的硬件电路执行，延迟低于100毫秒，无法被软件拦截。'
      },
    ],
  },
  {
    title: '🔒 安全与隐私',
    faqs: [
      {
        q: '我的数据会怎么被处理？',
        a: '平台严格遵守“数据最小化”原则，仅收集服务必需的姓名、电话、邮箱、设备信息。你的任务数据、代码、模型不会被用于任何AI模型训练。你的个人信息不会被出售或共享给第三方。你随时可以在个人中心请求删除全部数据，平台将在5个工作日内完成。'
      },
      {
        q: '支付密码忘记了怎么办？',
        a: '当前版本暂未开通密码找回功能。在正式运营后，你可以通过绑定的手机号接收验证码来重置支付密码。在此之前，请务必牢记你设置的支付密码。如果确实遗忘，你可以在钱包页面选择“修改支付密码”，输入原密码（如果你还记得）来更换新密码。如果完全忘记，需要联系人工客服处理。'
      },
      {
        q: '平台怎么保障我的资金安全？',
        a: '你的资金存储在独立的信任准备金账户中（平台账户与用户资金账户严格隔离）。所有充值、提现、赔付交易都会记录在链式哈希的信任账本上，任何人均可公开验证，无法篡改。大额赔付（超过¥100）需要人工审核，且每日有总额和次数上限。'
      },
    ],
  },
];

// ---------- 主帮助页面 ----------
export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>
        📚 帮助中心
      </h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24, fontSize: 'var(--spark-font-size-sm)' }}>
        从入门到精通，你想知道的一切都在这里。找不到答案？问问右下角的Orca助手。
      </p>

      <SparkInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索问题关键词..."
        style={{ marginBottom: 32 }}
      />

      {helpCategories.map((category, catIdx) => {
        const filtered = category.faqs.filter(
          faq =>
            faq.q.includes(search) ||
            faq.a.includes(search)
        );
        if (filtered.length === 0) return null;

        return (
          <div key={catIdx} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 'var(--spark-font-size-xl)',
                fontWeight: 700,
                marginBottom: 16,
                color: 'var(--spark-text-primary)',
              }}
            >
              {category.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((faq, idx) => {
                const key = `${catIdx}-${idx}`;
                const isOpen = expanded === key;
                return (
                  <SparkCard
                    key={key}
                    padding={16}
                    onClick={() => setExpanded(isOpen ? null : key)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        fontWeight: 600,
                        fontSize: 'var(--spark-font-size-md)',
                        color: isOpen ? 'var(--spark-brand-light)' : 'var(--spark-text-primary)',
                        gap: 12,
                      }}
                    >
                      <span>{faq.q}</span>
                      <span
                        style={{
                          fontSize: 14,
                          color: 'var(--spark-text-muted)',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                    {isOpen && (
                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 14,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          fontSize: 'var(--spark-font-size-sm)',
                          color: 'var(--spark-text-secondary)',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </SparkCard>
                );
              })}
            </div>
          </div>
        );
      })}

      {helpCategories.every(cat =>
        cat.faqs.every(
          faq =>
            !faq.q.includes(search) && !faq.a.includes(search)
        )
      ) && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--spark-text-muted)',
            padding: 40,
            fontSize: 'var(--spark-font-size-md)',
          }}
        >
          没有找到相关问题。
          <span
            style={{
              color: 'var(--spark-brand-light)',
              cursor: 'pointer',
              marginLeft: 6,
              fontWeight: 500,
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-orca'))}
          >
            问问Orca助手 →
          </span>
        </p>
      )}
    </div>
  );
}