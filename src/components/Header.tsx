'use client';
import { useState } from 'react';
import ComplianceStatus from './ComplianceStatus';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

 const navLinks = [
  { href: '/chat', label: '💬 星火智能体' },
  { href: '/tasks', label: '📋 任务中心' },
  { href: '/agents', label: '🤖 智能体市场' },
  { href: '/node-market', label: '🖥️ 节点市场' },
  { href: '/nodes', label: '🖥️ 节点入驻' },
  { href: '/agent-register', label: '🤝 代理加盟' },
  { href: '/developer-register', label: '👩‍💻 开发者入驻' },
  { href: '/wallet', label: '👛 钱包' },
  { href: '/trust', label: '🛡️ 信任' },
  { href: '/admin', label: '🔐 管理' },
  { href: '/tech-center', label: '🔧 技术交流' },
];

  return (
    <header style={{ background: 'var(--header-bg)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: 16 }}>
          🔥 星火算力
        </a>

        {/* 桌面导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 2 }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.85)', fontSize: 12, borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* 汉堡按钮（移动端） */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, display: 'none' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* 合规状态灯 */}
          <ComplianceStatus />

          <a href="/profile" style={{ width: 30, height: 30, borderRadius: '50%', background: '#F57C00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', textDecoration: 'none' }}>
            U
          </a>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div className="mobile-menu" style={{ background: '#0a2540', padding: '8px 16px' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} style={{ display: 'block', padding: '10px 0', color: '#fff', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}