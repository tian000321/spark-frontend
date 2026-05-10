'use client';
import { useState, useEffect } from 'react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [capabilityFilter, setCapabilityFilter] = useState('all'); // 新增能力筛选
  const [page, setPage] = useState(1);
  const perPage = 6;

  const fetchAgents = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (complianceFilter !== 'all') params.set('compliance', complianceFilter);
    if (capabilityFilter !== 'all') params.set('capability', capabilityFilter);
    params.set('page', String(page));
    params.set('limit', String(perPage));
    fetch(`http://localhost:8080/v1/agents?${params}`)
      .then(r => r.json())
     .then(data => { setAgents(data.agents || []); setTotal(data.total || 0); })
      .catch(() => {});
  };

  useEffect(() => { fetchAgents(); }, [search, complianceFilter, capabilityFilter, page]);

  const totalPages = Math.ceil(total / perPage);

  const getScoreStyle = (score: number) => {
    if (score >= 90) return { background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' };
    if (score >= 70) return { background: 'var(--badge-orange-bg)', color: 'var(--badge-orange-text)' };
    return { background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)' };
  };
  const getScoreLabel = (score: number) => score >= 90 ? '高合规' : score >= 70 ? '中合规' : '低合规';

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 20 }}>智能体市场</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍 搜索智能体名称或开发者..." style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <select value={complianceFilter} onChange={(e) => { setComplianceFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部合规等级</option><option value="high">高合规 (≥90)</option><option value="mid">中合规 (70-89)</option><option value="low">低合规 (&lt;70)</option>
        </select>
        <select value={capabilityFilter} onChange={(e) => { setCapabilityFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部能力</option>
          <option value="图像分类">图像分类</option>
          <option value="文本生成">文本生成</option>
          <option value="语音识别">语音识别</option>
          <option value="目标检测">目标检测</option>
          <option value="NLP">NLP</option>
        </select>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>共 {total} 个智能体，第 {page}/{totalPages} 页</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {agents.map((agent: any) => (
          <div key={agent.id} style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>{agent.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</h3>
              </div>
              <span style={{ ...getScoreStyle(agent.score), padding: '3px 10px', borderRadius: 12, fontSize: 12 }}>{getScoreLabel(agent.score)}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{agent.developer}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              <span>📞 调用 {agent.calls?.toLocaleString()} 次</span>
              <span style={{ fontWeight: 500, color: 'var(--btn-primary-bg)' }}>{agent.price}</span>
            </div>
            <a href={`/agents/${agent.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', borderRadius: 8, fontSize: 13, fontWeight: 'bold', textDecoration: 'none' }}>
              查看详情
            </a>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === 1 ? '#f5f5f5' : 'var(--input-bg)', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : 'var(--text-primary)' }}>上一页</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '8px 14px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === i + 1 ? 'var(--btn-primary-bg)' : 'var(--input-bg)', color: page === i + 1 ? 'var(--btn-primary-text)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: page === i + 1 ? 'bold' : 'normal' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === totalPages ? '#f5f5f5' : 'var(--input-bg)', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : 'var(--text-primary)' }}>下一页</button>
        </div>
      )}
    </div>
  );
}