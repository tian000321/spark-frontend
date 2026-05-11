'use client';
import { useState, useEffect } from 'react';
import { CreatorContract } from '@/components/onboarding/ContractText';
import { CONFIG } from '@/config';

type Status = 'none' | 'pending' | 'approved' | 'signed';

export default function CreatorPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [style, setStyle] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'sandbox' | 'revenue' | 'withdraw'>('upload');

  const [packageName, setPackageName] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [bpmRange, setBpmRange] = useState('60-80');
  const [licenseType, setLicenseType] = useState('exclusive');
  const [uploadStatus, setUploadStatus] = useState('');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [plays, setPlays] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  useEffect(() => {
    // 优先从 localStorage 读取状态（后续统一改为后端接口）
    const saved = localStorage.getItem('creator_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('creator_status', s);
  };

  // 提交申请到后端（失败时降级到 localStorage）
  const submitToBackend = async (role: string, formData: any) => {
    try {
      await fetch(`${CONFIG.API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, role, form_data: formData }),
      });
    } catch (e) {
      console.log('后端未启动，降级到 localStorage');
    }
  };

  const handleUpload = () => {
    if (!packageName || !styleTag) { setUploadStatus('请填写名称和风格标签'); return; }
    setUploadStatus('上传中...');
    setTimeout(() => { setUploadStatus('上传成功！已进入沙箱审核'); setPackageName(''); setStyleTag(''); }, 1500);
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
    const paymentPwd = localStorage.getItem('payment_password');
    if (!paymentPwd) { alert('请先在钱包页面设置支付密码'); return; }
    const inputPwd = prompt('请输入支付密码以确认提现：');
    if (inputPwd !== paymentPwd) return alert('支付密码错误，提现失败');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  // ===== 入驻状态路由 =====
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>🎨 精英招募 · 创作者</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="真实姓名 / 艺名" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="联系电话" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="擅长风格（如 Techno/Jazz）" value={style} onChange={e => setStyle(e.target.value)} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《平台原创内容协议》
        </label>
        <button onClick={async () => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          // 保存到 localStorage
          localStorage.setItem('creator_status_name', name);
          localStorage.setItem('creator_status_phone', phone);
          localStorage.setItem('creator_status_detail', style);
          localStorage.setItem('creator_status_time', new Date().toLocaleString());
          // 提交到后端
          await submitToBackend('creator', { name, phone, style });
          updateStatus('pending');
        }} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
          提交申请
        </button>
      </div>
    </div>
  );

  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的入驻申请已提交，平台将在 1-3 个工作日内审核。</p>
      <button onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }} style={{ marginTop: 20, padding: '8px 20px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>
        模拟审核通过
      </button>
    </div>
  );

  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {CreatorContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通创作者后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // ===== 已签约：创作者后台 =====
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input placeholder="氛围包名称" value={packageName} onChange={e => setPackageName(e.target.value)} style={inputStyle} />
            <input placeholder="风格标签" value={styleTag} onChange={e => setStyleTag(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: 16 }}>
              <select value={bpmRange} onChange={e => setBpmRange(e.target.value)} style={inputStyle}>
                <option value="60-80">60-80 暖场</option><option value="120-140">120-140 高潮</option><option value="70-90">70-90 Chill</option>
              </select>
              <select value={licenseType} onChange={e => setLicenseType(e.target.value)} style={inputStyle}>
                <option value="exclusive">独家授权</option><option value="non-exclusive">非独家</option><option value="cc">CC</option>
              </select>
            </div>
            <div style={{ border: '2px dashed var(--border-color)', padding: 32, borderRadius: 8, textAlign: 'center', color: 'var(--text-muted)' }}>📁 拖拽文件到此处 或 点击选择（.vibe JSON + 音频）</div>
            <button onClick={handleUpload} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>提交审核</button>
            {uploadStatus && <p style={{ fontSize: 13, color: uploadStatus.includes('成功') ? 'green' : 'var(--text-secondary)' }}>{uploadStatus}</p>}
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3>🧪 沙箱模拟器</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>模拟氛围包运行效果，M2 开放。</p>
          <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>BPM 连续性 ✓</span>
          <span style={{ marginLeft: 8, padding: '6px 14px', borderRadius: 20, fontSize: 12, background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>风格一致性 ✓</span>
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
              <p style={{ color: 'var(--text-muted)' }}>调用次数</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#16a34a' }}>{plays}</p>
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
          <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>提现账户 (本人实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={{ ...inputStyle, minWidth: 120 }}>
                <option value="wechat">微信支付</option><option value="alipay">支付宝</option><option value="bank">银行卡</option>
              </select>
              <input id="accountName" placeholder="户名" style={{ ...inputStyle, flex: 1 }} />
              <input id="accountNumber" placeholder="账号" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleBindAccount} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>绑定 / 更新</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>* 请绑定本人实名账户，提现信息与绑定账户一致方可提现。</p>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleWithdraw} style={{ padding: '10px 24px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>申请提现</button>
          </div>
          <div style={{ fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>提现记录</p>
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