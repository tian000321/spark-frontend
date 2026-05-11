'use client';
import SparkCard from '@/components/ui/SparkCard';

const mockRecords = [
  { id: 'rec-001', task: '语音识别微调', time: '2026-05-10 03:15', amount: 400, hash: '0x1a2b3c4d5e6f7890' },
  { id: 'rec-002', task: '文本摘要生成', time: '2026-05-09 18:42', amount: 10, hash: '0xabcdef1234567890' },
  { id: 'rec-003', task: '目标检测推理', time: '2026-05-08 09:10', amount: 0, hash: '0x0feedb0bdeadc0de' },
];

export default function TrustPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🛡️ 公开信任账本</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>
        所有赔付记录均受链式哈希保护，不可篡改，全球可查。当前为模拟数据演示。
      </p>
      <SparkCard padding={20}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>记录ID</th>
              <th style={{ padding: 10 }}>关联任务</th>
              <th style={{ padding: 10 }}>时间</th>
              <th style={{ padding: 10 }}>赔付金额</th>
              <th style={{ padding: 10 }}>存证哈希</th>
              <th style={{ padding: 10 }}>验证</th>
            </tr>
          </thead>
          <tbody>
            {mockRecords.map(rec => (
              <tr key={rec.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: 10, fontFamily: 'monospace' }}>{rec.id}</td>
                <td style={{ padding: 10 }}>{rec.task}</td>
                <td style={{ padding: 10 }}>{rec.time}</td>
                <td style={{ padding: 10, fontWeight: 600, color: rec.amount > 0 ? '#ef4444' : '#10b981' }}>
                  ¥{rec.amount}
                </td>
                <td style={{ padding: 10, fontFamily: 'monospace', fontSize: 11, color: 'var(--spark-text-secondary)' }}>
                  {rec.hash.slice(0, 12)}...
                </td>
                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => alert(`哈希 ${rec.hash} 已通过完整性验证（模拟）`)}
                    style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--spark-brand)', background: 'transparent', color: 'var(--spark-brand-light)', cursor: 'pointer', fontSize: 12 }}
                  >
                    验证
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SparkCard>
    </div>
  );
}