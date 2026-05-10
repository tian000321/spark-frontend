export default function PendingReview() {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的申请已成功提交，平台将在 1-3 个工作日内完成审核，请耐心等待。</p>
    </div>
  );
}