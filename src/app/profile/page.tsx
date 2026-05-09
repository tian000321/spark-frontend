'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('account');
  const [consents, setConsents] = useState([
    { id: 1, region: 'EU-West', purpose: '训练', date: '2026-05-03', active: true },
    { id: 2, region: 'US-East', purpose: '推理', date: '2026-05-04', active: true },
  ]);

  const revoke = (id: number) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, active: false } : c));
  };

  const tabs = [
    { key: 'account', label: '账户信息' },
    { key: 'api', label: 'API 密钥' },
    { key: 'consent', label: '隐私授权' },
    { key: 'data', label: '数据管理' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>个人中心</h1>
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === tab.key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent', color: activeTab === tab.key ? 'var(--btn-primary-bg)' : 'var(--text-muted)', fontWeight: activeTab === tab.key ? 'bold' : 'normal', fontSize: 14, cursor: 'pointer', marginBottom: -2, whiteSpace: 'nowrap' }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
        {activeTab === 'account' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>基本信息</h2>
            <p style={{ color: 'var(--text-primary)' }}><strong>姓名：</strong>田景华</p>
            <p style={{ color: 'var(--text-primary)' }}><strong>邮箱：</strong>tian@sparkcompute.com</p>
            <p style={{ color: 'var(--text-primary)' }}><strong>DID：</strong>did:spark:0x1234...abcd</p>
            <p style={{ color: 'var(--text-primary)' }}><strong>辖区：</strong>中国大陆</p>
            <p style={{ color: 'var(--text-primary)' }}><strong>注册时间：</strong>2026-05-01</p>
          </div>
        )}
        {activeTab === 'api' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>API 密钥管理</h2>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, marginBottom: 12 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-primary)' }}>sk-xxxx...xxxx</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>创建于 2026-05-01 · 最后使用 2小时前</p>
            </div>
            <button style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>生成新密钥</button>
          </div>
        )}
        {activeTab === 'consent' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>数据出境授权</h2>
            {consents.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.region} · {c.purpose}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>授权于 {c.date}</p>
                </div>
                {c.active ? (
                  <button onClick={() => revoke(c.id)} style={{ color: 'var(--badge-red-text)', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>撤回授权</button>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>已撤回</span>
                )}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'data' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--badge-red-text)', marginBottom: 16 }}>数据删除</h2><button
  onClick={() => {
    fetch('http://localhost:8080/v1/erasure/status')
      .then(r => r.json())
      .then(data => {
        if (data.length === 0) { alert('暂无删除请求'); return; }
        const text = data.map((d: any) => `${d.erasure_id}: ${d.status}`).join('\n');
        alert('删除请求状态：\n' + text);
      });
  }}
  style={{ marginTop: 12, padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--input-border)', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
>
  查看删除请求状态
</button>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>根据 GDPR / 个保法，您可以请求删除个人数据。此操作不可逆。</p>
            <button style={{ padding: '10px 20px', background: 'var(--badge-red-text)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>{activeTab === 'data' && (
  <div>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--badge-red-text)', marginBottom: 16 }}>数据删除（被遗忘权）</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>根据 GDPR / 个保法，您可以请求删除个人数据。此操作不可逆，数据将在 30 天内彻底删除。</p>
    <button
      onClick={() => {
        if (confirm('确定要删除您的所有数据吗？此操作不可逆。')) {
          fetch('http://localhost:8080/v1/user/data/task-all', { method: 'DELETE' })
            .then(r => r.json())
            .then(data => alert(`删除请求已提交\n删除ID：${data.deletionId}\n状态：${data.status}`))
            .catch(() => alert('删除请求失败，请稍后重试'));
        }
      }}
      style={{ padding: '10px 20px', background: 'var(--badge-red-text)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', marginBottom: 16 }}
    >
      请求删除我的所有数据
    </button>
    <button style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }} onClick={() => alert('将于下个版本支持按任务ID删除')}>
      按任务ID删除
    </button>
  </div>
)}</button>
          </div>
        )}
      </div>
    </div>
  );
}