'use client';
import { useState, useEffect } from 'react';
import { CreatorContract } from '@/components/onboarding/ContractText';

type Status = 'none' | 'pending' | 'approved' | 'signed';
type PackageStatus = 'reviewing' | 'published' | 'unpublished' | 'rejected';

interface VibePackage {
  id: string;
  name: string;
  style: string;
  bpm: string;
  license: string;
  status: PackageStatus;
  calls: number;
  copyrightProof: string;
}

export default function CreatorPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [style, setStyle] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'packages' | 'revenue' | 'withdraw' | 'stats' | 'contract'>('upload');

  // 上传相关状态
  const [packageName, setPackageName] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [bpmRange, setBpmRange] = useState('60-80');
  const [licenseType, setLicenseType] = useState('exclusive');
  const [uploadStatus, setUploadStatus] = useState('');

  // 收益与提现
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [plays, setPlays] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  // 氛围包管理
  const [packages, setPackages] = useState<VibePackage[]>([
    { id: '1', name: '午夜高潮-暗夜专属', style: 'Techno / House', bpm: '120-140', license: 'exclusive', status: 'published', calls: 2300, copyrightProof: '0xabc123...' },
    { id: '2', name: '暖场爵士-晚餐时光', style: 'Jazz / Ambient', bpm: '60-80', license: 'cc', status: 'reviewing', calls: 0, copyrightProof: '0xdef456...' },
    { id: '3', name: '深蓝 Chill 包', style: 'Downtempo', bpm: '70-90', license: 'non-exclusive', status: 'unpublished', calls: 890, copyrightProof: '0x789ghi...' },
  ]);

  // 编辑器相关状态
  const [editingPkg, setEditingPkg] = useState<VibePackage | null>(null);
  const [editorName, setEditorName] = useState('');
  const [editorBpm, setEditorBpm] = useState('');
  const [editorStyle, setEditorStyle] = useState('');

  // 统计图表数据
  const [chartData] = useState([80, 150, 210, 140, 190, 260, 310]);

  useEffect(() => {
    const saved = localStorage.getItem('creator_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('creator_status', s);
  };

  // 上传氛围包
  const handleUpload = () => {
    if (!packageName || !styleTag) { setUploadStatus('请填写名称和风格标签'); return; }
    const newPkg: VibePackage = {
      id: Date.now().toString(),
      name: packageName,
      style: styleTag,
      bpm: bpmRange,
      license: licenseType,
      status: 'reviewing',
      calls: 0,
      copyrightProof: '0x' + Math.random().toString(16).slice(2),
    };
    setPackages(prev => [newPkg, ...prev]);
    setPackageName('');
    setStyleTag('');
    setUploadStatus('上传成功！已进入沙箱审核');
  };

  // 上下架操作
  const handleToggleStatus = (id: string) => {
    setPackages(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const newStatus: PackageStatus = p.status === 'published' ? 'unpublished' : 'published';
        return { ...p, status: newStatus };
      })
    );
  };

  // 打开编辑器
  const openEditor = (pkg: VibePackage) => {
    setEditingPkg(pkg);
    setEditorName(pkg.name);
    setEditorBpm(pkg.bpm);
    setEditorStyle(pkg.style);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingPkg) return;
    setPackages(prev => prev.map(p => p.id === editingPkg.id ? { ...p, name: editorName, bpm: editorBpm, style: editorStyle } : p));
    setEditingPkg(null);
    alert('氛围包信息已更新');
  };

  // 绑定账户
  const handleBindAccount = () => {
    const type = (document.getElementById('accountType') as HTMLSelectElement)?.value;
    const aname = (document.getElementById('accountName') as HTMLInputElement)?.value;
    const number = (document.getElementById('accountNumber') as HTMLInputElement)?.value;
    if (!aname || !number) return alert('请填写完整的账户信息');
    localStorage.setItem('withdraw_account', JSON.stringify({ type, name: aname, number }));
    alert(`${type} 账户绑定成功！`);
  };

  // 提现
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

  // 获取状态标签
  const getStatusTag = (s: PackageStatus) => {
    const map: Record<string, { text: string; color: string; textColor: string }> = {
      reviewing: { text: '审核中', color: '#fef3c7', textColor: '#92400e' },
      published: { text: '已上架', color: '#d1fae5', textColor: '#065f46' },
      unpublished: { text: '已下架', color: '#f3f4f6', textColor: '#6b7280' },
      rejected: { text: '被驳回', color: '#fee2e2', textColor: '#991b1b' },
    };
    const item = map[s];
    return <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, background: item.color, color: item.textColor }}>{item.text}</span>;
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
        <button onClick={() => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('creator_status_name', name);
          localStorage.setItem('creator_status_phone', phone);
          localStorage.setItem('creator_status_detail', style);
          localStorage.setItem('creator_status_time', new Date().toLocaleString());
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
    <div style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>🎨 创作者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · 上传氛围包，审核通过后进入市场。</p>

      {/* 选项卡 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)', flexWrap: 'wrap' }}>
        {(['upload', 'packages', 'revenue', 'withdraw', 'stats', 'contract'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2, whiteSpace: 'nowrap'
            }}>
            {tab === 'upload' && '📤 上传氛围包'}
            {tab === 'packages' && '📦 我的氛围包'}
            {tab === 'revenue' && '💰 收益'}
            {tab === 'withdraw' && '💳 提现'}
            {tab === 'stats' && '📊 统计'}
            {tab === 'contract' && '📝 合同'}
          </button>
        ))}
      </div>

      {/* 上传 */}
      {activeTab === 'upload' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>上传新氛围包</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            <button onClick={handleUpload} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>提交审核</button>
            {uploadStatus && <p style={{ fontSize: 13, color: uploadStatus.includes('成功') ? 'green' : 'var(--text-secondary)' }}>{uploadStatus}</p>}
          </div>
        </div>
      )}

      {/* 我的氛围包 */}
      {activeTab === 'packages' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>我的氛围包</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>名称</th>
                  <th style={{ padding: '8px' }}>风格</th>
                  <th style={{ padding: '8px' }}>BPM</th>
                  <th style={{ padding: '8px' }}>状态</th>
                  <th style={{ padding: '8px' }}>调用次数</th>
                  <th style={{ padding: '8px' }}>版权存证</th>
                  <th style={{ padding: '8px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{pkg.name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{pkg.style}</td>
                    <td style={{ padding: '8px' }}>{pkg.bpm}</td>
                    <td style={{ padding: '8px' }}>{getStatusTag(pkg.status)}</td>
                    <td style={{ padding: '8px' }}>{pkg.calls.toLocaleString()}</td>
                    <td style={{ padding: '8px', fontSize: 11, color: 'var(--text-muted)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} title={pkg.copyrightProof}>{pkg.copyrightProof}</td>
                    <td style={{ padding: '8px', display: 'flex', gap: 6 }}>
                      <button onClick={() => openEditor(pkg)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>编辑</button>
                      <button onClick={() => handleToggleStatus(pkg.id)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>
                        {pkg.status === 'published' ? '下架' : '上架'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 编辑器弹窗 */}
          {editingPkg && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 500 }}>
                <h3 style={{ marginBottom: 16 }}>🎛️ 编辑氛围包</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13 }}>名称</label>
                    <input value={editorName} onChange={e => setEditorName(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13 }}>风格</label>
                    <input value={editorStyle} onChange={e => setEditorStyle(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13 }}>BPM 范围</label>
                    <input value={editorBpm} onChange={e => setEditorBpm(e.target.value)} style={{ ...inputStyle, marginTop: 4 }} />
                  </div>
                  <div style={{ padding: 20, background: '#f9fafb', borderRadius: 8, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)' }}>
                    🎵 BPM 曲线编辑器（拖拽调节）
                    <div style={{ height: 60, background: 'linear-gradient(to right, #00c6ff, #0072ff)', borderRadius: 6, marginTop: 8, opacity: 0.3 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingPkg(null)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>取消</button>
                  <button onClick={handleSaveEdit} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>保存</button>
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
                <span>¥{item.amount}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
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
                <div style={{ width: '100%', maxWidth: 40, height: val * 0.5, background: 'var(--btn-primary-bg)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 合同 */}
      {activeTab === 'contract' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📝 已签署协议</h3>
          <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, maxHeight: 400, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {CreatorContract}
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