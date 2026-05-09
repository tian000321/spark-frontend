'use client';
import { useState, useEffect } from 'react';

export default function DeveloperRegisterPage() {
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [activeTab, setActiveTab] = useState('agents');
  const [myAgents, setMyAgents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [commissions, setCommissions] = useState({ total: '0.00', monthly: '0.00' });
  const [newAgent, setNewAgent] = useState({ name: '', description: '', price: '', category: '', capability: '' });

  // 检查是否已成为开发者
  useEffect(() => {
    fetch('http://localhost:8080/v1/developer/status')
      .then(r => r.json())
      .then(data => setIsDeveloper(data?.isDeveloper ?? false))
      .catch(() => {});

    fetch('http://localhost:8080/v1/revenue/summary')
      .then(r => r.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => {});
  }, []);

  // 成为开发者后加载数据
  useEffect(() => {
    if (isDeveloper) {
      fetch('http://localhost:8080/v1/developers/agents')
        .then(r => r.json()).then(setMyAgents).catch(() => setMyAgents([]));
      fetch('http://localhost:8080/v1/developers/commissions')
        .then(r => r.json())
        .then(data => setCommissions(data))
        .catch(() => setCommissions({ total: '0.00', monthly: '0.00' }));
    }
  }, [isDeveloper]);

  // 提交入驻申请
  const handleRegister = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = {};
    formData.forEach((v, k) => (data[k] = v));

    fetch('http://localhost:8080/v1/developer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(r => r.json())
      .then(() => {
        setIsDeveloper(true);
        alert('🎉 开发者入驻申请已提交！审核通过后即可发布智能体。');
      })
      .catch(() => alert('提交失败，请重试'));
  };

  // 发布新智能体
  const submitAgent = () => {
    if (!newAgent.name || !newAgent.price) { alert('请填写智能体名称和单价'); return; }
    fetch('http://localhost:8080/v1/developers/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgent),
    })
      .then(r => r.json())
      .then((agent) => {
        setMyAgents(prev => [...prev, agent]);
        setNewAgent({ name: '', description: '', price: '', category: '', capability: '' });
        alert('智能体提交成功，待合规审核');
      })
      .catch(() => alert('提交失败'));
  };

  // 提现
  const handleWithdraw = async () => {
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    if (val > balance) { alert('余额不足'); return; }
    try {
      await fetch('http://localhost:8080/v1/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      });
      const res = await fetch('http://localhost:8080/v1/revenue/summary');
      const data = await res.json();
      setBalance(data.balance || 0);
      setWithdrawAmount('');
      alert('提现申请已提交');
    } catch (e) { alert('提现失败'); }
  };

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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
    fontSize: 14,
    color: 'var(--text-primary)',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    border: 'none',
    background: 'none',
    borderBottom: active ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: active ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: active ? 'bold' : 'normal',
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    padding: 20,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
  };

  // ========== 未成为开发者：只显示申请表单 ==========
  if (!isDeveloper) {
    return (
      <div style={{ maxWidth: 650, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>
          👩‍💻 开发者入驻
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
          成为星火智能体开发者，将您的 AI 模型接入平台，享受 70% 分成收益。
        </p>

        <form onSubmit={handleRegister} style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: 20, textAlign: 'center', color: 'var(--text-primary)' }}>📝 开发者入驻申请表</h3>

          {/* 公司/个人名称 */}
          <label style={labelStyle}>公司/个人名称 *</label>
          <input name="name" required placeholder="请输入公司或个人名称" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 联系人 */}
          <label style={labelStyle}>联系人姓名 *</label>
          <input name="contact" required placeholder="请输入联系人" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 联系电话 */}
          <label style={labelStyle}>联系电话 *</label>
          <input name="phone" type="tel" required placeholder="请输入手机号" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 邮箱 */}
          <label style={labelStyle}>电子邮箱 *</label>
          <input name="email" type="email" required placeholder="请输入邮箱" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 技术栈方向 */}
          <label style={labelStyle}>主要技术方向 *</label>
          <select name="stack" required style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="">请选择技术方向</option>
            <option>自然语言处理（NLP）</option>
            <option>计算机视觉（CV）</option>
            <option>语音识别/合成</option>
            <option>推荐系统</option>
            <option>强化学习</option>
            <option>多模态</option>
            <option>图像生成</option>
            <option>时间序列预测</option>
            <option>知识图谱</option>
            <option>其他</option>
          </select>

          {/* 模型框架 */}
          <label style={labelStyle}>常用模型框架</label>
          <input name="framework" placeholder="例如：PyTorch, TensorFlow, JAX, PaddlePaddle" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 开发经验 */}
          <label style={labelStyle}>AI 开发经验（年）</label>
          <input name="experience" type="number" placeholder="例如：3" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 已有模型简介 */}
          <label style={labelStyle}>已有模型/算法简介 *</label>
          <textarea name="description" rows={3} required placeholder="请简要描述您已有的模型或算法" style={{ ...inputStyle, marginBottom: 16, resize: 'vertical' }} />

          {/* API 服务经验 */}
          <label style={labelStyle}>是否有 API 服务开发经验</label>
          <select name="apiExperience" style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="">请选择</option>
            <option>有，已上线的 API 服务</option>
            <option>有，但未上线</option>
            <option>无，正在学习</option>
          </select>

          {/* 期望发布的智能体数量 */}
          <label style={labelStyle}>预计发布智能体数量</label>
          <input name="expectedCount" type="number" placeholder="例如：3" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 期望单价范围 */}
          <label style={labelStyle}>期望单价范围</label>
          <select name="priceRange" style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="">请选择</option>
            <option>¥0.01 - ¥0.10 / 次</option>
            <option>¥0.10 - ¥0.50 / 次</option>
            <option>¥0.50 - ¥2.00 / 次</option>
            <option>¥2.00 以上 / 次</option>
          </select>

          {/* GitHub/作品链接 */}
          <label style={labelStyle}>GitHub / 作品链接</label>
          <input name="portfolio" placeholder="https://github.com/yourname" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 备注 */}
          <label style={labelStyle}>备注</label>
          <textarea name="remark" rows={2} placeholder="其他需要说明的信息" style={{ ...inputStyle, marginBottom: 24, resize: 'vertical' }} />

          <button type="submit" style={{ width: '100%', padding: 14, background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
            提交申请
          </button>

          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 开发者收益 70% · 合规认证 · 动态评级 · 全球分发
          </p>
        </form>
      </div>
    );
  }

  // ========== 已成为开发者：智能体管理 + 收益 + 提现 ==========
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>
        👩‍💻 开发者后台
      </h1>

      {/* 标签页 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('agents')} style={tabStyle(activeTab === 'agents')}>🤖 我的智能体</button>
        <button onClick={() => setActiveTab('revenue')} style={tabStyle(activeTab === 'revenue')}>💰 收益与提现</button>
      </div>

      {/* 智能体管理 */}
      {activeTab === 'agents' && (
        <div>
          {/* 发布新智能体 */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>发布新智能体</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="智能体名称 *" value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} style={inputStyle} />
              <select value={newAgent.category} onChange={e => setNewAgent({ ...newAgent, category: e.target.value })} style={inputStyle}>
                <option value="">选择分类</option>
                <option>训练</option><option>推理</option><option>数据处理</option>
              </select>
              <input placeholder="能力标签（如：图像分类）" value={newAgent.capability} onChange={e => setNewAgent({ ...newAgent, capability: e.target.value })} style={inputStyle} />
              <input placeholder="单价 (例：¥0.50/次)" value={newAgent.price} onChange={e => setNewAgent({ ...newAgent, price: e.target.value })} style={inputStyle} />
            </div>
            <textarea placeholder="智能体描述" value={newAgent.description} onChange={e => setNewAgent({ ...newAgent, description: e.target.value })} rows={2} style={{ ...inputStyle, marginTop: 12, resize: 'vertical' }} />
            <button onClick={submitAgent} style={{ marginTop: 12, padding: '10px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              提交审核
            </button>
          </div>

          {/* 智能体列表 */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>智能体名称</th>
                  <th style={{ padding: 10 }}>分类</th>
                  <th style={{ padding: 10 }}>状态</th>
                  <th style={{ padding: 10 }}>调用次数</th>
                  <th style={{ padding: 10 }}>单价</th>
                </tr>
              </thead>
              <tbody>
                {myAgents.map((agent: any) => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10, fontWeight: 500 }}>{agent.name}</td>
                    <td style={{ padding: 10 }}>{agent.category || '—'}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: agent.status === '已认证' ? 'var(--badge-green-bg)' : 'var(--badge-orange-bg)', color: agent.status === '已认证' ? 'var(--badge-green-text)' : 'var(--badge-orange-text)' }}>
                        {agent.status || '审核中'}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>{agent.calls || 0}</td>
                    <td style={{ padding: 10 }}>{agent.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myAgents.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>暂无智能体，请发布新智能体</p>}
          </div>
        </div>
      )}

      {/* 收益与提现 */}
      {activeTab === 'revenue' && (
        <div>
          {/* 收益卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>累计佣金</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--badge-green-text)' }}>¥{commissions.total}</p>
            </div>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>本月佣金</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{commissions.monthly}</p>
            </div>
          </div>

          {/* 提现 */}
          <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>💸 提现</h3>
            <p style={{ marginBottom: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              可用余额：<strong style={{ color: 'var(--text-primary)' }}>¥{balance.toFixed(2)}</strong>
            </p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="请输入提现金额"
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            <button
              onClick={handleWithdraw}
              style={{ padding: '10px 24px', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}
            >
              确认提现
            </button>
          </div>
        </div>
      )}
    </div>
  );
}