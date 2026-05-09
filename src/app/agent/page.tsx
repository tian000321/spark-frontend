'use client';
import { useState, useEffect } from 'react';

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/v1/agent/customers')
      .then(r => r.json())
      .then(setCustomers)
      .catch(() => {});
    fetch('http://localhost:8080/v1/agent/commissions')
      .then(r => r.json())
      .then(setCommissions)
      .catch(() => {});
  }, []);

  const tabs = [
    { key: 'customers', label: '👥 我的客户' },
    { key: 'commission', label: '💰 佣金明细' },
    { key: 'promotion', label: '📢 推广工具' },
    { key: 'settings', label: '⚙️ 设置' },
  ];

  const totalCommission = customers.reduce((sum, c) => sum + parseFloat(c.commission.replace('¥', '')), 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>代理后台</h1>
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === tab.key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent', color: activeTab === tab.key ? 'var(--btn-primary-bg)' : 'var(--text-muted)', fontWeight: activeTab === tab.key ? 'bold' : 'normal', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'customers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-muted)' }}>共 {customers.length} 个客户</span>
            <span style={{ color: 'var(--text-muted)' }}>累计佣金 ¥{totalCommission.toFixed(2)}</span>
          </div>
          {customers.map((c: any) => (
            <div key={c.id} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.id} · 注册于 {c.joined} · 消费 {c.spent}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: c.status === '活跃' ? 'var(--badge-green-bg)' : 'var(--badge-orange-bg)', color: c.status === '活跃' ? 'var(--badge-green-text)' : 'var(--badge-orange-text)' }}>{c.status}</span>
                  <span style={{ fontWeight: 600, color: 'var(--badge-green-text)' }}>{c.commission}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'commission' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', fontSize: 13 }}>
            <thead><tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}><th style={{ padding: 8 }}>来源</th><th style={{ padding: 8 }}>类型</th><th style={{ padding: 8 }}>佣金</th><th style={{ padding: 8 }}>时间</th></tr></thead>
            <tbody>
              {commissions.map((c, i) => (
                <tr key={i}><td style={{ padding: 8 }}>{c.from}</td><td style={{ padding: 8 }}>{c.type}</td><td style={{ padding: 8, color: 'var(--badge-green-text)' }}>{c.commission}</td><td style={{ padding: 8, fontSize: 12, color: 'var(--text-muted)' }}>{c.time}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'promotion' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: 16 }}>推广链接</h3>
          <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 8, fontFamily: 'monospace', fontSize: 13, marginBottom: 16, wordBreak: 'break-all' }}>https://sparkcompute.com/ref=AGENT-001</div>
          <button style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>📋 复制链接</button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={{ padding: 20, color: 'var(--text-muted)' }}>代理级别：市级代理 · 覆盖区域：贵阳市 · 佣金比例：消费额×10%</div>
      )}
    </div>
  );
}