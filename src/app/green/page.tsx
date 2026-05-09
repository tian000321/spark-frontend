export default function GreenPage() {
  return (
    <div style={{ padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <h1>🌱 绿色计算认证</h1>
      <p style={{ color: 'var(--text-muted)' }}>碳排放数据、绿色凭证（Y2/Y3 规划，当前为演示页面）</p>
      <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, marginTop: 20 }}>
        <p>本月碳足迹：12.5 kg CO₂e</p>
        <p>绿色能源占比：68%</p>
        <p>证书状态：审核中</p>
      </div>
    </div>
  );
}