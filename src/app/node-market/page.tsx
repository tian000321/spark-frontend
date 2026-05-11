'use client';
import { useState } from 'react';
import Link from 'next/link';

interface MarketNode {
  id: string; name: string; gpu: string; region: string; status: string;
  temperature: number; network: string; idleMemory: string; price: string;
  tasks: number; provider: string; rating: string; mlperf: number;
}

const REGIONS = ['全部地区', '贵州·贵阳·云岩区', '广东·深圳·南山区', '四川·成都·高新区', '北京·海淀区'];
const MOCK_NODES: MarketNode[] = [
  { id: 'node-1', name: 'A100-贵阳超算', gpu: 'A100×8', region: '贵州·贵阳·云岩区', status: '在线', temperature: 64, network: '10Gbps', idleMemory: '120GB/640GB', price: '¥12.00/时', tasks: 450, provider: '星辰算力', rating: 'S', mlperf: 94.2 },
  { id: 'node-2', name: 'RTX4090 工作站', gpu: 'RTX 4090×4', region: '广东·深圳·南山区', status: '在线', temperature: 58, network: '1000Mbps', idleMemory: '32GB/96GB', price: '¥8.00/时', tasks: 210, provider: '鹏城实验室', rating: 'A', mlperf: 88.5 },
  { id: 'node-3', name: '昇腾910B 集群', gpu: '昇腾910B×16', region: '北京·海淀区', status: '在线', temperature: 70, network: '10Gbps', idleMemory: '256GB/1TB', price: '¥15.00/时', tasks: 1020, provider: '智算中心', rating: 'S', mlperf: 96.8 },
];

const ratingColors: Record<string, string> = { S: '#10b981', A: '#3b82f6', B: '#f59e0b', C: '#dc2626' };

export default function NodeMarketPage() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('全部地区');
  const [gpuFilter, setGpuFilter] = useState('all');

  const filteredNodes = MOCK_NODES.filter(node => {
    if (regionFilter !== '全部地区' && node.region !== regionFilter) return false;
    if (gpuFilter !== 'all' && !node.gpu.includes(gpuFilter)) return false;
    if (search && !node.name.includes(search) && !node.provider.includes(search)) return false;
    return true;
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>🖥️ 算力节点市场</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>全球异构算力调度网络 · 首年0平台抽佣</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索节点或提供者..." style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={gpuFilter} onChange={e => setGpuFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部 GPU</option>
          <option value="A100">A100</option>
          <option value="RTX 4090">RTX 4090</option>
          <option value="昇腾910B">昇腾910B</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filteredNodes.map(node => (
          <div key={node.id} style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{node.name}</h3>
                <p style={{ fontSize: 14 }}>{node.gpu}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, background: node.status === '在线' ? '#d1fae5' : '#f3f4f6', color: node.status === '在线' ? '#065f46' : '#6b7280' }}>
                  {node.status}
                </span>
                <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, background: ratingColors[node.rating], color: '#fff', fontWeight: 'bold' }}>
                  {node.rating}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>📍 {node.region}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>MLPerf: {node.mlperf}分 · 🌡️ {node.temperature}℃ · 网络 {node.network}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>💾 空闲 {node.idleMemory}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontWeight: 500, color: 'var(--btn-primary-bg)', fontSize: 16 }}>{node.price}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{node.tasks} 个任务</span>
            </div>
            <Link href={`/nodes/${node.id}`} style={{ display: 'block', width: '100%', marginTop: 12, padding: '10px 0', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
              查看详情
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}