'use client';
import { useState } from 'react';
import Link from 'next/link';
import ComplianceStatus from './ComplianceStatus';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', textDecoration: 'none' }}>
          星火🔥
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', gap: 20, fontSize: 14 }}>
          <Link href="/chat" style={navLinkStyle}>星火智能体</Link>
          <Link href="/tasks" style={navLinkStyle}>任务中心</Link>
          <Link href="/agents" style={navLinkStyle}>智能体市场</Link>
          <Link href="/node-market" style={navLinkStyle}>节点市场</Link>
          <Link href="/nodes" style={navLinkStyle}>节点入驻</Link>
          <Link href="/agent-register" style={navLinkStyle}>代理加盟</Link>
          <Link href="/developer-register" style={navLinkStyle}>开发者入驻</Link>
          {/* === 新增 Aura 相关入口 === */}
          <Link href="/console" style={navLinkStyle}>场所运营台</Link>
          <Link href="/market" style={navLinkStyle}>氛围包市场</Link>
          <Link href="/creator" style={navLinkStyle}>创作者平台</Link>
          {/* ======================= */}
          <Link href="/wallet" style={navLinkStyle}>钱包</Link>
          <Link href="/trust" style={navLinkStyle}>信任</Link>
          <Link href="/admin" style={navLinkStyle}>管理</Link>
          <Link href="/tech-center" style={navLinkStyle}>技术交流</Link>
        </nav>

        <ComplianceStatus />

        <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none' }}>
          ☰
        </button>
      </div>
      {mobileOpen && (
        <div className="mobile-menu" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/chat" onClick={() => setMobileOpen(false)}>星火智能体</Link>
          <Link href="/tasks" onClick={() => setMobileOpen(false)}>任务中心</Link>
          <Link href="/agents" onClick={() => setMobileOpen(false)}>智能体市场</Link>
          <Link href="/node-market" onClick={() => setMobileOpen(false)}>节点市场</Link>
          <Link href="/nodes" onClick={() => setMobileOpen(false)}>节点入驻</Link>
          <Link href="/agent-register" onClick={() => setMobileOpen(false)}>代理加盟</Link>
          <Link href="/developer-register" onClick={() => setMobileOpen(false)}>开发者入驻</Link>
          <Link href="/console" onClick={() => setMobileOpen(false)}>场所运营台</Link>
          <Link href="/market" onClick={() => setMobileOpen(false)}>氛围包市场</Link>
          <Link href="/creator" onClick={() => setMobileOpen(false)}>创作者平台</Link>
          <Link href="/wallet" onClick={() => setMobileOpen(false)}>钱包</Link>
          <Link href="/trust" onClick={() => setMobileOpen(false)}>信任</Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)}>管理</Link>
          <Link href="/tech-center" onClick={() => setMobileOpen(false)}>技术交流</Link>
        </div>
      )}
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};