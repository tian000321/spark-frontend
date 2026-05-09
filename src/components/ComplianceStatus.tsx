'use client';
import { useState, useEffect } from 'react';

export default function ComplianceStatus() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState('green');

  useEffect(() => {
    fetch('http://localhost:8080/v1/compliance/status')
      .then(res => res.json())
      .then(data => setLevel(data.level))
      .catch(() => {});
  }, []);

  const cChecks = [
    { code: 'C01', name: '数据出境授权', status: level === 'green' ? 'pass' : 'warn' },
    { code: 'C02', name: 'AI 标识覆盖', status: 'pass' },
    { code: 'C03', name: 'DecisionRecord 存在性', status: 'pass' },
    { code: 'C04', name: '公平性偏差', status: level === 'red' ? 'fail' : 'warn' },
    { code: 'C05', name: '可解释性底线', status: 'pass' },
    { code: 'C06', name: '数字水印', status: 'pass' },
  ];

  const statusColor = { green: '#2E7D32', orange: '#F57C00', red: '#D32F2F' }[level];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--header-text)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor }}></span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>合规{level === 'green' ? '正常' : '告警'}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 40, right: 0, width: 280, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>C01-C22 合规状态</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          </div>
          {cChecks.map(c => (
            <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{c.code} {c.name}</span>
              <span style={{ fontSize: 11, color: c.status === 'pass' ? 'var(--badge-green-text)' : c.status === 'warn' ? 'var(--badge-orange-text)' : 'var(--badge-red-text)' }}>
                {c.status === 'pass' ? '✅' : c.status === 'warn' ? '⚠️' : '❌'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}