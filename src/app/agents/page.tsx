'use client';
import { useState, useEffect } from 'react';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkInput from '@/components/ui/SparkInput';
import SparkBadge from '@/components/ui/SparkBadge';

interface Agent {
  id: string;
  name: string;
  developer: string;
  capability: string;
  calls: number;
  price: string;
  score: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('all');

  const fetchAgents = () => {
    const mockData: Agent[] = [
      { id: '1', name: '图像分类专家', developer: 'AI Lab', capability: '图像识别', calls: 5200, price: '¥0.50/次', score: 92 },
      { id: '2', name: '文本情感分析', developer: 'NLP Team', capability: '自然语言处理', calls: 3400, price: '¥0.30/次', score: 85 },
      { id: '3', name: '语音转文字', developer: 'SpeechX', capability: '语音识别', calls: 1200, price: '¥0.80/次', score: 78 },
    ];
    setAgents(mockData);
  };

  useEffect(() => { fetchAgents(); }, []);

  const filtered = agents.filter(a => {
    const matchSearch = !search || a.name.includes(search) || a.developer.includes(search);
    const matchCompliance = complianceFilter === 'all' ||
      (complianceFilter === 'high' && a.score >= 90) ||
      (complianceFilter === 'mid' && a.score >= 70 && a.score < 90) ||
      (complianceFilter === 'low' && a.score < 70);
    return matchSearch && matchCompliance;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🤖 智能体市场</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>浏览开发者发布的AI智能体，按需调用。</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <SparkInput value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索智能体或开发者..." style={{ flex: 1, minWidth: 200 }} />
        <select value={complianceFilter} onChange={e => setComplianceFilter(e.target.value)} style={selectStyle}>
          <option value="all">全部合规等级</option>
          <option value="high">高合规 (≥90)</option>
          <option value="mid">中合规 (70-89)</option>
          <option value="low">低合规 (&lt;70)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {filtered?.map(agent => (
          <SparkCard key={agent.id} padding={20} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 28 }}>🤖</span>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{agent.name}</h3>
              </div>
              <SparkBadge variant={agent.score >= 90 ? 'success' : agent.score >= 70 ? 'warning' : 'danger'}>
                {agent.score}
              </SparkBadge>
            </div>
            <p style={{ fontSize: 12, color: 'var(--spark-text-muted)', marginBottom: 12 }}>{agent.developer}</p>
            <div style={{ fontSize: 13, color: 'var(--spark-text-secondary)', marginBottom: 8 }}>
              {agent.capability}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
              <span>📞 {agent.calls?.toLocaleString()} 次</span>
              <span style={{ fontWeight: 500, color: 'var(--spark-brand-light)' }}>{agent.price}</span>
            </div>
            <SparkButton variant="primary" size="sm" fullWidth onClick={() => alert('调用智能体')}>调用</SparkButton>
          </SparkCard>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--spark-text-muted)', padding: 40 }}>暂无匹配智能体</p>}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: '10px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14,
  background: 'rgba(255,255,255,0.06)', color: '#fff', boxSizing: 'border-box'
};