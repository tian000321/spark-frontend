'use client';

import { useState } from 'react';

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'sandbox' | 'revenue'>('upload');
  const [packageName, setPackageName] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [bpmRange, setBpmRange] = useState('60-80');
  const [licenseType, setLicenseType] = useState('exclusive');
  const [uploadStatus, setUploadStatus] = useState('');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [plays, setPlays] = useState(0);

  const handleUpload = () => {
    if (!packageName || !styleTag) {
      setUploadStatus('请填写名称和风格标签');
      return;
    }
    setUploadStatus('上传中...');
    setTimeout(() => {
      setUploadStatus('上传成功！已进入沙箱审核');
      setPackageName('');
      setStyleTag('');
    }, 1500);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>🎨 创作者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
        上传原创氛围包，通过审核后进入市场，按调用次数获得分账收益。
      </p>

      {/* 标签页切换 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)' }}>
        {(['upload', 'sandbox', 'revenue'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              marginBottom: -2,
            }}
          >
            {tab === 'upload' && '📤 上传氛围包'}
            {tab === 'sandbox' && '🧪 沙箱模拟器'}
            {tab === 'revenue' && '💰 收益看板'}
          </button>
        ))}
      </div>

      {/* 上传氛围包 */}
      {activeTab === 'upload' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: 'var(--text-primary)' }}>氛围包名称</label>
              <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="例：午夜高潮-暗夜专属" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: 'var(--text-primary)' }}>风格标签</label>
              <input type="text" value={styleTag} onChange={(e) => setStyleTag(e.target.value)} placeholder="例：Techno / House / 暗黑" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: 'var(--text-primary)' }}>BPM 范围</label>
                <select value={bpmRange} onChange={(e) => setBpmRange(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <option value="60-80">60-80 (暖场)</option>
                  <option value="120-140">120-140 (高潮)</option>
                  <option value="70-90">70-90 (Chill)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: 'var(--text-primary)' }}>授权类型</label>
                <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <option value="exclusive">独家授权</option>
                  <option value="non-exclusive">非独家授权</option>
                  <option value="cc">知识共享 (CC)</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: 'var(--text-primary)' }}>上传文件 (.vibe JSON + 音频)</label>
              <div style={{ border: '2px dashed var(--border-color)', padding: 32, borderRadius: 8, textAlign: 'center', color: 'var(--text-muted)' }}>
                📁 拖拽文件到此处 或 点击选择
              </div>
            </div>
            <button onClick={handleUpload} style={{ padding: '12px 32px', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
              提交审核
            </button>
            {uploadStatus && <p style={{ fontSize: 13, color: uploadStatus.includes('成功') ? 'green' : 'var(--text-secondary)' }}>{uploadStatus}</p>}
          </div>
        </div>
      )}

      {/* 沙箱模拟器 */}
      {activeTab === 'sandbox' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: 16 }}>🧪 氛围包沙箱测试</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            在这里模拟氛围包在真实场所的运行效果，测试通过后才能提交审核。
          </p>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              🎵 沙箱模拟器将在 M2 与后端集成后开放<br />
              <span style={{ fontSize: 12 }}>届时支持实时播放音乐、灯光同步与红线检测预览</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>BPM 连续性 ✓</span>
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>风格一致性 ✓</span>
            <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, background: 'var(--badge-orange-bg)', color: 'var(--badge-orange-text)' }}>红线检测待集成</span>
          </div>
        </div>
      )}

      {/* 收益看板 */}
      {activeTab === 'revenue' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: 16 }}>💰 收益看板</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#f0f9ff', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>累计收益</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{(revenueTotal || 0).toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>总调用次数</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: '#16a34a' }}>{plays}</p>
            </div>
            <div style={{ background: '#fefce8', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>分账比例</p>
              <p style={{ fontSize: 32, fontWeight: 'bold', color: '#ca8a04' }}>70%</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            分账数据将在 M2 接入真实后端后自动更新。前 10 个通过审核的氛围包享受 100% 分账优惠。
          </p>
        </div>
      )}
    </div>
  );
}