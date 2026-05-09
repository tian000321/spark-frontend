'use client';
import { useState, useRef } from 'react';

function DataResidencyAlert({ options, onConsent, onCancel }: any) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const allChecked = checks.every(Boolean);
  const items = [
    `我已知悉数据将被传输至 ${options.receiver_region} 处理`,
    `我已知悉数据传输目的为：${options.purpose}`,
    `我已知悉传输的数据类型：${options.data_types.join('、')}`,
    `我已知悉数据最长保留期限：${options.retention_days} 天`,
  ];
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16, marginTop: 10 }}>
      <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>⚠️ 此任务涉及数据跨境处理</p>
      {items.map((text, idx) => (
        <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={checks[idx]} onChange={(e) => setChecks(prev => prev.map((c, i) => i === idx ? e.target.checked : c))} style={{ marginTop: 3 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
        </label>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => allChecked && onConsent()} disabled={!allChecked} style={{ flex: 1, padding: '8px 0', background: allChecked ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 'bold', cursor: allChecked ? 'pointer' : 'not-allowed' }}>同意并继续</button>
        {onCancel && <button onClick={onCancel} style={{ padding: '8px 16px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 6, fontSize: 13, color: 'var(--text-primary)' }}>取消</button>}
      </div>
    </div>
  );
}

function DecisionRecordViewer({ taskId }: { taskId: string }) {
  const [expanded, setExpanded] = useState(false);
  const steps = [
    { step: 'TaskSubmitted', time: new Date().toLocaleString(), hash: 'a1b2c3d4e5f6789012345678abcdef01', summary: '任务已提交，Orca 完成意图解析' },
    { step: 'TaskScheduled', time: new Date().toLocaleString(), hash: 'b2c3d4e5f6789012345678abcdef0123', summary: '已调度至 A100 节点 #42' },
    { step: 'TaskCompleted', time: new Date().toLocaleString(), hash: 'c3d4e5f6789012345678abcdef0123456', summary: '任务执行完成，结果已生成' },
  ];
  if (!expanded) {
    return <button onClick={() => setExpanded(true)} style={{ background: 'none', border: 'none', color: 'var(--badge-blue-text)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: 8 }}>📋 查看决策记录</button>;
  }
  return (
    <div style={{ marginTop: 10, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>📋 决策记录时间轴</span>
        <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
      {steps.map((s, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--badge-green-text)', marginTop: 5 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{s.step}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.time}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.summary}</p>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>哈希: {s.hash.slice(0, 16)}...</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', text: '👋 你好！我是 **Orca**，你的 AI 任务编排员。\n\n你可以：\n- 📎 上传文件让我帮你处理\n- 🖥️ 让我远程操作电脑完成任务\n- 📥 任务完成后下载结果文件\n\n请描述你的需求，或直接上传文件。' },
  ]);
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const taskId = 'task-' + Math.random().toString(36).substr(2, 8);
    const needsConsent = /欧洲|海外|GDPR|美国|欧盟|跨境|传输到国外/i.test(input);
    const aiMsg: any = {
      role: 'ai',
      text: needsConsent ? '⚠️ 检测到数据出境需求' : `✅ 任务已提交（${taskId}）\n\n正在调度资源执行...`,
      taskId,
      needsConsent,
      consentOptions: needsConsent ? { receiver_region: 'EU-West（法兰克福）', purpose: '使用基准模型进行迁移学习', data_types: ['图像数据', '标注文件'], retention_days: 90 } : null,
      showDR: false,
    };
    setMessages(prev => [...prev, aiMsg]);
    if (!needsConsent) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.taskId === taskId ? { ...m, text: `✅ 任务完成（${taskId}）\n\n模型精度：94.7% | 耗时：12分38秒 | 费用：¥3.42`, showDR: true } : m));
      }, 3000);
    }
    setInput('');
  };

  const handleConsent = (taskId: string) => {
    setMessages(prev => prev.map(m => m.taskId === taskId ? { ...m, needsConsent: false, text: '⏳ 授权已确认，任务开始执行...' } : m));
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.taskId === taskId ? { ...m, text: `✅ 任务完成（${taskId}）\n\n模型精度：96.1% | 耗时：18分22秒 | 费用：¥8.76`, showDR: true } : m));
    }, 3000);
  };

  const handleCancel = (taskId: string) => {
    setMessages(prev => prev.map(m => m.taskId === taskId ? { ...m, needsConsent: false, text: '❌ 任务已取消（未获得数据出境授权）' } : m));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const taskId = 'task-' + Math.random().toString(36).substr(2, 8);
    setMessages(prev => [...prev, { role: 'user', text: `📎 上传文件：${file.name} (${(file.size / 1024).toFixed(1)} KB)` }]);
    setMessages(prev => [...prev, { role: 'ai', text: `✅ 文件已接收（${taskId}）\n\n正在处理 **${file.name}**...`, taskId, showDR: false }]);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.taskId === taskId ? { ...m, text: `✅ 文件处理完成！（${taskId}）\n\n📥 **处理结果**：[下载处理后的文件](processed_${file.name})`, showDR: true } : m));
    }, 4000);
    e.target.value = '';
  };

  const handleDownload = (filename: string) => {
    alert('📥 模拟下载：' + filename);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 104px)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, background: msg.role === 'user' ? 'var(--btn-primary-bg)' : 'var(--bg-card)', color: msg.role === 'user' ? 'var(--btn-primary-text)' : 'var(--text-primary)', fontSize: 14, lineHeight: 1.5, boxShadow: 'var(--shadow)', border: msg.role === 'ai' ? '1px solid var(--border-color)' : 'none' }}>
              {msg.role === 'ai' && msg.taskId && (
                <span style={{ display: 'inline-block', background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)', padding: '1px 6px', borderRadius: 8, fontSize: 10, marginBottom: 4 }}>
                  🤖 AI 生成
                </span>
              )}
              {msg.text.split('\n').map((line: string, j: number) => {
                const downloadMatch = line.match(/\[下载处理后的文件\]\((.+?)\)/);
                if (downloadMatch) {
                  const fileName = downloadMatch[1];
                  return (
                    <p key={j} style={{ margin: j > 0 ? '4px 0 0 0' : 0 }}>
                      📥 下载处理后的文件：{' '}
                      <button onClick={() => handleDownload(fileName)} style={{ background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>{fileName}</button>
                    </p>
                  );
                }
                return (
                  <p key={j} style={{ margin: j > 0 ? '4px 0 0 0' : 0 }}>
                    {line.split(/(\*\*.*?\*\*)/g).map((part, k) =>
                      part.startsWith('**') && part.endsWith('**') ? <strong key={k}>{part.slice(2, -2)}</strong> : <span key={k}>{part}</span>
                    )}
                  </p>
                );
              })}
              {msg.needsConsent && msg.consentOptions && <DataResidencyAlert options={msg.consentOptions} onConsent={() => handleConsent(msg.taskId)} onCancel={() => handleCancel(msg.taskId)} />}
              {msg.showDR && msg.taskId && <DecisionRecordViewer taskId={msg.taskId} />}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 0', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--input-border)', borderRadius: 8, cursor: 'pointer', fontSize: 18, color: 'var(--text-primary)' }}>📎</button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} placeholder="描述需求，或说“帮我远程操作...”" style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <button onClick={handleSend} style={{ padding: '10px 16px', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>发送</button>
      </div>
    </div>
  );
}