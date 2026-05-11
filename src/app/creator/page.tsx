'use client';
import { useState, useEffect } from 'react';
import { CreatorContract } from '@/components/onboarding/ContractText';
import { CONFIG } from '@/config';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkInput from '@/components/ui/SparkInput';
import SparkBadge from '@/components/ui/SparkBadge';

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
    const saved = localStorage.getItem('creator_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('creator_status', s);
  };

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
    setTimeout(() => {
      setUploadStatus('上传成功！已进入沙箱审核');
      setPackageName('');
      setStyleTag('');
    }, 1500);
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
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 20 }}>🎨 精英招募 · 创作者</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SparkInput value={name} onChange={e => setName(e.target.value)} placeholder="真实姓名 / 艺名" />
        <SparkInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="联系电话" />
        <SparkInput value={style} onChange={e => setStyle(e.target.value)} placeholder="擅长风格（如 Techno/Jazz）" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--spark-text-secondary)' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《平台原创内容协议》
        </label>
        <SparkButton variant="primary" fullWidth onClick={async () => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('creator_status_name', name);
          localStorage.setItem('creator_status_phone', phone);
          localStorage.setItem('creator_status_detail', style);
          localStorage.setItem('creator_status_time', new Date().toLocaleString());
          await submitToBackend('creator', { name, phone, style });
          updateStatus('pending');
        }}>
          提交申请
        </SparkButton>
      </div>
    </div>
  );

  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 700, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--spark-text-secondary)' }}>您的入驻申请已提交，平台将在 1-3 个工作日内审核。</p>
      <SparkButton variant="secondary" style={{ marginTop: 20 }} onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }}>
        模拟审核通过
      </SparkButton>
    </div>
  );

  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 700, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 12, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--spark-text-secondary)' }}>
        {CreatorContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--spark-text-secondary)' }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <SparkButton variant="primary" fullWidth onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通创作者后台。'); }}>
        确认签署
      </SparkButton>
    </div>
  );

  // ===== 已签约：创作者后台 =====
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🎨 创作者平台</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24, fontSize: 'var(--spark-font-size-sm)' }}>
        已签约 · 上传氛围包，审核通过后进入市场。分账比例：<strong style={{ color: 'var(--spark-brand-light)' }}>70%</strong>（前10个包100%）
      </p>

      {/* 选项卡 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {(['upload', 'sandbox', 'revenue', 'withdraw'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--spark-brand)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              fontSize: 'var(--spark-font-size-md)',
              marginBottom: -14,
              transition: 'all 0.2s',
            }}
          >
            {tab === 'upload' && '📤 上传氛围包'}
            {tab === 'sandbox' && '🧪 沙箱模拟器'}
            {tab === 'revenue' && '💰 收益看板'}
            {tab === 'withdraw' && '💳 提现'}
          </button>
        ))}
      </div>

      {/* 上传氛围包 */}
      {activeTab === 'upload' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 20, fontSize: 'var(--spark-font-size-xl)' }}>📤 上传新氛围包</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', marginBottom: 6, display: 'block' }}>氛围包名称</label>
              <SparkInput value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="例如：午夜高潮-暗夜专属" />
            </div>
            <div>
              <label style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', marginBottom: 6, display: 'block' }}>风格标签</label>
              <SparkInput value={styleTag} onChange={e => setStyleTag(e.target.value)} placeholder="例如：Techno / House / 暗黑" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', marginBottom: 6, display: 'block' }}>BPM 范围</label>
                <select value={bpmRange} onChange={e => setBpmRange(e.target.value)} style={selectStyle}>
                  <option value="60-80">60-80 暖场</option>
                  <option value="120-140">120-140 高潮</option>
                  <option value="70-90">70-90 Chill</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', marginBottom: 6, display: 'block' }}>授权类型</label>
                <select value={licenseType} onChange={e => setLicenseType(e.target.value)} style={selectStyle}>
                  <option value="exclusive">独家授权</option>
                  <option value="non-exclusive">非独家授权</option>
                  <option value="cc">知识共享 (CC)</option>
                </select>
              </div>
            </div>

            {/* 上传区域 */}
            <div style={{
              border: '2px dashed rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: 40,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--spark-brand-light)'; e.currentTarget.style.background = 'rgba(108,92,231,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              <p style={{ fontWeight: 500, color: 'var(--spark-text-secondary)' }}>拖拽文件到此处 或 点击选择</p>
              <p style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)', marginTop: 4 }}>
                支持 .vibe JSON 和音频文件（MP3 / WAV / FLAC）
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SparkButton variant="primary" onClick={handleUpload}>
                提交审核
              </SparkButton>
              {uploadStatus && (
                <span style={{ fontSize: 'var(--spark-font-size-sm)', color: uploadStatus.includes('成功') ? 'var(--spark-success)' : 'var(--spark-text-secondary)' }}>
                  {uploadStatus}
                </span>
              )}
            </div>
          </div>
        </SparkCard>
      )}

      {/* 沙箱模拟器 */}
      {activeTab === 'sandbox' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: 'var(--spark-font-size-xl)' }}>🧪 沙箱模拟器</h3>
          <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 20, fontSize: 'var(--spark-font-size-sm)' }}>
            模拟氛围包在真实场所的运行效果，测试通过后才能提交审核。
          </p>
          <div style={{ padding: 24, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, textAlign: 'center', marginBottom: 16 }}>
            <p style={{ color: 'var(--spark-text-muted)', fontSize: 'var(--spark-font-size-sm)' }}>
              🎵 沙箱模拟器将在 M2 与后端集成后开放
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <SparkBadge variant="success">BPM 连续性 ✓</SparkBadge>
            <SparkBadge variant="success">风格一致性 ✓</SparkBadge>
            <SparkBadge variant="warning">红线检测待集成</SparkBadge>
          </div>
        </SparkCard>
      )}

      {/* 收益看板 */}
      {activeTab === 'revenue' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 20, fontSize: 'var(--spark-font-size-xl)' }}>💰 收益看板</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(108,92,231,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 8 }}>累计收益</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--spark-brand-light)' }}>¥{revenueTotal.toFixed(2)}</p>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 8 }}>调用次数</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{plays}</p>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 8 }}>分账比例</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>70%</p>
            </div>
          </div>
        </SparkCard>
      )}

      {/* 提现 */}
      {activeTab === 'withdraw' && (
        <SparkCard padding={28}>
          <h3 style={{ fontWeight: 600, marginBottom: 20, fontSize: 'var(--spark-font-size-xl)' }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 'var(--spark-font-size-sm)' }}>提现账户 (本人实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={selectStyle}>
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="bank">银行卡</option>
              </select>
              <SparkInput id="accountName" placeholder="户名" style={{ flex: 1, minWidth: 120 }} />
              <SparkInput id="accountNumber" placeholder="账号" style={{ flex: 1, minWidth: 120 }} />
              <SparkButton variant="secondary" size="sm" onClick={handleBindAccount}>绑定 / 更新</SparkButton>
            </div>
            <p style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)' }}>
              * 请绑定本人实名账户，提现信息与绑定账户一致方可提现。
            </p>
          </div>
          <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 16 }}>
            可提现余额：<strong style={{ color: 'var(--spark-text-primary)', fontSize: 'var(--spark-font-size-xl)' }}>¥{revenueTotal.toFixed(2)}</strong>
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <SparkInput
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="提现金额"
              style={{ flex: 1 }}
            />
            <SparkButton variant="primary" onClick={handleWithdraw}>申请提现</SparkButton>
          </div>
          <div style={{ fontSize: 'var(--spark-font-size-sm)' }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>提现记录</p>
            {withdrawHistory.length === 0 && <p style={{ color: 'var(--spark-text-muted)', textAlign: 'center', padding: 12 }}>暂无记录</p>}
            {withdrawHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span>¥{item.amount}</span>
                <span style={{ color: 'var(--spark-text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </SparkCard>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  fontSize: 14,
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  width: '100%',
  boxSizing: 'border-box',
};