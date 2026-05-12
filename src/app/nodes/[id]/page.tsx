'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkBadge from '@/components/ui/SparkBadge';

interface NodeDetail {
  id: string;
  name: string;
  gpu: string;
  region: string;
  status: string;
  price: string;
  provider: string;
  mlperf: number;
  compliance: { security: number; stability: number; efficiency: number; regulation: number };
  cpu: number;
  gpuLoad: number;
  memory: number;
  network: number;
  tasks: number;
  history: { id: string; name: string; duration: string; cost: string; time: string }[];
}

const NODES_DB: Record<string, NodeDetail> = {
  'node-1': {
    id: 'node-1', name: 'A100-贵阳超算', gpu: 'A100×8', region: '贵州·贵阳·云岩区',
    status: '在线', price: '¥12.00/时', provider: '星辰算力',
    mlperf: 94.2, compliance: { security: 95, stability: 88, efficiency: 92, regulation: 90 },
    cpu: 68, gpuLoad: 82, memory: 55, network: 320, tasks: 450,
    history: [
      { id: 't1', name: 'LLM 微调任务', duration: '8h 12min', cost: '¥98.40', time: '2026-05-10' },
      { id: 't2', name: '图像识别训练', duration: '3h 45min', cost: '¥45.00', time: '2026-05-09' },
    ],
  },
};

export default function NodeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [node, setNode] = useState<NodeDetail | null>(null);

  useEffect(() => {
    setNode(NODES_DB[id] || null);
  }, [id]);

  if (!node) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--spark-text-secondary)' }}>节点不存在</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>{node.name}</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>{node.gpu} · {node.region} · 提供者：{node.provider}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MetricCard label="MLPerf 基准分" value={String(node.mlperf)} color="#6366f1" />
        <MetricCard label="CPU 负载" value={`${node.cpu}%`} color="#3b82f6" />
        <MetricCard label="GPU 负载" value={`${node.gpuLoad}%`} color="#8b5cf6" />
        <MetricCard label="内存占用" value={`${node.memory}%`} color="#10b981" />
        <MetricCard label="网络吞吐" value={`${node.network} Mbps`} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <SparkCard padding={20}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>🛡️ 合规四维评分</h3>
          {Object.entries(node.compliance).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, width: 40 }}>{key}</span>
              <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                <div style={{ width: `${val}%`, height: '100%', background: val > 90 ? '#10b981' : val > 75 ? '#f59e0b' : '#dc2626', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </SparkCard>
        <SparkCard padding={20}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>⚙️ 调度策略</h3>
          <p style={{ fontSize: 14, marginBottom: 8 }}><strong>当前模式：</strong><span style={{ padding: '2px 10px', borderRadius: 8, background: 'var(--spark-brand-gradient)', color: '#fff', marginLeft: 8 }}>按需调度</span></p>
          <p style={{ fontSize: 12, color: 'var(--spark-text-secondary)' }}>支持竞价 / 预留 / 按需三模式</p>
          <p style={{ fontSize: 12, color: 'var(--spark-text-secondary)' }}>沙箱清理：10s</p>
          <p style={{ fontSize: 12, color: 'var(--spark-text-secondary)' }}>监控：eBPF 实时采集</p>
        </SparkCard>
      </div>

      {node.history.length > 0 && (
        <SparkCard padding={20} style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>📋 最近任务</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                <th style={{ padding: 8 }}>任务</th><th style={{ padding: 8 }}>时长</th><th style={{ padding: 8 }}>费用</th><th style={{ padding: 8 }}>时间</th>
              </tr>
            </thead>
            <tbody>
              {node.history?.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: 8 }}>{t.name}</td>
                  <td style={{ padding: 8 }}>{t.duration}</td>
                  <td style={{ padding: 8 }}>{t.cost}</td>
                  <td style={{ padding: 8 }}>{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SparkCard>
      )}

      <SparkButton variant="primary" size="lg" onClick={() => alert('租用请求已提交')}>立即租用</SparkButton>
    </div>
  );
}

const MetricCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <SparkCard padding={16} style={{ textAlign: 'center' }}>
    <p style={{ fontSize: 12, color: 'var(--spark-text-secondary)' }}>{label}</p>
    <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
  </SparkCard>
);