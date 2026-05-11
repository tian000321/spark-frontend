// src/app/page.tsx
export default function HomePage() {
  const stats = [
    { label: '今日调度', value: '1,284', change: '+12%', icon: '⚡' },
    { label: '活跃节点', value: '342', change: '在线', icon: '🖥️' },
    { label: '累计赔付', value: '¥43.5', change: '2笔', icon: '🛡️' },
    { label: '信任准备金', value: '¥10,000', change: '健康', icon: '💰' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>下午好，田景华 👋</h1>
      <p style={{ color: '#A0A0B0', marginBottom: 32 }}>星火平台运行正常，所有服务健康</p>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)', transition: 'transform 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <span style={{ background: 'rgba(108,92,231,0.15)', color: '#A29BFE', padding: '2px 12px', borderRadius: 20, fontSize: 12 }}>{s.change}</span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>{s.value}</p>
            <p style={{ color: '#A0A0B0', fontSize: 14 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <h2 style={{ fontWeight: 700, marginBottom: 20 }}>快速开始</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: '部署 GPU', desc: '启动训练任务', href: '/chat' },
          { label: '氛围控制', desc: '打开嗨吧控台', href: '/console' },
          { label: '钱包', desc: '管理资产', href: '/wallet' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))',
            borderRadius: 16, padding: 20, textDecoration: 'none', color: '#F5F5F7',
            border: '1px solid rgba(108,92,231,0.3)', transition: 'all 0.2s',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{item.label}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#A0A0B0' }}>{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}