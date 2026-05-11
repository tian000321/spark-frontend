'use client';
import { useState, useEffect } from 'react';

export default function OrcaFloating() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([
    { id: '0', role: 'assistant', content: '你好，我是Orca，直接说需求。' }
  ]);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');
    setTimeout(() => {
      let reply = '收到，我帮你处理。';
      if (query.includes('部署') || query.includes('gpu')) reply = '已为你找到最优GPU，部署中...';
      else if (query.includes('信任')) reply = '当前准备金 ¥10,000，最近赔付2笔。';
      else if (query.includes('入驻')) reply = '请选择角色：创作者、开发者、提供者、代理。';
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply }]);
    }, 600);
  };
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', color: '#fff', border: 'none', fontSize: 26, cursor: 'pointer', zIndex: 9999, boxShadow: '0 4px 16px rgba(108,92,231,0.4)' }}>
        🐋
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, width: 380, height: 500, background: '#15151E', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            <span>🤖 Orca</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '8px 14px', borderRadius: 12, background: msg.role === 'user' ? 'var(--spark-brand)' : 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }} placeholder="输入需求..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13 }} />
            <button onClick={handleSend} style={{ padding: '8px 16px', background: '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>发送</button>
          </div>
        </div>
      )}
    </>
  );
}