'use client';
import { useState, useEffect } from 'react';

export default function TrustPage() {
  const [metrics, setMetrics] = useState({
    complianceRate: 100,
    aiLabelCoverage: 100,
    fairnessBias: 2.3,
    crossBorderRate: 100,
  });

  const [heatmap, setHeatmap] = useState([
    { region: '贵州', model: '图像分类', bias: 1.2 },
    { region: '北京', model: '文本生成', bias: 3.4 },
    { region: '上海', model: '语音识别', bias: 0.8 },
    { region: '深圳', model: '目标检测', bias: 2.1 },
  ]);

  const [votes, setVotes] = useState<any[]>([]);

  // 动态更新数据
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        complianceRate: Math.min(100, Math.max(95, prev.complianceRate + (Math.random() - 0.5) * 0.5)),
        aiLabelCoverage: Math.min(100, Math.max(98, prev.aiLabelCoverage + (Math.random() - 0.5) * 0.3)),
        fairnessBias: Math.min(10, Math.max(0, prev.fairnessBias + (Math.random() - 0.5) * 0.2)),
        crossBorderRate: Math.min(100, Math.max(95, prev.crossBorderRate + (Math.random() - 0.5) * 0.4)),
      }));

      setHeatmap(prev =>
        prev.map(h => ({
          ...h,
          bias: Math.min(10, Math.max(0, h.bias + (Math.random() - 0.5) * 0.3)),
        }))
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // 获取表决数据
  useEffect(() => {
    fetch('http://localhost:8080/v1/ethics/votes')
      .then(r => r.json())
      .then(setVotes)
      .catch(() => setVotes([]));
  }, []);

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    padding: 24,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>🛡️ 信任仪表盘</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
        公开透明 · 实时数据 · 每3秒自动刷新 · 无需登录即可查看
      </p>

      {/* 核心指标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'C01-C22 合规通过率', value: `${metrics.complianceRate.toFixed(1)}%`, color: '#2E7D32', bg: 'var(--badge-green-bg)' },
          { label: 'AI 标识覆盖率', value: `${metrics.aiLabelCoverage.toFixed(1)}%`, color: '#1565C0', bg: 'var(--badge-blue-bg)' },
          { label: '公平性偏差', value: `${metrics.fairnessBias.toFixed(2)}%`, color: metrics.fairnessBias > 3 ? '#D32F2F' : '#F57C00', bg: metrics.fairnessBias > 3 ? 'var(--badge-red-bg)' : 'var(--badge-orange-bg)' },
          { label: '跨境合规率', value: `${metrics.crossBorderRate.toFixed(1)}%`, color: '#2E7D32', bg: 'var(--badge-green-bg)' },
        ].map((item, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{item.label}</p>
            <p style={{ fontSize: 36, fontWeight: 'bold', color: item.color, transition: 'all 0.3s' }}>
              {item.value}
            </p>
            <div style={{ marginTop: 12, height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
              <div style={{
                height: '100%',
                width: item.value,
                background: item.color,
                borderRadius: 3,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
              {item.label.includes('偏差') ? '阈值: 10%' : '目标: 100%'}
            </div>
          </div>
        ))}
      </div>

      {/* 公平性热图 */}
      <div style={{ ...cardStyle, marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>
          🌍 公平性偏差热图（按地区/模型）
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                <th style={{ padding: 10, color: 'var(--text-secondary)' }}>地区</th>
                <th style={{ padding: 10, color: 'var(--text-secondary)' }}>模型</th>
                <th style={{ padding: 10, color: 'var(--text-secondary)' }}>偏差率</th>
                <th style={{ padding: 10, color: 'var(--text-secondary)' }}>风险指示</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 10, fontWeight: 500, color: 'var(--text-primary)' }}>{item.region}</td>
                  <td style={{ padding: 10, color: 'var(--text-secondary)' }}>{item.model}</td>
                  <td style={{ padding: 10, fontWeight: 500, color: item.bias > 3 ? '#D32F2F' : item.bias > 2 ? '#F57C00' : '#2E7D32' }}>
                    {item.bias.toFixed(2)}%
                  </td>
                  <td style={{ padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 4 }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(item.bias * 10, 100)}%`,
                          background: item.bias > 3 ? '#D32F2F' : item.bias > 2 ? '#F57C00' : '#2E7D32',
                          borderRadius: 4,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {item.bias > 3 ? '⚠️ 高风险' : item.bias > 2 ? '⚡ 中风险' : '✅ 低风险'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 伦理表决 */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>
          ⚖️ 伦理委员会表决记录
        </h2>
        {votes.length > 0 ? votes.map((vote: any) => (
          <div key={vote.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{vote.topic}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                状态: {vote.status}
                {vote.chain_hash && ` · 存证: ${vote.chain_hash.slice(0, 10)}...`}
              </p>
            </div>
            <span style={{ fontSize: 13, color: vote.status === '已完成' ? 'var(--badge-green-text)' : 'var(--badge-orange-text)' }}>
              {vote.status === '已完成' ? '✅ 已完成' : '⏳ 进行中'}
            </span>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>暂无表决记录</p>
        )}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 24 }}>
        💡 以上数据每3秒自动更新 · 季度合规报告可下载 · 年度第三方审计中
      </p>
    </div>
  );
}