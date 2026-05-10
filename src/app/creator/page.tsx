'use client';
import { useState, useEffect } from 'react';
import { CreatorContract } from '@/components/onboarding/ContractText';

type Status = 'none' | 'pending' | 'approved' | 'signed';

export default function CreatorPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [style, setStyle] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'sandbox' | 'revenue' | 'withdraw'>('upload');

  useEffect(() => {
    const saved = localStorage.getItem('creator_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('creator_status', s);
  };

  // ... (申请表单和审核状态逻辑保持不变) ...

  // === 待签约 ===
  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {CreatorContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={(e) => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通创作者后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // === 已签约：创作者后台 ===
  const [packageName, setPackageName] = useState('');
  const [styleTag, setStyleTag] = useState('');
  // ... (其他状态) ...
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  const handleBindAccount = () => {
    const type = (document.getElementById('accountType') as HTMLSelectElement)?.value;
    const name = (document.getElementById('accountName') as HTMLInputElement)?.value;
    const number = (document.getElementById('accountNumber') as HTMLInputElement)?.value;
    if (!name || !number) return alert('请填写完整的账户信息');
    localStorage.setItem('withdraw_account', JSON.stringify({ type, name, number }));
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

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>🎨 创作者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · 上传氛围包，审核通过后进入市场。</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)' }}>
        {(['upload', 'sandbox', 'revenue', 'withdraw'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '10px 24px', border: 'none', background: 'transparent', borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent', color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)', fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2 }}>
            {tab === 'upload' && '📤 上传'} {tab === 'sandbox' && '🧪 沙箱'} {tab === 'revenue' && '💰 收益'} {tab === 'withdraw' && '💳 提现'}
          </button>
        ))}
      </div>

      {activeTab === 'upload' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          {/* ... 上传表单逻辑不变 ... */}
        </div>
      )}
      {activeTab === 'sandbox' && ( /* ... */ )}
      {activeTab === 'revenue' && ( /* ... */ )}

      {/* === 提现标签（包含绑定账户） === */}
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
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              * 请绑定本人实名账户，提现信息与绑定账户一致方可提现。
            </p>
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong>
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
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