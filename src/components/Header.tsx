'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ComplianceStatus from './ComplianceStatus';

function getUserFromStorage() {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('spark_current_user');
  return saved ? JSON.parse(saved) : null;
}

function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spark_current_user');
    setUser(null);
    router.push('/');
  };

  if (!user) {
    return (
      <Link href="/auth" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14 }}>
        登录 / 注册
      </Link>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Link href="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>👤</span>
        <span>{user.name}</span>
      </Link>
      <span
        onClick={handleLogout}
        style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, cursor: 'pointer' }}
      >
        退出
      </span>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontSize: 14,
  cursor: 'pointer',
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

  const openOrca = () => {
    window.dispatchEvent(new CustomEvent('open-orca'));
  };

  return (
    <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', textDecoration: 'none' }}>
          星火🔥
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span onClick={openOrca} style={navLinkStyle}></span>
          <Link href="/node-market" style={navLinkStyle}>节点市场</Link>
          <Link href="/agents" style={navLinkStyle}>智能市场</Link>
          <Link href="/console" style={navLinkStyle}>嗨吧控台</Link>
          <Link href="/tasks" style={navLinkStyle}>任务中心</Link>
          <Link href="/tech-center" style={navLinkStyle}>技术交流</Link>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              onClick={() => setOnboardingOpen(!onboardingOpen)}
              style={{ ...navLinkStyle, cursor: 'pointer', userSelect: 'none' }}
            >
              精英招募 ▾
            </span>
            {onboardingOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 8, padding: '8px 0', minWidth: 150, zIndex: 100,
                boxShadow: 'var(--shadow)'
              }}>
                <Link href="/creator" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🎨 创作入驻</Link>
                <Link href="/developer-register" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>💻 开发入驻</Link>
                <Link href="/nodes" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🖥️ 节点入驻</Link>
                <Link href="/agent-register" onClick={() => setOnboardingOpen(false)} style={dropItemStyle}>🤝 代理入驻</Link>
              </div>
            )}
          </div>

          <Link href="/wallet" style={navLinkStyle}>钱包</Link>
          
          <Link href="/admin" style={navLinkStyle}>管理</Link>

          
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ComplianceStatus />
          <UserMenu />
        </div>

        <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none' }}>
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span onClick={() => { setMobileOpen(false); openOrca(); }} style={navLinkStyle}>星火智能体</span>
          <Link href="/node-market" onClick={() => setMobileOpen(false)}>节点市场</Link>
          <Link href="/agents" onClick={() => setMobileOpen(false)}>智能市场</Link>
          <Link href="/tasks" onClick={() => setMobileOpen(false)}>任务中心</Link>

          
          <p style={{ margin: '8px 0 4px', fontWeight: 'bold', fontSize: 13 }}>伙伴入驻</p>
          <Link href="/creator" onClick={() => setMobileOpen(false)}>🎨 创作入驻</Link>
          <Link href="/developer-register" onClick={() => setMobileOpen(false)}>💻 开发入驻</Link>
          <Link href="/nodes" onClick={() => setMobileOpen(false)}>🖥️ 节点入驻</Link>
          <Link href="/agent-register" onClick={() => setMobileOpen(false)}>🤝 代理入驻</Link>
          <Link href="/wallet" onClick={() => setMobileOpen(false)}>钱包</Link>
          <Link href="/trust" onClick={() => setMobileOpen(false)}>信任</Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)}>管理</Link>
          <Link href="/tech-center" onClick={() => setMobileOpen(false)}>技术交流</Link>
          <Link href="/console" onClick={() => setMobileOpen(false)}>嗨吧控台</Link>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
            <Link href="/auth" onClick={() => setMobileOpen(false)}>登录 / 注册</Link>
          </div>
        </div>
      )}
    </header>
  );
}