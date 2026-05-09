'use client';
import { useState, useEffect } from 'react';

export default function NodeMarketPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [gpuFilter, setGpuFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const fetchNodes = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (gpuFilter !== 'all') params.set('gpu', gpuFilter);
    if (regionFilter !== 'all') params.set('region', regionFilter);
    params.set('page', String(page));
    params.set('limit', String(perPage));
    fetch(`http://localhost:8080/v1/marketplace/nodes?${params}`)
      .then(r => r.json())
      .then(data => { setNodes(data.nodes); setTotal(data.total); })
      .catch(() => {});
  };

  useEffect(() => { fetchNodes(); }, [search, gpuFilter, regionFilter, page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 20 }}>🖥️ 节点市场</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
        浏览平台上所有可租用的算力节点，筛选并直接下单租用。
      </p>

      {/* 搜索和筛选 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍 搜索节点ID或位置..." style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <select value={gpuFilter} onChange={(e) => { setGpuFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部 GPU</option>
          <option value="A100">NVIDIA A100</option>
          <option value="RTX 4090">NVIDIA RTX 4090</option>
          <option value="昇腾 910B">昇腾 910B</option>
        </select>
        <select value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部地区</option>
          <option value="贵州">贵州</option>
          <option value="北京">北京</option>
          <option value="上海">上海</option>
          <option value="深圳">深圳</option>
          <option value="成都">成都</option>
        </select>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>共 {total} 个节点，第 {page}/{totalPages} 页</p>

      {/* 节点卡片列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {nodes.map((node: any) => (
          <div key={node.id} style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{node.id}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{node.gpu} · {node.location}</p>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: node.status === '在线' ? 'var(--badge-green-bg)' : 'var(--badge-red-bg)', color: node.status === '在线' ? 'var(--badge-green-text)' : 'var(--badge-red-text)' }}>
                {node.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
              <span>评级：{node.rating}</span>
              <span>利用率：{node.utilization || '65%'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>单价：{node.price || '¥12.00/时'}</span>
              <span style={{ fontWeight: 500, color: 'var(--btn-primary-bg)' }}>已完成 {node.tasks} 个任务</span>
            </div>
            <button style={{ width: '100%', marginTop: 12, padding: '10px 0', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}>
              立即租用
            </button>
          </div>
        ))}
      </div>

      {nodes.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>暂无可用节点</p>}

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