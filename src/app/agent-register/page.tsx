'use client';
import { useState, useEffect } from 'react';
import { AgentContract } from '@/components/onboarding/ContractText';
import { CONFIG } from '@/config';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkInput from '@/components/ui/SparkInput';
import SparkBadge from '@/components/ui/SparkBadge';

type Status = 'none' | 'pending' | 'approved' | 'signed';

export default function AgentRegisterPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('city');
  const [channel, setChannel] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'customers' | 'revenue' | 'withdraw'>('customers');

  const [customerCount, setCustomerCount] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('agent_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('agent_status', s);
  };

  const submitToBackend = async (role: string, formData: any) => {
    try {
      await fetch(`${CONFIG.API_BASE_URL}/api/applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, role, form_data: formData }),
      });
    } catch (e) {}
  };

  const handleBindAccount = () => {
    const type = (document.getElementById('accountType') as HTMLSelectElement)?.value;
    const aname = (document.getElementById('accountName') as HTMLInputElement)?.value;
    const number = (document.getElementById('accountNumber') as HTMLInputElement)?.value;
    if (!aname || !number) return alert('请填写完整');
    localStorage.setItem('withdraw_account', JSON.stringify({ type, name: aname, number }));
    alert(`${type} 账户绑定成功！`);
  };

  const handleWithdraw = () => {
    const account = localStorage.getItem('withdraw_account');
    if (!account) return alert('请先绑定账户');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('请输入有效金额');
    if (amount > revenueTotal) return alert('余额不足');
    const paymentPwd = localStorage.getItem('payment_password');
    if (!paymentPwd) { alert('请先设置支付密码'); return; }
    const inputPwd = prompt('请输入支付密码：');
    if (inputPwd !== paymentPwd) return alert('支付密码错误');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交');
  };

  // ===== 未申请 =====
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 20 }}>🤝 精英招募 · 代理</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SparkInput value={name} onChange={e => setName(e.target.value)} placeholder="真实姓名 / 企业名称" />
        <SparkInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="联系电话" />
        <select value={level} onChange={e => setLevel(e.target.value)} style={selectStyle}>
          <option value="city">市级代理 (年费 ¥10,000)</option>
          <option value="district">县区代理 (年费 ¥1,000)</option>
        </select>
        <SparkInput value={channel} onChange={e => setChannel(e.target.value)} placeholder="推广渠道 / 预计客户量" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--spark-text-secondary)' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《代理加盟协议》
        </label>
        <SparkButton variant="primary" fullWidth onClick={async () => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('agent_status_name', name);
          localStorage.setItem('agent_status_phone', phone);
          localStorage.setItem('agent_status_detail', level + ' / ' + channel);
          localStorage.setItem('agent_status_time', new Date().toLocaleString());
          await submitToBackend('agent', { name, phone, level, channel });
          updateStatus('pending');
        }}>提交申请</SparkButton>
      </div>
    </div>
  );

  // ===== 审核中 =====
  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2>⏳ 审核中</h2>
      <p style={{ color: 'var(--spark-text-secondary)' }}>平台将在 1-3 个工作日内审核。</p>
      <SparkButton variant="secondary" style={{ marginTop: 20 }} onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }}>模拟审核通过</SparkButton>
    </div>
  );

  // ===== 待签约 =====
  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 700, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 12, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--spark-text-secondary)' }}>{AgentContract}</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--spark-text-secondary)' }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <SparkButton variant="primary" fullWidth onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！'); }}>确认签署</SparkButton>
    </div>
  );

  // ===== 已签约：代理后台 =====
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🤝 代理后台</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24, fontSize: 'var(--spark-font-size-sm)' }}>
        已签约 · {level === 'city' ? '市级代理' : '县区代理'} · 推广客户获得佣金
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {(['customers', 'revenue', 'withdraw'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 24px', border: 'none', background: 'transparent',
            borderBottom: activeTab === tab ? '2px solid var(--spark-brand)' : '2px solid transparent',
            color: activeTab === tab ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)',
            fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', fontSize: 'var(--spark-font-size-md)', marginBottom: -14, transition: 'all 0.2s',
          }}>
            {tab === 'customers' && '👥 客户管理'} {tab === 'revenue' && '💰 收益'} {tab === 'withdraw' && '💳 提现'}
          </button>
        ))}
      </div>

      {activeTab === 'customers' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>已拓展客户</h3>
          <p style={{ color: 'var(--spark-text-secondary)' }}>已拓展客户：{customerCount} 个</p>
        </SparkCard>
      )}

      {activeTab === 'revenue' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>💰 佣金收益</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(108,92,231,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>累计佣金</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--spark-brand-light)' }}>¥{revenueTotal.toFixed(2)}</p>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{customerCount}</p>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>拓展客户</p>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{level === 'city' ? '1%' : '3%'}</p>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>佣金比例</p>
            </div>
          </div>
        </SparkCard>
      )}

      {activeTab === 'withdraw' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>提现账户</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select id="accountType" style={selectStyle}><option value="wechat">微信支付</option><option value="alipay">支付宝</option><option value="bank">银行卡</option></select>
              <input id="accountName" placeholder="户名" style={{ flex: 1, minWidth: 120, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff' }} />
              <input id="accountNumber" placeholder="账号" style={{ flex: 1, minWidth: 120, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff' }} />
              <SparkButton variant="secondary" size="sm" onClick={handleBindAccount}>绑定</SparkButton>
            </div>
          </div>
          <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 16 }}>可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <SparkInput type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="提现金额" style={{ flex: 1 }} />
            <SparkButton variant="primary" onClick={handleWithdraw}>申请提现</SparkButton>
          </div>
        </SparkCard>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff', width: '100%', boxSizing: 'border-box' };