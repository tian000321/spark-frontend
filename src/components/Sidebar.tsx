'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: '📊', label: '运营总览', href: '/' },
  { icon: '🎛️', label: '智能嗨吧控台', href: '/console' },
  { icon: '🤖', label: '智能体市场', href: '/agents' },
  { icon: '🖥️', label: '节点市场', href: '/node-market' },
  { icon: '📋', label: '任务中心', href: '/tasks' },
  { icon: '👛', label: '钱包', href: '/wallet' },
  { icon: '⭐', label: '精英招募', href: '/onboarding-guide' },  
  { icon: '📚', label: '帮助中心', href: '/help' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div style={{
      width: 240, background: 'rgba(15,15,25,0.8)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column',
      padding: '24px 12px', boxSizing: 'border-box'
    }}>
      <Link href="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>🔥 星火</h2>
        <p style={{ fontSize: 11, color: '#A0A0B0', marginTop: 4 }}>星是规则，火是相信</p>
      </Link>
      <nav style={{ flex: 1 }}>
        {menuItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderRadius: 12, textDecoration: 'none', marginBottom: 4,
              background: isActive ? 'rgba(108,92,231,0.15)' : 'transparent',
              color: isActive ? '#F5F5F7' : '#A0A0B0', fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, fontSize: 13 }}>
        <Link href="/auth" style={{ color: '#A29BFE', textDecoration: 'none' }}>登录 / 注册</Link>
      </div>
    </div>
  );
}