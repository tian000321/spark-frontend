'use client';
import { useState, useEffect } from 'react';

export default function MarketPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [styleFilter, setStyleFilter] = useState('all');
  const [bpmFilter, setBpmFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  // 模拟数据（后续接入真实API）
  const mockPackages = [
    {
      id: 'pkg-001',
      name: '午夜高潮-暗夜专属',
      creator: 'DJ Spark',
      style: 'Techno / House',
      bpm: '120-140',
      license: 'exclusive',
      copyrightProof: '0xabc123...',
      calls: 2345,
      price: '¥29.90/次',
      icon: '🎵',
    },
    {
      id: 'pkg-002',
      name: '暖场爵士-晚餐时光',
      creator: 'Mellow Beats',
      style: 'Jazz / Ambient',
      bpm: '60-80',
      license: 'cc',
      copyrightProof: '0xdef456...',
      calls: 1203,
      price: '¥19.90/次',
      icon: '🎷',
    },
    {
      id: 'pkg-003',
      name: '深蓝 Chill 包',
      creator: 'Late Night Lab',
      style: 'Downtempo / Ambient',
      bpm: '70-90',
      license: 'non-exclusive',
      copyrightProof: '0x789ghi...',
      calls: 891,
      price: '¥24.90/次',
      icon: '🌊',
    },
  ];

  useEffect(() => {
    // 当前使用模拟数据，后续替换为 GET /v1/creators/packages?style=&bpm=&search=
    setPackages(mockPackages);
    setTotal(mockPackages.length);
  }, []);

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>🛒 氛围包市场</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
        浏览由专业 DJ 和音乐制作人创作的氛围包，一键应用到你的场所。
      </p>

      {/* 筛选 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 搜索氛围包或创作者..." style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部风格</option>
          <option value="Techno">Techno</option>
          <option value="House">House</option>
          <option value="Jazz">Jazz</option>
          <option value="Ambient">Ambient</option>
          <option value="Downtempo">Downtempo</option>
        </select>
        <select value={bpmFilter} onChange={(e) => setBpmFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部 BPM</option>
          <option value="60-80">60-80 暖场</option>
          <option value="120-140">120-140 高潮</option>
          <option value="70-90">70-90 Chill</option>
        </select>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>共 {total} 个氛围包</p>

      {/* 氛围包卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {packages.map((pkg: any) => (
          <div key={pkg.id} style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>{pkg.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{pkg.name}</h3>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: pkg.license === 'exclusive' ? 'var(--badge-green-bg)' : 'var(--badge-blue-bg)', color: pkg.license === 'exclusive' ? 'var(--badge-green-text)' : 'var(--badge-blue-text)' }}>
                {pkg.license === 'exclusive' ? '独家' : pkg.license === 'cc' ? 'CC' : '非独家'}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{pkg.creator}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: '#f3f4f6', color: '#6b7280' }}>{pkg.style}</span>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: '#f3f4f6', color: '#6b7280' }}>🎵 {pkg.bpm} BPM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              <span>📞 已调用 {pkg.calls?.toLocaleString()} 次</span>
              <span style={{ fontWeight: 500, color: 'var(--btn-primary-bg)' }}>{pkg.price}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 12, wordBreak: 'break-all' }}>
              存证：{pkg.copyrightProof}
            </div>
            <button style={{ width: '100%', padding: '10px 0', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}>
              应用到此场所
            </button>
          </div>
        ))}
      </div>
      {packages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>暂无氛围包，敬请期待</p>}
    </div>
  );
}