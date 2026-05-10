'use client';
import { useState, useEffect } from 'react';
import { DeveloperContract } from '@/components/onboarding/ContractText';

type Status = 'none' | 'pending' | 'approved' | 'signed';
type AgentStatus = 'reviewing' | 'published' | 'unpublished' | 'rejected';

interface Agent {
  id: string;
  name: string;
  capability: string;
  status: AgentStatus;
  calls: number;
  complianceScore: number;
}

export default function DeveloperRegisterPage() {
  // --- 入驻状态 ---
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [techStack, setTechStack] = useState('');
  const [agreed, setAgreed] = useState(false);

  // --- 已签约后台 ---
  const [activeTab, setActiveTab] = useState<'agents' | 'revenue' | 'withdraw' | 'stats'>('agents');
  const [agentName, setAgentName] = useState('');
  const [capability, setCapability] = useState('');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  // 智能体列表（模拟数据）
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: '图像分类专家', capability: '高精度图像识别与分类', status: 'published', calls: 12500, complianceScore: 92 },
    { id: '2', name: '文本情感分析', capability: '中文文本情感与意图分析', status: 'reviewing', calls: 0, complianceScore: 85 },
    { id: '3', name: '语音转文字', capability: '实时语音识别与转写', status: 'unpublished', calls: 3400, complianceScore: 78 },
  ]);

  // 编辑弹窗
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCapability, setEditCapability] = useState('');

  // 统计数据（模拟）
  const [chartData] = useState([120, 340, 230, 180, 290, 410, 380]); // 近7天

  useEffect(() => {
    const saved = localStorage.getItem('developer_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('developer_status', s);
  };

  const handlePublish = () => {
    if (!agentName || !capability) return alert('请填写智能体名称和能力');
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentName,
      capability,
      status: 'reviewing',
      calls: 0,
      complianceScore: 75, // 默认初始评分
    };
    setAgents(prev => [newAgent, ...prev]);
    setAgentName('');
    setCapability('');
    alert('智能体已提交审核！');
  };

  const handleToggleStatus = (id: string) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        const newStatus: AgentStatus = a.status === 'published' ? 'unpublished' : 'published';
        return { ...a, status: newStatus };
      })
    );
  };

  const handleEdit = (agent: Agent) => {
    setEditingId(agent.id);
    setEditName(agent.name);
    setEditCapability(agent.capability);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    setAgents(prev =>
      prev.map(a =>
        a.id === editingId ? { ...a, name: editName, capability: editCapability } : a
      )
    );
    setEditingId(null);
    alert('智能体信息已更新');
  };

  const handleBindAccount = () => {
    const type = (document.getElementById('accountType') as HTMLSelectElement)?.value;
    const aname = (document.getElementById('accountName') as HTMLInputElement)?.value;
    const number = (document.getElementById('accountNumber') as HTMLInputElement)?.value;
    if (!aname || !number) return alert('请填写完整的账户信息');
    localStorage.setItem('withdraw_account', JSON.stringify({ type, name: aname, number }));
    alert(`${type} 账户绑定成功！`);
  };

  const handleWithdraw = () => {
    const account = localStorage.getItem('withdraw_account');
    if (!account) return alert('请先绑定提现账户');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('请输入有效金额');
    if (amount > revenueTotal) return alert('余额不足');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  // 获取状态标签
  const getStatusTag = (s: AgentStatus) => {
    const map = {
      reviewing: { text: '审核中', color: 'var(--badge-orange-bg)', textColor: 'var(--badge-orange-text)' },
      published: { text: '已上架', color: 'var(--badge-green-bg)', textColor: 'var(--badge-green-text)' },
      unpublished: { text: '已下架', color: 'var(--badge-gray-bg)', textColor: 'var(--badge-gray-text)' },
      rejected: { text: '被驳回', color: 'var(--badge-red-bg)', textColor: 'var(--badge-red-text)' },
    };
    const item = map[s];
    return (
      <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, background: item.color, color: item.textColor }}>
        {item.text}
      </span>
    );
  };

  // 合规评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#16a34a';
    if (score >= 70) return '#ca8a04';
    return '#dc2626';
  };

  // ---------- 未申请 ----------
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>💻 开发者入驻申请</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="真实姓名 / 团队名称" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="联系电话" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="技术栈 / 研究方向" value={techStack} onChange={e => setTechStack(e.target.value)} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《开发者服务协议》
        </label>
        <button onClick={() => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('developer_status_name', name);
          localStorage.setItem('developer_status_phone', phone);
          localStorage.setItem('developer_status_detail', techStack);
          localStorage.setItem('developer_status_time', new Date().toLocaleString());
          updateStatus('pending');
        }} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
          提交申请
        </button>
      </div>
    </div>
  );

  // ---------- 审核中 ----------
  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的入驻申请已提交，平台将在 1-3 个工作日内审核。</p>
      <button onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }} style={{ marginTop: 20, padding: '8px 20px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>
        模拟审核通过
      </button>
    </div>
  );

  // ---------- 待签约 ----------
  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {DeveloperContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通开发者后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // ---------- 已签约：开发者后台 ----------
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>💻 开发者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · 发布智能体，按 API 调用量获得收益。</p>

      {/* 标签页 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)', flexWrap: 'wrap' }}>
        {(['agents', 'revenue', 'withdraw', 'stats'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2
            }}>
            {tab === 'agents' && '🤖 智能体管理'}
            {tab === 'revenue' && '💰 收益'}
            {tab === 'withdraw' && '💳 提现'}
            {tab === 'stats' && '📊 统计'}
          </button>
        ))}
      </div>

      {/* 智能体管理 */}
      {activeTab === 'agents' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>发布新智能体</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <input placeholder="智能体名称" value={agentName} onChange={e => setAgentName(e.target.value)} style={inputStyle} />
            <input placeholder="能力描述" value={capability} onChange={e => setCapability(e.target.value)} style={inputStyle} />
            <button onClick={handlePublish} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
              提交审核
            </button>
          </div>

          <h3 style={{ marginBottom: 16 }}>已发布智能体列表</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>名称</th>
                  <th style={{ padding: '8px' }}>能力</th>
                  <th style={{ padding: '8px' }}>状态</th>
                  <th style={{ padding: '8px' }}>调用量</th>
                  <th style={{ padding: '8px' }}>合规评分</th>
                  <th style={{ padding: '8px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{agent.name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.capability}</td>
                    <td style={{ padding: '8px' }}>{getStatusTag(agent.status)}</td>
                    <td style={{ padding: '8px' }}>{agent.calls.toLocaleString()}</td>
                    <td style={{ padding: '8px', fontWeight: 'bold', color: getScoreColor(agent.complianceScore) }}>{agent.complianceScore}</td>
                    <td style={{ padding: '8px', display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(agent)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>编辑</button>
                      <button onClick={() => handleToggleStatus(agent.id)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>
                        {agent.status === 'published' ? '下架' : '上架'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingId && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, width: '90%', maxWidth: 400 }}>
                <h3 style={{ marginBottom: 16 }}>编辑智能体</h3>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="名称" style={{ ...inputStyle, marginBottom: 10 }} />
                <input value={editCapability} onChange={e => setEditCapability(e.target.value)} placeholder="能力描述" style={{ ...inputStyle, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingId(null)} style={{ padding: '6px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>取消</button>
                  <button onClick={handleSaveEdit} style={{ padding: '6px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>保存</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 收益 */}
      {activeTab === 'revenue' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💰 收益看板</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f0f9ff', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>累计收益</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{revenueTotal.toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>API 调用量</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#16a34a' }}>{apiCalls}</p>
            </div>
            <div style={{ background: '#fefce8', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>分账比例</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#ca8a04' }}>70%</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计 */}
      {activeTab === 'stats' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📊 近7天调用统计</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '20px 0' }}>
            {chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{val}</span>
                <div style={{ width: '100%', maxWidth: 40, height: val * 0.4, background: 'var(--btn-primary-bg)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 提现 */}
      {activeTab === 'withdraw' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>提现账户 (本人实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={{ ...inputStyle, minWidth: 120 }}>
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="bank">银行卡</option>
              </select>
              <input id="accountName" placeholder="户名" style={{ ...inputStyle, flex: 1 }} />
              <input id="accountNumber" placeholder="账号" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleBindAccount} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                绑定 / 更新
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>* 请绑定本人实名账户，提现信息与绑定账户一致方可提现。</p>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleWithdraw} style={{ padding: '10px 24px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              申请提现
            </button>
          </div>
          <div style={{ fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>提现记录</p>
            {withdrawHistory.length === 0 && <p style={{ color: 'var(--text-muted)' }}>暂无记录</p>}
            {withdrawHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>¥{item.amount}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14,
  background: 'var(--input-bg)', color: 'var(--text-primary)', boxSizing: 'border-box'
};