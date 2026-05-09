'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NodeDetailPage() {
  const { id } = useParams();
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8080/v1/provider/nodes')
      .then(r => r.json())
      .then(data => setNode(data.find((n: any) => n.id === id)))
      .catch(() => {});
  }, [id]);

  if (!node) return <div style={{ padding: 40 }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 40 }}>
      <a href="/provider" style={{ fontSize: 13, color: 'var(--badge-blue-text)' }}>← 返回提供者后台</a>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginTop: 16 }}>{node.id}</h1>
      <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginTop: 20 }}>
        <p><strong>GPU 型号：</strong>{node.gpu}</p>
        <p><strong>状态：</strong>{node.status}</p>
        <p><strong>评级：</strong>{node.rating}</p>
        <p><strong>完成任务数：</strong>{node.tasks}</p>
        <p><strong>累计收益：</strong>{node.revenue}</p>
        <p><strong>在线率：</strong>{node.uptime}</p>
        <h3 style={{ marginTop: 20 }}>实时监控</h3>
        <p>GPU 利用率：{Math.floor(Math.random() * 100)}%</p>
        <p>显存使用：{Math.floor(Math.random() * 80)} GB</p>
        <p>温度：{Math.floor(Math.random() * 30 + 50)}°C</p>
      </div>
    </div>
  );
}