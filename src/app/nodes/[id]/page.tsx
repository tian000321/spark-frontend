'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const NODES_DB: Record<string, any> = {
  'node-1': {
    id: 'node-1', name: 'A100-贵阳超算', gpu: 'A100×8', region: '贵州·贵阳·云岩区',
    status: '在线', price: '¥12.00/时', provider: '星辰算力',
    mlperf: 94.2,
    compliance: { security: 95, stability: 88, efficiency: 92, regulation: 90 },
    tasks: 450, revenue: 5400,
    cpu: 68, gpuLoad: 82, memory: 55, network: 320,
    history: [
      { id: 't1', name: 'LLM 微调任务', duration: '8h 12min', cost: '¥98.40', time: '2026-05-10' },
      { id: 't2', name: '图像识别训练', duration: '3h 45min', cost: '¥45.00', time: '2026-05-09' },
    ],
  },
  'node-2': {
    id: 'node-2', name: 'RTX4090 视觉工作站', gpu: 'RTX 4090×4', region: '广东·深圳·南山区',
    status: '在线', price: '¥8.00/时', provider: '鹏城实验室',
    mlperf: 88.5,
    compliance: { security: 85, stability: 92, efficiency: 78, regulation: 95 },
    tasks: 210, revenue: 1680,
    cpu: 45, gpuLoad: 70, memory: 62, network: 180,
    history: [],
  },
};

const ComplianceBar = ({ data }: { data: any }) => {
  const dims = ['security', 'stability', 'efficiency', 'regulation'];
  const labels: Record<string, string> = { security: '安全', stability: '稳定', efficiency: '效率', regulation: '合规' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {dims.map(dim => (
        <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, width: 40 }}>{labels[dim]}</span>
          <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4 }}>
            <div style={{ width: `${data[dim]}%`, height: '100%', background: data[dim] > 90 ? '#10b981' : data[dim] > 75 ? '#f59e0b' : '#dc2626', borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{data[dim]}</span>
        </div>
      ))}
    </div>
  );
};

export default function NodeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    setNode(NODES_DB[id] || null);
  }, [id]);

  if (!node) return <div style={{ padding: 40, textAlign: 'center' }}>节点不存在</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>{node.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{node.gpu} · {node.region} · 提供者：{node.provider}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MetricCard label="MLPerf 基准分" value={`${node.mlperf}`} color="#6366f1" />
        <MetricCard label="CPU 负载" value={`${node.cpu}%`} color="#3b82f6" />
        <MetricCard label="GPU 负载" value={`${node.gpuLoad}%`} color="#8b5cf6" />
        <MetricCard label="内存占用" value={`${node.memory}%`} color="#10b981" />
        <MetricCard label="网络吞吐" value={`${node.network} Mbps`} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>🛡️ 合规四维评分</h3>
          <ComplianceBar data={node.compliance} />
        </div>
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>⚙️ 调度策略</h3>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>当前模式：</strong>
            <span style={{ padding: '2px 10px', borderRadius: 8, background: '#dbeafe', color: '#1e40af', marginLeft: 8 }}>按需调度</span>
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>支持竞价 / 预留 / 按需三模式</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>沙箱清理时间：10s</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>实时监控：eBPF 采集</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>📋 最近任务</h3>
        {node.history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>暂无已完成任务</p>
        ) : (
          <table style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>任务名称</th>
                <th style={{ padding: '8px' }}>时长</th>
                <th style={{ padding: '8px' }}>费用</th>
                <th style={{ padding: '8px' }}>时间</th>
              </tr>
            </thead>
            <tbody>
              {node.history.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>{t.name}</td>
                  <td style={{ padding: '8px' }}>{t.duration}</td>
                  <td style={{ padding: '8px' }}>{t.cost}</td>
                  <td style={{ padding: '8px' }}>{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button style={{ padding: '12px 32px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
        立即租用
      </button>
    </div>
  );
}

const MetricCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'center' }}>
    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</p>
    <p style={{ fontSize: 24, fontWeight: 'bold', color }}>{value}</p>
  </div>
);