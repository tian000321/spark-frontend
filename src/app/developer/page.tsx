'use client';
import { useState, useEffect } from 'react';

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState('agents');
  const [myAgents, setMyAgents] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any>({ total: '0.00', monthly: '0.00', details: [] });
  const [systemRules, setSystemRules] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    fetch('http://localhost:8080/v1/developers/agents')
      .then(r => r.json())
      .then(setMyAgents)
      .catch(() => {});
    fetch('http://localhost:8080/v1/developers/commissions')
      .then(r => r.json())
      .then(setCommissions)
      .catch(() => {});
  }, []);

  const submitAgent = () => {
    fetch('http://localhost:8080/v1/developers/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgent),
    })
      .then(r => r.json())
      .then((agent) => {
        setMyAgents(prev => [...prev, agent]);
        setNewAgent({ name: '', description: '', price: '' });
        alert('智能体提交成功，待合规审核');
      })
      .catch(() => alert('提交失败'));
  };

  const fetchRules = () => {
    fetch('http://localhost:8080/v1/system/rules')
      .then(r => r.json())
      .then(setSystemRules)
      .catch(() => {});
  };

  const tabs = [
    { key: 'agents', label: '🤖 我的智能体' },
    { key: 'revenue', label: '💰 佣金看板' },
    { key: 'api', label: '🔑 API 密钥' },
    { key: 'rules', label: '📋 系统规则' },
    { key: 'settings', label: '⚙️ 设置' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--input-border)',
    borderRadius: 8,
    fontSize: 14,
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
  };

  const tabBtnStyle = (key: string) => ({
    padding: '10px 20px', border: 'none', background: 'none',
    borderBottom: activeTab === key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: activeTab === key ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: activeTab === key ? 'bold' : 'normal' as any, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap'
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>开发者后台</h1>

      {/* 标签页 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabBtnStyle(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 我的智能体 */}
      {activeTab === 'agents' && (
        <div>
          <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 20 }}>
            <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>发布新智能体</h3>
            <input placeholder="智能体名称" value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
            <input placeholder="描述" value={newAgent.description} onChange={e => setNewAgent({ ...newAgent, description: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
            <input placeholder="单价 (例: ¥0.50/次)" value={newAgent.price} onChange={e => setNewAgent({ ...newAgent, price: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }} />
            <button onClick={submitAgent} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>提交审核</button>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>智能体名称</th>
                  <th style={{ padding: 10 }}>状态</th>
                  <th style={{ padding: 10 }}>调用次数</th>
                  <th style={{ padding: 10 }}>单价</th>
                  <th style={{ padding: 10 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {myAgents.map((agent: any) => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10 }}>{agent.name}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: agent.status === '已认证' ? 'var(--badge-green-bg)' : 'var(--badge-orange-bg)', color: agent.status === '已认证' ? 'var(--badge-green-text)' : 'var(--badge-orange-text)' }}>
                        {agent.status || '审核中'}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>{agent.calls || 0}</td>
                    <td style={{ padding: 10 }}>{agent.price}</td>
                    <td style={{ padding: 10 }}>
                      <button style={{ color: 'var(--badge-blue-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>编辑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 佣金看板 */}
      {activeTab === 'revenue' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>累计佣金</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--badge-green-text)' }}>¥{commissions.total}</p>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>本月佣金</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{commissions.monthly}</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto', marginBottom: 20 }}>
            <table style={{ width: '100%', minWidth: 400, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>智能体ID</th>
                  <th style={{ padding: 10 }}>调用次数</th>
                  <th style={{ padding: 10 }}>佣金合计</th>
                  <th style={{ padding: 10 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {commissions.details?.map((item: any) => (
                  <tr key={item.agentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10 }}>{item.agentId}</td>
                    <td style={{ padding: 10 }}>{item.count}</td>
                    <td style={{ padding: 10, fontWeight: 500, color: 'var(--badge-green-text)' }}>¥{item.total.toFixed(2)}</td>
                    <td style={{ padding: 10 }}>
                      <button style={{ color: 'var(--badge-blue-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>查看明细</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API 密钥 */}
      {activeTab === 'api' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>API 密钥</p>
          <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 8, fontFamily: 'monospace', fontSize: 13, marginTop: 8 }}>sk-dev-xxxxx...xxxx</div>
          <button style={{ marginTop: 12, padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>重新生成</button>
        </div>
      )}

      {/* 系统规则 */}
      {activeTab === 'rules' && (
        <div>
          <button onClick={fetchRules} style={{ marginBottom: 16, padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>加载最新规则</button>
          {systemRules ? (
            <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>开发者分成规则</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 分成比例：{systemRules.developer.share}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 平台服务费：{systemRules.developer.platformFee}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 代理佣金：{systemRules.developer.proxyCommission}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 结算周期：{systemRules.developer.settlementCycle}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 最低提现：{systemRules.developer.minimumWithdraw}</p>
              <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)' }} />
              <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>算力提供者规则</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 分成：{systemRules.provider.share}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 结算：{systemRules.provider.settlement}</p>
              <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)' }} />
              <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>代理规则</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 级别：{systemRules.agent.levels.join(' / ')}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 佣金比例：{systemRules.agent.commissionRate}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 约束：{systemRules.agent.constraint}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>点击上方按钮加载系统规则</p>
          )}
        </div>
      )}

      {/* 设置 */}
      {activeTab === 'settings' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)' }}>开发者信息设置（待完善）</p>
        </div>
      )}
    </div>
  );
}