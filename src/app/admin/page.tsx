'use client';
import { useState, useEffect } from 'react';

// ========== 影子部署模拟数据 ==========
const initialShadowDeployments = [
  { id: 'sd-001', service: 'Orca v2.0', startTime: Date.now() - 3600000, totalHours: 72, status: 'observing', autoRollback: false },
  { id: 'sd-002', service: 'Gears 调度算法', startTime: Date.now() - 250000000, totalHours: 72, status: 'approved', autoRollback: false },
  { id: 'sd-003', service: 'Sentinel 安全模块', startTime: Date.now() - 30000, totalHours: 72, status: 'observing', autoRollback: false },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  // ========== 用户数据 ==========
  const [users, setUsers] = useState([
    { id: 'user-001', name: '田景华', role: '平台管理员', email: 'tian@sparkcompute.com', status: '活跃', created: '2026-05-01' },
    { id: 'user-002', name: '张三', role: '算力提供者', email: 'zhang@node.com', status: '活跃', created: '2026-05-02' },
    { id: 'user-003', name: '李四', role: '智能体开发者', email: 'li@agent.com', status: '待认证', created: '2026-05-03' },
    { id: 'user-004', name: '王五', role: '代理', email: 'wang@agent.com', status: '已冻结', created: '2026-05-04' },
  ]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', role: '', email: '' });

  // ========== 影子部署（真实倒计时） ==========
  const [shadowDeployments, setShadowDeployments] = useState(initialShadowDeployments);
  const [now, setNow] = useState(Date.now());

  // 每秒更新当前时间，驱动进度条
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 自动检查：观察期满 → 待批准；发现异常 → 自动回滚
  useEffect(() => {
    setShadowDeployments(prev =>
      prev.map(sd => {
        if (sd.status !== 'observing') return sd;

        const elapsedHours = (now - sd.startTime) / 3600000; // 实际已过小时数
        const remaining = Math.max(0, sd.totalHours - elapsedHours);

        // 观察期满，自动变为待批准
        if (remaining <= 0) {
          return { ...sd, status: 'pending_approval' };
        }

        // 模拟异常检测（10% 概率触发，但每个部署只检测一次）
        if (Math.random() < 0.001 && !sd.autoRollback) {
          return { ...sd, status: 'rollback', autoRollback: true };
        }

        return sd;
      })
    );
  }, [now]);

  // 获取进度百分比
  const getProgress = (sd: any) => {
    const elapsedHours = (now - sd.startTime) / 3600000;
    if (sd.status === 'approved') return 100;
    if (sd.status === 'rollback') return Math.min(100, (elapsedHours / sd.totalHours) * 100);
    return Math.min(99, (elapsedHours / sd.totalHours) * 100);
  };

  // 获取剩余时间
  const getRemaining = (sd: any) => {
    const elapsedHours = (now - sd.startTime) / 3600000;
    return Math.max(0, sd.totalHours - elapsedHours);
  };

  // 获取状态显示
  const getStatusDisplay = (sd: any) => {
    switch (sd.status) {
      case 'observing': return { text: `观察中 (${getRemaining(sd).toFixed(0)}h)`, color: 'var(--badge-orange-text)', bg: 'var(--badge-orange-bg)' };
      case 'pending_approval': return { text: '待批准', color: 'var(--badge-blue-text)', bg: 'var(--badge-blue-bg)' };
      case 'approved': return { text: '已批准上线', color: 'var(--badge-green-text)', bg: 'var(--badge-green-bg)' };
      case 'rollback': return { text: '已自动回滚', color: 'var(--badge-red-text)', bg: 'var(--badge-red-bg)' };
      default: return { text: sd.status, color: '#666', bg: '#f5f5f5' };
    }
  };

  // 手动批准
  const approveShadow = (id: string) => {
    setShadowDeployments(prev =>
      prev.map(sd => sd.id === id ? { ...sd, status: 'approved' } : sd)
    );
    alert('✅ 已批准上线，全量发布中...');
  };

  // 手动回滚
  const rollbackShadow = (id: string) => {
    setShadowDeployments(prev =>
      prev.map(sd => sd.id === id ? { ...sd, status: 'rollback' } : sd)
    );
    alert('⏪ 已回滚至上一稳定版本');
  };

  // ========== 伦理表决 ==========
  const [votes, setVotes] = useState<any[]>([]);
  const [currentVoter, setCurrentVoter] = useState('委员A');
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const committeeMembers = ['委员A', '委员B', '委员C', '委员D', '委员E'];

  useEffect(() => {
    fetch('http://localhost:8080/v1/ethics/votes')
      .then(res => res.json())
      .then(data => {
        setVotes(data);
        const voted: Record<string, boolean> = {};
        data.forEach((vote: any) => {
          if (vote.votes && vote.votes[currentVoter]) voted[vote.id] = true;
        });
        setHasVoted(voted);
      })
      .catch(() => setVotes([]));
  }, [currentVoter]);

  const handleVote = (voteId: string, choice: string) => {
    fetch('http://localhost:8080/v1/ethics/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteId, voter: currentVoter, choice }),
    })
      .then(r => r.json())
      .then(() => {
        setHasVoted(prev => ({ ...prev, [voteId]: true }));
        fetch('http://localhost:8080/v1/ethics/votes')
          .then(res => res.json())
          .then(data => setVotes(data));
      });
  };

  const getVoteResult = (vote: any) => {
    const results: Record<string, number> = { '赞成': 0, '反对': 0, '弃权': 0 };
    Object.values(vote.votes).forEach((v: any) => {
      if (results[v] !== undefined) results[v]++;
    });
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    if (total >= committeeMembers.length) {
      return results['赞成'] > committeeMembers.length / 2 ? '✅ 通过' : '❌ 未通过';
    }
    return `⏳ 投票中 (${total}/${committeeMembers.length})`;
  };

  // ========== 开发者管理 ==========
  const [developers, setDevelopers] = useState<any[]>([]);

  // ========== 标签页 ==========
  const tabs = [
    { key: 'users', label: '👥 用户管理' },
    { key: 'developers', label: '👩‍💻 开发者管理' },
    { key: 'ethics', label: '⚖️ 伦理表决' },
    { key: 'shadow', label: '🕵️ 影子审批' },
    { key: 'config', label: '⚙️ 系统配置' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)',
    borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)',
    boxSizing: 'border-box',
  };

  const tabBtnStyle = (key: string) => ({
    padding: '10px 20px', border: 'none', background: 'none',
    borderBottom: activeTab === key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: activeTab === key ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: (activeTab === key ? 'bold' : 'normal') as any, fontSize: 14,
    cursor: 'pointer', whiteSpace: 'nowrap',
  });

  const getStatusColor = (status: string) => {
    if (status === '活跃' || status === '已通过') return { bg: 'var(--badge-green-bg)', text: 'var(--badge-green-text)' };
    if (status === '待认证' || status === '审核中') return { bg: 'var(--badge-orange-bg)', text: 'var(--badge-orange-text)' };
    return { bg: 'var(--badge-red-bg)', text: 'var(--badge-red-text)' };
  };

  // ========== 用户操作 ==========
  const openUserEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role, email: user.email });
  };

  const saveUserEdit = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...editForm } : u)));
    setEditingUser(null);
  };

  const toggleFreeze = (user: any) => {
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: u.status === '已冻结' ? '活跃' : '已冻结' } : u))
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>🔐 管理后台</h1>

      {/* 标签页导航 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabBtnStyle(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== 用户管理 ========== */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>共 {users.length} 个用户</span>
            <button style={{ padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>+ 添加用户</button>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>用户ID</th>
                  <th style={{ padding: 10 }}>姓名</th>
                  <th style={{ padding: 10 }}>角色</th>
                  <th style={{ padding: 10 }}>邮箱</th>
                  <th style={{ padding: 10 }}>状态</th>
                  <th style={{ padding: 10 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10, fontFamily: 'monospace', fontSize: 12 }}>{user.id}</td>
                    <td style={{ padding: 10 }}>{user.name}</td>
                    <td style={{ padding: 10 }}>{user.role}</td>
                    <td style={{ padding: 10 }}>{user.email}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: getStatusColor(user.status).bg, color: getStatusColor(user.status).text }}>{user.status}</span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => openUserEdit(user)} style={{ marginRight: 8, color: 'var(--badge-blue-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>编辑</button>
                      <button onClick={() => toggleFreeze(user)} style={{ color: user.status === '已冻结' ? 'var(--badge-green-text)' : 'var(--badge-red-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                        {user.status === '已冻结' ? '解冻' : '冻结'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingUser && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 450 }}>
                <h3 style={{ marginBottom: 16 }}>编辑用户</h3>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
                <input value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ ...inputStyle, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingUser(null)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)' }}>取消</button>
                  <button onClick={saveUserEdit} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6 }}>保存</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== 伦理表决 ========== */}
      {activeTab === 'ethics' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>当前投票人：</span>
              <select value={currentVoter} onChange={e => setCurrentVoter(e.target.value)} style={{ padding: '6px 12px', border: '1px solid var(--input-border)', borderRadius: 6, fontSize: 13, background: 'var(--input-bg)' }}>
                {committeeMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button style={{ padding: '6px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>+ 发起新表决</button>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>编号</th>
                  <th style={{ padding: 10 }}>议题</th>
                  <th style={{ padding: 10 }}>投票</th>
                  <th style={{ padding: 10 }}>当前票数</th>
                  <th style={{ padding: 10 }}>结果</th>
                  <th style={{ padding: 10 }}>存证哈希</th>
                </tr>
              </thead>
              <tbody>
                {votes.map(vote => (
                  <tr key={vote.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10, fontFamily: 'monospace', fontSize: 12 }}>{vote.id}</td>
                    <td style={{ padding: 10 }}>{vote.topic}</td>
                    <td style={{ padding: 10 }}>
                      {vote.status === '进行中' && !hasVoted[vote.id] ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => handleVote(vote.id, '赞成')} style={{ padding: '4px 8px', background: 'var(--badge-green-bg)', border: '1px solid var(--badge-green-text)', borderRadius: 4, cursor: 'pointer' }}>👍</button>
                          <button onClick={() => handleVote(vote.id, '反对')} style={{ padding: '4px 8px', background: 'var(--badge-red-bg)', border: '1px solid var(--badge-red-text)', borderRadius: 4, cursor: 'pointer' }}>👎</button>
                          <button onClick={() => handleVote(vote.id, '弃权')} style={{ padding: '4px 8px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 4, cursor: 'pointer' }}>⏸️</button>
                        </div>
                      ) : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hasVoted[vote.id] ? '✅ 已投票' : '投票已结束'}</span>}
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: 'var(--badge-green-text)' }}>👍 {Object.values(vote.votes).filter((v: any) => v === '赞成').length}</span>{' '}
                      <span style={{ color: 'var(--badge-red-text)' }}>👎 {Object.values(vote.votes).filter((v: any) => v === '反对').length}</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>⏸️ {Object.values(vote.votes).filter((v: any) => v === '弃权').length}</span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: getVoteResult(vote).includes('通过') ? 'var(--badge-green-bg)' : 'var(--badge-orange-bg)', color: getVoteResult(vote).includes('通过') ? 'var(--badge-green-text)' : 'var(--badge-orange-text)' }}>
                        {getVoteResult(vote)}
                      </span>
                    </td>
                    <td style={{ padding: 10, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                      {vote.chain_hash ? vote.chain_hash.slice(0, 10) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== 影子审批（真实倒计时） ========== */}
      {activeTab === 'shadow' && (
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 13 }}>
            新版本必须先经过 72 小时观察期，系统自动流转状态。发现异常自动回滚。
          </p>

          {shadowDeployments.map(sd => {
            const progress = getProgress(sd);
            const status = getStatusDisplay(sd);
            const remaining = getRemaining(sd);

            return (
              <div key={sd.id} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sd.service}</span>
                    <span style={{ marginLeft: 12, padding: '3px 10px', borderRadius: 10, fontSize: 11, background: status.bg, color: status.color }}>
                      {status.text}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {sd.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => approveShadow(sd.id)}
                          style={{ padding: '4px 10px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                        >
                          批准上线
                        </button>
                        <button
                          onClick={() => rollbackShadow(sd.id)}
                          style={{ padding: '4px 10px', background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                        >
                          回滚
                        </button>
                      </>
                    )}
                    {sd.status === 'observing' && (
                      <button
                        onClick={() => rollbackShadow(sd.id)}
                        style={{ padding: '4px 10px', background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                      >
                        强制回滚
                      </button>
                    )}
                    {sd.status === 'rollback' && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>已回滚</span>
                    )}
                    {sd.status === 'approved' && (
                      <span style={{ fontSize: 11, color: 'var(--badge-green-text)' }}>✅ 已上线</span>
                    )}
                  </div>
                </div>

                {/* 进度条 */}
                <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 6 }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: sd.status === 'rollback' ? '#D32F2F' : sd.status === 'approved' ? '#2E7D32' : '#F57C00',
                    borderRadius: 4,
                    transition: 'width 1s linear',
                  }} />
                </div>

                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  开始时间：{new Date(sd.startTime).toLocaleString()} · 已过 {Math.min(72, ((now - sd.startTime) / 3600000)).toFixed(0)} 小时
                  {progress < 100 && ` · 剩余约 ${remaining.toFixed(0)} 小时`}
                  {sd.autoRollback && ' · ⚠️ 检测到异常，已自动回滚'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== 系统配置 ========== */}
      {activeTab === 'config' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>平台配置</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>• 公平性阈值：10% (EU AI Act)</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 差分隐私 ε：≤ 1.0</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 沙箱清理时间：10s</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 影子观察期：72h</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>• 伦理委员会经费：平台服务费 3%</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>这些参数修改需伦理委员会全票通过。</p>
        </div>
      )}
    </div>
  );
}