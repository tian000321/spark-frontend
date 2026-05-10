'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool' | 'task-confirm' | 'task-result';
  content: string;
  toolName?: string;
  toolStatus?: 'calling' | 'success' | 'error';
  file?: { name: string; size: number };
  taskId?: string;
  taskConfirmed?: boolean;
}

export default function OrcaFloating() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好，我是Orca，你的AI编排员。\n\n你可以：\n· 直接说“部署GPU”来调用算力\n· 拖拽或粘贴文件让我分析处理\n· 说“托管任务”我会引导你确认并执行\n· 或直接描述你的需求，我会为你处理。',
    },
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 监听外部唤醒事件（来自 Header 等）
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-orca', handler);
    return () => window.removeEventListener('open-orca', handler);
  }, []);

  // 自动滚动
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const addNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || '[文件]',
      ...(files.length > 0 && { file: { name: files[0].name, size: files[0].size } }),
    };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input.trim();
    setInput('');
    const currentFiles = [...files];
    setFiles([]);

    setTimeout(() => {
      const lower = currentInput.toLowerCase();
      if (lower.includes('托管') || lower.includes('部署') || lower.includes('gpu') || lower.includes('跑')) {
        const taskId = 'task-' + Date.now();
        const taskMsg: Message = {
          id: taskId,
          role: 'task-confirm',
          content: `**托管任务确认**\n- 任务类型：算力调度\n- 预计资源：A100 80GB\n- 预计费用：¥26.40\n\n确认托管？`,
          taskId,
        };
        setMessages(prev => [...prev, taskMsg]);
      } else if (currentFiles.length > 0) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `已收到 ${currentFiles.length} 个文件。如何分析？` }]);
      } else if (lower.includes('信任') || lower.includes('仪表盘')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '当前信任状态：🟢 GREEN\n今日调度：127次 成功率98.4%\n准备金余额：¥10,000\n\n[查看完整仪表盘](/trust)' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '收到，我帮你处理。' }]);
      }
    }, 600);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFiles(Array.from(e.target.files));
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none',
          boxShadow: '0 4px 16px rgba(102,126,234,0.4)', fontSize: 26, cursor: 'pointer',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Orca AI 助手"
      >
        🐋
      </button>

      {/* 浮动对话窗口 */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, width: 420, height: 580,
          background: 'var(--bg-card)', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}>
          {/* 头部 */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
            <span>🤖 Orca · AI 编排员</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>

          {/* 通知 */}
          {notifications.length > 0 && (
            <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '6px 14px', borderRadius: 8, background: n.type === 'success' ? '#d1fae5' : '#dbeafe', color: '#065f46', fontSize: 12, fontWeight: 500 }}>{n.message}</div>
              ))}
            </div>
          )}

          {/* 消息列表 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--bg-card)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'task-confirm' && !msg.taskConfirmed && (
                  <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, background: '#fef3c7', border: '1px solid #f59e0b', fontSize: 13, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <button onClick={() => {
                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, role: 'task-result', content: '✅ 任务已确认，执行中...', taskConfirmed: true } : m));
                        setTimeout(() => {
                          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, content: '✅ 任务完成！结果文件已生成。' } : m));
                          addNotification('托管任务已完成', 'success');
                        }, 3000);
                      }} style={{ padding: '4px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>确认托管</button>
                      <button onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))} style={{ padding: '4px 12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>取消</button>
                    </div>
                  </div>
                )}
                {msg.role !== 'task-confirm' && (
                  <div style={{
                    maxWidth: '85%',
                    padding: '8px 14px',
                    borderRadius: 12,
                    background: msg.role === 'user' ? 'var(--btn-primary-bg)' : msg.role === 'tool' ? '#fef3c7' : msg.role === 'task-result' ? '#d1fae5' : '#f3f4f6',
                    color: msg.role === 'user' ? '#fff' : msg.role === 'task-result' ? '#065f46' : 'var(--text-primary)',
                    fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    border: msg.role === 'tool' ? '1px solid #f59e0b' : msg.role === 'task-result' ? '1px solid #10b981' : 'none',
                  }}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <label style={{ cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '4px' }}>
              📎
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} multiple />
            </label>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="输入需求..."
              rows={1}
              style={{ flex: 1, resize: 'none', border: '1px solid var(--input-border)', borderRadius: 10, padding: '8px 10px', fontSize: 13, background: 'var(--input-bg)', color: 'var(--text-primary)', maxHeight: 100, fontFamily: 'inherit' }}
            />
            <button onClick={handleSend} style={{ padding: '6px 14px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 'bold', cursor: 'pointer', fontSize: 13 }}>发送</button>
          </div>
        </div>
      )}
    </>
  );
}