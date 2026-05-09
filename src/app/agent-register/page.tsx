'use client';
import { useState, useEffect } from 'react';

export default function AgentRegisterPage() {
  const [isAgent, setIsAgent] = useState(false);
  const [activeTab, setActiveTab] = useState('city');
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  // 模拟各代理类型收益数据
  const [cityData, setCityData] = useState({ nodes: 15, revenue: 45600, commission: 456 });
  const [countyData, setCountyData] = useState({ nodes: 8, revenue: 28500, rate: 3.0, commission: 855 });
  const [intelliData, setIntelliData] = useState({ agents: 3, calls: 156000, spent: 78000, commission: 1560 });

  useEffect(() => {
    fetch('http://localhost:8080/v1/agent/status')
      .then(r => r.json())
      .then(data => setIsAgent(data?.isAgent ?? false))
      .catch(() => {});

    fetch('http://localhost:8080/v1/revenue/summary')
      .then(r => r.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => {});
  }, []);

  // 缴费开通代理
  const handlePayAndRegister = () => {
    fetch('http://localhost:8080/v1/agent/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: selectedType }),
    })
      .then(r => r.json())
      .then(() => {
        setIsAgent(true);
        setShowPayModal(false);
        alert(`🎉 ${selectedType} 代理开通成功！年费已从钱包扣除。`);
      })
      .catch(() => alert('开通失败，请确保钱包余额充足'));
  };

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

  // ========== 未成为代理：申请表单 + 费用说明 ==========
  if (!isAgent) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>
          🤝 代理加盟
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
          成为星火区域代理，推广算力服务，享受持续分润。
        </p>

        {/* 费用说明表 */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, textAlign: 'center', color: 'var(--text-primary)' }}>📋 代理类型与费用</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>代理类型</th>
                  <th style={{ padding: 10 }}>年费</th>
                  <th style={{ padding: 10 }}>收益规则</th>
                  <th style={{ padding: 10 }}>区域限制</th>
                  <th style={{ padding: 10 }}>合约条款</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 10, fontWeight: 500 }}>🏙️ 市级代理</td>
                  <td style={{ padding: 10 }}>¥10,000/年</td>
                  <td style={{ padding: 10 }}>辖区内节点收入 <strong>1%</strong>（固定）</td>
                  <td style={{ padding: 10 }}>限定城市</td>
                  <td style={{ padding: 10, fontSize: 11 }}>
                    到期自动收回<br />解约无补偿<br />先缴费后开通
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 10, fontWeight: 500 }}>🏘️ 县区代理</td>
                  <td style={{ padding: 10 }}>¥1,000/年</td>
                  <td style={{ padding: 10 }}>辖区内节点收入 <strong>弹性3%</strong></td>
                  <td style={{ padding: 10 }}>限定县区</td>
                  <td style={{ padding: 10, fontSize: 11 }}>
                    到期自动收回<br />解约无补偿<br />先缴费后开通
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: 10, fontWeight: 500 }}>🤖 智能体代理</td>
                  <td style={{ padding: 10 }}>¥1,000/智能体/年</td>
                  <td style={{ padding: 10 }}>调度算力量 <strong>2%</strong> 计费</td>
                  <td style={{ padding: 10 }}>不限区域</td>
                  <td style={{ padding: 10, fontSize: 11 }}>
                    到期自动收回<br />解约无补偿<br />先缴费后开通
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16, padding: 12, background: 'var(--badge-orange-bg)', borderRadius: 8, fontSize: 13, color: 'var(--badge-orange-text)', textAlign: 'center' }}>
            ⚠️ 重要提示：代理费需先充值到钱包，开通时自动扣除。合约期满系统自动收回代理权，解约无任何补偿。
          </p>
        </div>

        {/* 申请表单 */}
        <form onSubmit={(e) => { e.preventDefault(); }} style={{ ...cardStyle }}>
          <h3 style={{ marginBottom: 20, textAlign: 'center', color: 'var(--text-primary)' }}>📝 代理加盟申请表</h3>

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

          {/* 申请代理类型 */}
          <label style={labelStyle}>申请代理类型 *</label>
          <select name="agentType" required style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="">请选择代理类型</option>
            <option>市级代理 (¥10,000/年)</option>
            <option>县区代理 (¥1,000/年)</option>
            <option>智能体代理 (¥1,000/智能体/年)</option>
          </select>

          {/* 申请代理区域 */}
          <label style={labelStyle}>申请代理区域 *</label>
          <input name="region" required placeholder="例如：贵阳市 / 南明区 / 不限（智能体代理）" style={{ ...inputStyle, marginBottom: 16 }} />

          {/* 已有客户资源描述 */}
          <label style={labelStyle}>已有客户资源/推广渠道</label>
          <textarea name="resources" rows={2} placeholder="请描述您现有的客户资源或推广渠道" style={{ ...inputStyle, marginBottom: 16, resize: 'vertical' }} />

          {/* 备注 */}
          <label style={labelStyle}>备注</label>
          <textarea name="remark" rows={2} placeholder="其他需要说明的信息" style={{ ...inputStyle, marginBottom: 24, resize: 'vertical' }} />

          <button
            type="button"
            onClick={() => {
              const form = document.querySelector('form') as HTMLFormElement;
              if (!form.checkValidity()) { form.reportValidity(); return; }
              const select = form.querySelector('select[name="agentType"]') as HTMLSelectElement;
              setSelectedType(select.value);
              setShowPayModal(true);
            }}
            style={{ width: '100%', padding: 14, background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}
          >
            提交申请并缴纳年费
          </button>

          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 合规运营 · 收益透明 · 到期自动收回 · 解约无补偿
          </p>
        </form>

        {/* 缴费确认弹窗 */}
        {showPayModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>💰 确认缴费</h3>
              <p style={{ marginBottom: 8, fontSize: 14 }}>代理类型：<strong>{selectedType}</strong></p>
              <p style={{ marginBottom: 8, fontSize: 14 }}>
                年费：
                <strong style={{ color: 'var(--badge-red-text)' }}>
                  ¥{selectedType.includes('市级') ? '10,000' : selectedType.includes('智能体') ? '1,000/个' : '1,000'}
                </strong>
              </p>
              <p style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                当前钱包余额：¥{balance.toFixed(2)}
              </p>
              {balance < (selectedType.includes('市级') ? 10000 : 1000) && (
                <p style={{ marginBottom: 12, padding: 8, background: 'var(--badge-red-bg)', borderRadius: 6, color: 'var(--badge-red-text)', fontSize: 12 }}>
                  ⚠️ 余额不足，请先到钱包充值
                </p>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPayModal(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}>取消</button>
                <button
                  onClick={handlePayAndRegister}
                  disabled={balance < (selectedType.includes('市级') ? 10000 : 1000)}
                  style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: balance < (selectedType.includes('市级') ? 10000 : 1000) ? 0.5 : 1 }}
                >
                  确认缴费并开通
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== 已成为代理：看板 + 收益 + 提现 ==========
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>
        🤝 代理后台
      </h1>

      {/* 标签页 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('city')} style={tabStyle(activeTab === 'city')}>🏙️ 市级代理</button>
        <button onClick={() => setActiveTab('county')} style={tabStyle(activeTab === 'county')}>🏘️ 县区代理</button>
        <button onClick={() => setActiveTab('intelli')} style={tabStyle(activeTab === 'intelli')}>🤖 智能体代理</button>
        <button onClick={() => setActiveTab('revenue')} style={tabStyle(activeTab === 'revenue')}>💰 收益与提现</button>
      </div>

      {/* 市级代理看板 */}
      {activeTab === 'city' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>辖区节点</p><p style={{ fontSize: 28, fontWeight: 'bold' }}>{cityData.nodes}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>节点总收入</p><p style={{ fontSize: 24, fontWeight: 'bold' }}>¥{cityData.revenue.toLocaleString()}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>佣金率</p><p style={{ fontSize: 28, fontWeight: 'bold', color: '#2E7D32' }}>1%</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>本月佣金</p><p style={{ fontSize: 24, fontWeight: 'bold', color: '#F57C00' }}>¥{cityData.commission.toFixed(2)}</p></div>
          </div>
        </div>
      )}

      {/* 县区代理看板 */}
      {activeTab === 'county' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>节点数</p><p style={{ fontSize: 28, fontWeight: 'bold' }}>{countyData.nodes}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>节点收入</p><p style={{ fontSize: 24, fontWeight: 'bold' }}>¥{countyData.revenue.toLocaleString()}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>当前费率</p><p style={{ fontSize: 28, fontWeight: 'bold', color: '#F57C00' }}>{countyData.rate.toFixed(1)}%</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>佣金</p><p style={{ fontSize: 24, fontWeight: 'bold', color: '#F57C00' }}>¥{countyData.commission.toFixed(2)}</p></div>
          </div>
        </div>
      )}

      {/* 智能体代理看板 */}
      {activeTab === 'intelli' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>代理智能体</p><p style={{ fontSize: 28, fontWeight: 'bold' }}>{intelliData.agents}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>调用次数</p><p style={{ fontSize: 24, fontWeight: 'bold' }}>{intelliData.calls.toLocaleString()}</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>费率</p><p style={{ fontSize: 28, fontWeight: 'bold', color: '#2E7D32' }}>2%</p></div>
            <div style={{ ...cardStyle, textAlign: 'center' }}><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>佣金</p><p style={{ fontSize: 24, fontWeight: 'bold', color: '#F57C00' }}>¥{intelliData.commission.toFixed(2)}</p></div>
          </div>
        </div>
      )}

      {/* 收益与提现 */}
      {activeTab === 'revenue' && (
        <div style={{ ...cardStyle }}>
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
      )}
    </div>
  );
}