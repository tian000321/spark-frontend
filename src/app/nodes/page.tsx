'use client';
import { useState, useEffect } from 'react';
import { ProviderContract } from '@/components/onboarding/ContractText';
import { CONFIG } from '@/config';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkInput from '@/components/ui/SparkInput';

type Status = 'none' | 'pending' | 'approved' | 'signed';

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  boxSizing: 'border-box',
};

export default function ProviderPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gpuType, setGpuType] = useState('');
  const [location, setLocation] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'nodes' | 'revenue' | 'withdraw'>('nodes');
  const [nodeCount, setNodeCount] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('provider_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => { setStatus(s); localStorage.setItem('provider_status', s); };

  const submitToBackend = async (role: string, formData: any) => {
    try { await fetch(`${CONFIG.API_BASE_URL}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 1, role, form_data: formData }) }); } catch {}
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
    const bankAccount = localStorage.getItem('withdraw_account');
    if (!bankAccount) return alert('请先绑定提现账户');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('请输入有效金额');
    if (amount > revenueTotal) return alert('余额不足');
    const paymentPwd = localStorage.getItem('payment_password');
    if (!paymentPwd) { alert('请先在钱包页面设置支付密码'); return; }
    const inputPwd = prompt('请输入支付密码以确认提现：');
    if (inputPwd !== paymentPwd) return alert('支付密码错误，提现失败');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🖥️ 精英招募 · 节点提供者</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>接入GPU算力节点，平台自动调度，首年95%分账。</p>
      <SparkCard padding={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SparkInput value={name} onChange={e => setName(e.target.value)} placeholder="真实姓名 / 企业名称" />
          <SparkInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="联系电话" />
          <SparkInput value={gpuType} onChange={e => setGpuType(e.target.value)} placeholder="GPU 型号 / 数量" />
          <select value={location} onChange={e => setLocation(e.target.value)} style={selectStyle}>
            <option value="">选择所在地区</option>
            <option value="广东·深圳·南山区">广东·深圳·南山区</option>
            <option value="北京·海淀区">北京·海淀区</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--spark-text-secondary)' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            我已阅读并同意《算力提供者服务协议》
          </label>
          <SparkButton variant="primary" fullWidth onClick={async () => {
            if (!name || !phone) return alert('请填写姓名和电话');
            if (!agreed) return alert('请同意协议');
            localStorage.setItem('provider_status_name', name);
            localStorage.setItem('provider_status_phone', phone);
            localStorage.setItem('provider_status_detail', gpuType + ' / ' + location);
            localStorage.setItem('provider_status_time', new Date().toLocaleString());
            await submitToBackend('provider', { name, phone, gpuType, location });
            updateStatus('pending');
          }}>提交申请</SparkButton>
        </div>
      </SparkCard>
    </div>
  );

  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--spark-text-secondary)' }}>平台将在 1-3 个工作日内审核。</p>
      <SparkButton variant="secondary" style={{ marginTop: 20 }} onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }}>模拟审核通过</SparkButton>
    </div>
  );

  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 12, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{ProviderContract}</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} /> 我已阅读并同意以上完整协议
      </label>
      <SparkButton variant="primary" fullWidth disabled={!agreed} onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！'); }}>确认签署</SparkButton>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🖥️ 节点提供者平台</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>已签约 · 管理你的算力节点。</p>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {(['nodes', 'revenue', 'withdraw'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 24px', border: 'none', background: 'transparent',
            borderBottom: activeTab === tab ? '2px solid var(--spark-brand)' : '2px solid transparent',
            color: activeTab === tab ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)',
            fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', marginBottom: -14
          }}>{tab === 'nodes' ? '🖥️ 节点' : tab === 'revenue' ? '💰 收益' : '💳 提现'}</button>
        ))}
      </div>

      {activeTab === 'nodes' && (
        <SparkCard padding={24}><h3 style={{ fontWeight: 600, marginBottom: 16 }}>我的算力节点</h3><p style={{ color: 'var(--spark-text-secondary)' }}>在线节点：{nodeCount} 个 | 完成任务：{taskCount} 个</p></SparkCard>
      )}

      {activeTab === 'revenue' && (
        <SparkCard padding={24}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>💰 收益看板</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16 }}>
            <StatCard label="累计收益" value={`¥${revenueTotal.toFixed(2)}`} />
            <StatCard label="完成任务" value={String(taskCount)} color="#10b981" />
            <StatCard label="分账比例" value="95%" color="#f59e0b" />
          </div>
        </SparkCard>
      )}

      {activeTab === 'withdraw' && (
        <SparkCard padding={24}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>提现账户 (企业实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={selectStyle}>
                <option value="bank">银行卡（对公）</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信支付</option>
              </select>
              <SparkInput id="accountName" placeholder="户名" style={{ flex: 1 }} />
              <SparkInput id="accountNumber" placeholder="账号" style={{ flex: 1 }} />
              <SparkButton size="sm" onClick={handleBindAccount}>绑定 / 更新</SparkButton>
            </div>
          </div>
          <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 16 }}>可提现余额：<strong style={{ color: 'var(--spark-text-primary)' }}>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <SparkInput value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="提现金额" style={{ flex: 1 }} />
            <SparkButton variant="primary" onClick={handleWithdraw}>申请提现</SparkButton>
          </div>
          <p style={{ fontWeight: 500, marginBottom: 8, fontSize: 13 }}>提现记录</p>
          {withdrawHistory.length === 0 && <p style={{ color: 'var(--spark-text-muted)', fontSize: 13 }}>暂无记录</p>}
          {withdrawHistory.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
              <span>¥{item.amount}</span><span style={{ color: 'var(--spark-text-muted)' }}>{item.time}</span>
            </div>
          ))}
        </SparkCard>
      )}
    </div>
  );
}

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 12, textAlign: 'center' }}>
    <p style={{ color: 'var(--spark-text-muted)', fontSize: 13 }}>{label}</p>
    <p style={{ fontSize: 28, fontWeight: 700, color: color || 'var(--spark-brand-light)' }}>{value}</p>
  </div>
);
