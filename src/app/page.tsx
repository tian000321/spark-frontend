import SparkCard from '@/components/ui/SparkCard';
import SparkBadge from '@/components/ui/SparkBadge';

const stats = [
  { label: '今日调度', value: '1,284', change: '+12% vs 昨日', icon: '⚡', variant: 'info' as const },
  { label: '活跃节点', value: '342', change: '98% 在线率', icon: '🖥️', variant: 'success' as const },
  { label: '累计赔付', value: '¥43.5', change: '2笔', icon: '🛡️', variant: 'warning' as const },
  { label: '准备金余额', value: '¥10,000', change: '健康', icon: '💰', variant: 'success' as const },
];

const quickActions = [
  { label: '🤖 问 Orca', desc: '部署 GPU、分析文件', href: '/' },
  { label: '🎛️ 控台', desc: '打开智能嗨吧控台', href: '/console' },
  { label: '👛 钱包', desc: '管理资产、提现', href: '/wallet' },
  { label: '🖥️ 节点', desc: '浏览算力市场', href: '/node-market' },
  { label: '📋 任务', desc: '查看任务中心', href: '/tasks' },
  { label: '⭐ 招募', desc: '加入精英招募', href: '/onboarding-guide' },
];

export default function HomePage() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>
        下午好，田景华 👋
      </h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 32 }}>
        星火平台运行正常，所有服务健康
      </p>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map((s) => (
          <SparkCard key={s.label} hoverable padding={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <SparkBadge variant={s.variant}>{s.change}</SparkBadge>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>{s.value}</p>
            <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>{s.label}</p>
          </SparkCard>
        ))}
      </div>

      {/* 快捷入口 */}
      <h2 style={{ fontWeight: 700, marginBottom: 20 }}>快速开始</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {quickActions.map((item) => (
          <a key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <SparkCard hoverable padding={20}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--spark-font-size-lg)' }}>{item.label}</h3>
              <p style={{ margin: 0, fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>
                {item.desc}
              </p>
            </SparkCard>
          </a>
        ))}
      </div>
    </div>
  );
}