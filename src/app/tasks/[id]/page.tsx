'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [drSteps, setDrSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取任务基本信息
    fetch(`http://localhost:8080/v1/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        setTask(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 获取审计记录（决策记录）
    fetch(`http://localhost:8080/v1/audit/${id}`)
      .then(res => res.json())
      .then(data => setDrSteps(data.records || []))
      .catch(() => setDrSteps([]));
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;
  if (!task) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--badge-red-text)' }}>任务不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <a href="/tasks" style={{ color: 'var(--badge-blue-text)', fontSize: 13, textDecoration: 'none' }}>← 返回任务中心</a>

      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginTop: 16 }}>{task.name}</h1>

      {/* 任务信息卡片 */}
      <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginTop: 16 }}>
        <p><strong>任务ID：</strong>{task.id}</p>
        <p><strong>状态：</strong>{task.status}</p>
        <p><strong>类型：</strong>{task.type}</p>
        <p><strong>创建时间：</strong>{task.time}</p>
        <p><strong>费用：</strong>¥{task.cost?.toFixed(2)}</p>
      </div>

      {/* 决策记录时间轴 */}
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', marginTop: 32 }}>📋 决策记录</h2>
      <div style={{ marginTop: 16 }}>
        {drSteps.length > 0 ? drSteps.map((step: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--badge-green-text)', marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, background: 'var(--bg-card)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{step.step}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.timestamp} · {step.summary}</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 4 }}>证据哈希: {step.evidence_hash}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>来源: {step.source}</p>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)' }}>暂无决策记录</p>
        )}
      </div>
    </div>
  );
}