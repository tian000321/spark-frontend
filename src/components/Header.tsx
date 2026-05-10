'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ComplianceStatus from './ComplianceStatus';

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontSize: 14,
};

const dropItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 20px',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: 13,
  whiteSpace: 'nowrap',
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 全局点击关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOnboardingOpen(false);
      }
    };
    if (onboardingOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onboardingOpen]);

  return (
    <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        
        <Link href="/" style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', textDecoration: 'none' }}>
          星火🔥
        </Link>

        {/* 桌面端导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/chat" style={navLinkStyle}>星火智能体</Link>
          <Link href="/tasks" style={navLinkStyle}>任务中心</Link>
          <Link href="/agents" style={navLinkStyle}>智能体市场</Link>
          <Link href="/node-market" style={navLinkStyle}>节点市场</Link>
          
          {/* 下拉入驻菜单 — 无遮罩层，使用全局监听关闭 */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <span
              onClick={() => setOnboardingOpen(!onboardingOpen)}
              style={{ ...navLinkStyle, cursor: 'pointer', userSelect: 'none' }}
            >
              入驻 ▾
            </span>
            {onboardingOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 8, padding: '8px 0', minWidth: 150, zIndex: 100,
                boxShadow: 'var(--shadow)'
              }}>
                <Link href="/creator" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🎨 创作者入驻</Link>
                <Link href="/developer-register" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>💻 开发者入驻</Link>
                <Link href="/nodes" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🖥️ 节点入驻</Link>
                <Link href="/agent-register" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🤝 代理加盟</Link>
              </div>
            )}
          </div>

          <Link href="/wallet" style={navLinkStyle}>钱包</Link>
          <Link href="/trust" style={navLinkStyle}>信任</Link>
          <Link href="/admin" style={navLinkStyle}>管理</Link>
          <Link href="/tech-center" style={navLinkStyle}>技术交流</Link>
          <Link href="/console" style={navLinkStyle}>场所运营台</Link>
          <Link href="/market" style={navLinkStyle}>氛围包市场</Link>
        </nav>

        <ComplianceStatus />

        {/* 移动端汉堡菜单按钮 */}
        <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none' }}>
          ☰
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/chat" onClick={() => setMobileOpen(false)}>星火智能体</Link>
          <Link href="/tasks" onClick={() => setMobileOpen(false)}>任务中心</Link>
          <Link href="/agents" onClick={() => setMobileOpen(false)}>智能体市场</Link>
          <Link href="/node-market" onClick={() => setMobileOpen(false)}>节点市场</Link>
          <p style={{ margin: '8px 0 4px', fontWeight: 'bold', fontSize: 13 }}>入驻</p>
          <Link href="/creator" onClick={() => setMobileOpen(false)}>🎨 创作者入驻</Link>
          <Link href="/developer-register" onClick={() => setMobileOpen(false)}>💻 开发者入驻</Link>
          <Link href="/nodes" onClick={() => setMobileOpen(false)}>🖥️ 节点入驻</Link>
          <Link href="/agent-register" onClick={() => setMobileOpen(false)}>🤝 代理加盟</Link>
          <Link href="/wallet" onClick={() => setMobileOpen(false)}>钱包</Link>
          <Link href="/trust" onClick={() => setMobileOpen(false)}>信任</Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)}>管理</Link>
          <Link href="/tech-center" onClick={() => setMobileOpen(false)}>技术交流</Link>
          <Link href="/console" onClick={() => setMobileOpen(false)}>场所运营台</Link>
          <Link href="/market" onClick={() => setMobileOpen(false)}>氛围包市场</Link>
        </div>
      )}
    </header>
  );
}