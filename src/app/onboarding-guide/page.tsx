'use client';
import SparkCard from '@/components/ui/SparkCard';
import SparkBadge from '@/components/ui/SparkBadge';

const roles = [
  {
    title: '创作者',
    icon: '🎨',
    desc: '专业DJ、音乐制作人、灯光设计师。上传原创氛围包赚取分账。',
    earnings: '分账70%（前10个包100%）',
    steps: ['提交入驻申请', '签署创作者协议', '上传氛围包', '审核通过上架嗨吧市场', '按调用次数获得收益'],
    link: '/creator',
  },
  {
    title: '开发者',
    icon: '💻',
    desc: 'AI算法工程师。发布智能体，按API调用量获得收益。',
    earnings: '分账70%',
    steps: ['提交入驻申请', '签署开发者协议', '发布智能体', '合规审核', '上架智能体市场，按调用量收益'],
    link: '/developer-register',
  },
  {
    title: '算力提供者',
    icon: '🖥️',
    desc: '拥有GPU服务器的个人或企业。接入平台，完成任务获得收益。',
    earnings: '分账95%（首年）',
    steps: ['提交入驻申请', '签署提供者协议', '接入算力节点', '节点上线', '接收任务，获得收益'],
    link: '/nodes',
  },
  {
    title: '代理商',
    icon: '🤝',
    desc: '拓展客户，推广平台产品。按业绩获得佣金。',
    earnings: '佣金1%-3%',
    steps: ['提交加盟申请', '签署代理协议', '推广算力/智能体/氛围包', '客户消费', '按比例获得佣金'],
    link: '/agent-register',
  },
];

export default function OnboardingGuidePage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>精英招募</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 32 }}>选择适合你的角色，开始赚取收益。</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {roles.map(role => (
          <SparkCard key={role.title} padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{role.icon}</div>
              <h3 style={{ fontSize: 'var(--spark-font-size-xl)', fontWeight: 600, marginBottom: 6 }}>{role.title}</h3>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 12, flex: 1 }}>{role.desc}</p>
              <SparkBadge variant="info" style={{ width: 'fit-content', marginBottom: 12 }}>💰 {role.earnings}</SparkBadge>
              <div style={{ marginBottom: 16 }}>
                {role.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 'var(--spark-font-size-sm)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--spark-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <a href={role.link} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                <span style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: 'var(--spark-brand-gradient)', color: '#fff', borderRadius: 'var(--spark-radius-md)', fontWeight: 600, fontSize: 'var(--spark-font-size-md)' }}>
                  去入驻 →
                </span>
              </a>
            </div>
          </SparkCard>
        ))}
      </div>
    </div>
  );
}