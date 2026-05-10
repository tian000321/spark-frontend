'use client';
import { useState, useEffect } from 'react';

type Status = 'none' | 'pending' | 'approved' | 'signed';

export default function DeveloperRegisterPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [techStack, setTechStack] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'revenue' | 'withdraw'>('agents');

  useEffect(() => {
    const saved = localStorage.getItem('developer_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('developer_status', s);
  };

  // === 未申请 ===
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>💻 开发者入驻申请</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="真实姓名 / 团队名称" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input placeholder="联系电话" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="技术栈 / 研究方向（如 PyTorch / NLP）" value={techStack} onChange={(e) => setTechStack(e.target.value)} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          我已阅读并同意《星火科技开发者服务协议》
        </label>
        <button onClick={() => { if (!name || !phone) return alert('请填写姓名和电话'); if (!agreed) return alert('请同意协议'); updateStatus('pending'); }} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
          提交申请
        </button>
      </div>
    </div>
  );

  // === 审核中 ===
  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的入驻申请已提交，平台将在 1-3 个工作日内审核。</p>
      <button onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }} style={{ marginTop: 20, padding: '8px 20px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>
        模拟审核通过
      </button>
    </div>
  );

  // === 待签约 ===
  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8 }}>
        <p><strong>《星火科技开发者服务协议》</strong></p>
        <ol>
          <li>您保证提交的所有信息真实有效。</li>
          <li>您发布的智能体须符合法律法规，不侵犯第三方权益。</li>
          <li>收益分账比例：开发者 70%，平台 30%。</li>
          <li>平台有权对违规行为进行处理。</li>
          <li>本协议解释权归星火科技所有。</li>
        </ol>
        <p>签署日期：{new Date().toLocaleDateString()}</p>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={(e) => setAgreed(e.target.checked)} />
        我已阅读并同意以上协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通开发者后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // === 已签约：开发者后台 ===
  const [agentName, setAgentName] = useState('');
  const [capability, setCapability] = useState('');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  const handlePublish = () => {
    if (!agentName || !capability) return alert('请填写智能体名称和能力');
    alert('智能体已提交审核！');
    setAgentName('');
    setCapability('');
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('请输入有效金额');
    if (amount > revenueTotal) return alert('余额不足');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [...prev, { amount: withdrawAmount, time: new Date().toLocaleString() }]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>💻 开发者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · 发布智能体，按 API 调用量获得收益。</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)' }}>
        {(['agents', 'revenue', 'withdraw'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 24px', border: 'none', background: 'transparent', borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent', color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)', fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2 }}>
            {tab === 'agents' && '🤖 我的智能体'} {tab === 'revenue' && '💰 收益'} {tab === 'withdraw' && '💳 提现'}
          </button>
        ))}
      </div>

      {activeTab === 'agents' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>发布新智能体</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input placeholder="智能体名称" value={agentName} onChange={e => setAgentName(e.target.value)} style={inputStyle} />
            <input placeholder="能力描述（如 图像分类 / 文本生成）" value={capability} onChange={e => setCapability(e.target.value)} style={inputStyle} />
            <button onClick={handlePublish} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>提交审核</button>
          </div>
        </div>
      )}

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

      {activeTab === 'withdraw' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💳 提现</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>可提现余额：¥{revenueTotal.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleWithdraw} style={{ padding: '10px 24px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>申请提现</button>
          </div>
          <div style={{ fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>提现记录：</p>
            {withdrawHistory.length === 0 && <p style={{ color: 'var(--text-muted)' }}>暂无记录</p>}
            {withdrawHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>¥{item.amount}</span><span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
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