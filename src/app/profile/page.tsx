'use client';
import AuthGuard from '@/components/AuthGuard';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';

export default function ProfilePage() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('spark_current_user') || '{}') : {};

  return (
    <>
      <AuthGuard />
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>👤 个人中心</h1>
        <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>管理你的账户信息</p>
        <SparkCard padding={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ color: 'var(--spark-text-muted)', fontSize: 13 }}>用户名</p>
              <p style={{ fontWeight: 500 }}>{user.name || '未知'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--spark-text-muted)', fontSize: 13 }}>邮箱</p>
              <p style={{ fontWeight: 500 }}>{user.email || '未知'}</p>
            </div>
            <SparkButton variant="ghost" size="sm" onClick={() => { localStorage.removeItem('spark_current_user'); window.location.href = '/auth'; }}>退出登录</SparkButton>
          </div>
        </SparkCard>
      </div>
    </>
  );
}