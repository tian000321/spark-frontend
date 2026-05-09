'use client';
import { useState, useEffect } from 'react';

export default function ProviderPage() {
  const [activeTab, setActiveTab] = useState('nodes');
  const [nodes, setNodes] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/v1/provider/nodes')
      .then(r => r.json())
      .then(data => setNodes(data))
      .catch(() => {});
    fetch('http://localhost:8080/v1/provider/revenue')
      .then(r => r.json())
      .then(data => setTotalRevenue(data.totalRevenue))
      .catch(() => {});
  }, []);

  const tabs = [
    { key: 'nodes', label: '🖥️ 我的节点' },
    { key: 'revenue', label: '💰 收益' },
    { key: 'tasks', label: '📋 任务历史' },
    { key: 'settings', label: '⚙️ 设置' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>算力提供者后台</h1>
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === tab.key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent', color: activeTab === tab.key ? 'var(--btn-primary-bg)' : 'var(--text-muted)', fontWeight: activeTab === tab.key ? 'bold' : 'normal', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'nodes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>共 {nodes.length} 个节点</span>
            <a href="/nodes" style={{ color: 'var(--btn-primary-bg)', fontSize: 13 }}>+ 添加节点</a>
          </div>
          {nodes.map((node: any) => (
            <div key={node.id} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{node.id} · {node.gpu}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>评级 {node.rating} · 完成 {node.tasks} 个任务 · 在线率 {node.uptime}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: node.status === '在线' ? 'var(--badge-green-bg)' : 'var(--badge-red-bg)', color: node.status === '在线' ? 'var(--badge-green-text)' : 'var(--badge-red-text)' }}>{node.status}</span>
                  <span style={{ fontWeight: 600 }}>{node.revenue}</span>
                  <button style={{ padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}><a href={`/provider/nodes/${node.id}`} style={{ padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>详情</a></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'revenue' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)' }}>累计收益</p>
          <p style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>{totalRevenue}</p>
        </div>
      )}

      {activeTab === 'tasks' && <div style={{ padding: 20, color: 'var(--text-muted)' }}>任务历史将在此展示</div>}
      {activeTab === 'settings' && <div style={{ padding: 20, color: 'var(--text-muted)' }}>节点上下线、维护模式设置</div>}
    </div>
  );
}