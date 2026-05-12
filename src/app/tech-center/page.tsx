'use client';
import AuthGuard from '@/components/AuthGuard';
import SparkCard from '@/components/ui/SparkCard';

export default function TechCenterPage() {
  return (
    <>
      <AuthGuard />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>💬 技术交流</h1>
        <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>开发者社区与技术支持论坛（即将上线）</p>
        <SparkCard padding={24}>
          <p style={{ textAlign: 'center', color: 'var(--spark-text-muted)', padding: 40 }}>
            🚧 技术交流板块正在建设中，敬请期待。
          </p>
        </SparkCard>
      </div>
    </>
  );
}