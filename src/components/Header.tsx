'use client';
import { useState } from 'react';
import ComplianceStatus from './ComplianceStatus';

const navStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontSize: 14,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
};

const dropItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 20px',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: 13,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  textAlign: 'left' as const,
  fontFamily: 'inherit',
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const goTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        
        <span onClick={() => goTo('/')} style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', cursor: 'pointer' }}>
          星火🔥
        </span>

        {/* 桌面端导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span onClick={() => goTo('/chat')} style={navStyle}>星火懂你</span>
          <span onClick={() => goTo('/tasks')} style={navStyle}>任务中心</span>
          <span onClick={() => goTo('/agents')} style={navStyle}>智能市场</span>
          <span onClick={() => goTo('/node-market')} style={navStyle}>节点市场</span>
          
          {/* 下拉入驻菜单 */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              onClick={(e) => { e.stopPropagation(); setOnboardingOpen(!onboardingOpen); }}
              style={{ ...navStyle, userSelect: 'none' }}
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
                <button onClick={(e) => { e.stopPropagation(); setOnboardingOpen(false); goTo('/creator'); }} style={dropItemStyle}>🎨 创作入驻</button>
                <button onClick={(e) => { e.stopPropagation(); setOnboardingOpen(false); goTo('/developer-register'); }} style={dropItemStyle}>💻 开发入驻</button>
                <button onClick={(e) => { e.stopPropagation(); setOnboardingOpen(false); goTo('/nodes'); }} style={dropItemStyle}>🖥️ 节点入驻</button>
                <button onClick={(e) => { e.stopPropagation(); setOnboardingOpen(false); goTo('/agent-register'); }} style={dropItemStyle}>🤝 代理入驻</button>
              </div>
            )}
          </div>

          <span onClick={() => goTo('/wallet')} style={navStyle}>钱包</span>
          <span onClick={() => goTo('/trust')} style={navStyle}>信任</span>
          <span onClick={() => goTo('/admin')} style={navStyle}>管理</span>
          <span onClick={() => goTo('/tech-center')} style={navStyle}>技术交流</span>
          <span onClick={() => goTo('/console')} style={navStyle}>嗨吧控台</span>
          
        </nav>

        <ComplianceStatus />

        <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none' }}>
          ☰
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span onClick={() => { setMobileOpen(false); goTo('/chat'); }} style={navStyle}>星火懂你</span>
          <span onClick={() => { setMobileOpen(false); goTo('/tasks'); }} style={navStyle}>任务中心</span>
          <span onClick={() => { setMobileOpen(false); goTo('/agents'); }} style={navStyle}>智能市场</span>
          <span onClick={() => { setMobileOpen(false); goTo('/node-market'); }} style={navStyle}>节点市场</span>
          <p style={{ margin: '8px 0 4px', fontWeight: 'bold', fontSize: 13 }}>入驻</p>
          <span onClick={() => { setMobileOpen(false); goTo('/creator'); }} style={navStyle}>🎨 创作入驻</span>
          <span onClick={() => { setMobileOpen(false); goTo('/developer-register'); }} style={navStyle}>💻 开发入驻</span>
          <span onClick={() => { setMobileOpen(false); goTo('/nodes'); }} style={navStyle}>🖥️ 节点入驻</span>
          <span onClick={() => { setMobileOpen(false); goTo('/agent-register'); }} style={navStyle}>🤝 代理入驻</span>
          <span onClick={() => { setMobileOpen(false); goTo('/wallet'); }} style={navStyle}>钱包</span>
          <span onClick={() => { setMobileOpen(false); goTo('/trust'); }} style={navStyle}>信任</span>
          <span onClick={() => { setMobileOpen(false); goTo('/admin'); }} style={navStyle}>管理</span>
          <span onClick={() => { setMobileOpen(false); goTo('/tech-center'); }} style={navStyle}>技术交流</span>
          <span onClick={() => { setMobileOpen(false); goTo('/console'); }} style={navStyle}>嗨吧控台</span>
          <span onClick={() => { setMobileOpen(false); goTo('/market'); }} style={navStyle}>嗨吧市场</span>
        </div>
      )}
    </header>
  );
}