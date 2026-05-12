'use client';
import AuthGuard from '@/components/AuthGuard';
import SparkCard from '@/components/ui/SparkCard';

export default function RevenuePage() {
  return (
    <>
      <AuthGuard />
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>💰 收益仪表盘</h1>
        <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>功能即将上线</p>
        <SparkCard padding={24}>
          <p style={{ textAlign: 'center', color: 'var(--spark-text-muted)', padding: 40 }}>🚧 收益仪表盘正在建设中</p>
        </SparkCard>
      </div>
    </>
  );
}