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

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: '你好，我是Orca，你的AI编排员。\n\n你可以：\n· 直接说"部署GPU"来调用算力\n· 拖拽或粘贴文件让我分析处理\n· 说"托管任务"我会引导你确认并执行\n· 或直接描述你的需求，我会为你处理。',
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // 清除通知
  const addNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // 处理文件上传（智能上传）
  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const newFiles = Array.from(uploadedFiles);
    setFiles(prev => [...prev, ...newFiles]);
    addNotification(`已接收 ${newFiles.length} 个文件，可在消息中描述处理需求`, 'info');
  };

  // 用户确认托管任务
  const confirmTask = (taskId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === taskId ? { ...m, role: 'task-result', content: '✅ 任务已确认，正在执行...', taskConfirmed: true }
        : m
      )
    );

    // 模拟任务执行完成，推送通知
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === taskId
            ? { ...m, content: '✅ 任务执行完成！结果文件已生成，可下载。', taskConfirmed: true }
            : m
        )
      );
      addNotification('托管任务已完成，请查看结果', 'success');
    }, 3000);
  };

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    // 用户消息
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

    // 重置输入框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 模拟智能体回复
    setTimeout(() => {
      const hasFile = currentFiles.length > 0;
      const lower = currentInput.toLowerCase();

      // 场景1：托管任务 — 弹出确认卡片
      if (lower.includes('托管') || lower.includes('部署') || lower.includes('gpu') || lower.includes('跑') || lower.includes('任务')) {
        const taskId = 'task-' + Date.now();
        const taskMsg: Message = {
          id: taskId,
          role: 'task-confirm',
          content: `**托管任务确认**\n- 任务类型：算力调度\n- 预计资源：A100 80GB\n- 预计时长：12小时\n- 预计费用：¥26.40\n- 附加文件：${hasFile ? currentFiles.map(f => f.name).join(', ') : '无'}\n\n请确认是否托管此任务？`,
          taskId,
        };
        setMessages(prev => [...prev, taskMsg]);
        return;
      }

      // 场景2：文件分析
      if (hasFile) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `已收到 ${currentFiles.length} 个文件：${currentFiles.map(f => f.name).join(', ')}。\n请描述你需要如何处理这些文件，或说"托管任务"我来执行。`,
        }]);
        return;
      }

      // 场景3：查询信任
      if (lower.includes('信任') || lower.includes('仪表盘')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '当前信任状态：🟢 GREEN\n今日调度：127次 成功率98.4%\n已赔付：2笔 ¥43.50\n准备金余额：¥10,000\n\n[查看完整仪表盘](/trust)',
        }]);
        return;
      }

      // 场景4：入驻引导
      if (lower.includes('入驻')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '欢迎！你可以选择以下角色入驻：\n• 创作者：上传氛围包赚取分账\n• 开发者：发布智能体按调用量收益\n• 提供者：接入算力节点赚钱\n• 代理：推广产品获取佣金\n\n请告诉我你想成为哪一类？',
        }]);
        return;
      }

      // 场景5：氛围切换
      if (lower.includes('氛围') || lower.includes('切换')) {
        const toolMsg: Message = { id: Date.now() + '-tool', role: 'tool', content: '正在调用 switch_ambiance...', toolName: 'Aura引擎', toolStatus: 'calling' };
        setMessages(prev => [...prev, toolMsg]);
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === toolMsg.id ? { ...m, toolStatus: 'success', content: '✅ 已切换至MODE_B（午夜高潮），BPM 128→138，灯光频闪联动。' } : m));
        }, 1500);
        return;
      }

      // 场景6：紧急停止
      if (lower.includes('停止') || lower.includes('急停')) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ 紧急停止已触发！所有AI任务已暂停，系统已回滚至安全状态。',
        }]);
        return;
      }

      // 默认回复
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '我收到了。你可以具体描述需求，例如"部署GPU"、"查信任"、"申请入驻"，或直接上传文件让我处理。',
      }]);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 900, margin: '0 auto', padding: '20px 0' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>星火智能体 · Orca</h1>

      {/* 任务完成推送通知 */}
      {notifications.length > 0 && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                background: n.type === 'success' ? '#d1fae5' : '#dbeafe',
                color: n.type === 'success' ? '#065f46' : '#1e40af',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: 14,
                fontWeight: 500,
                animation: 'slideIn 0.3s ease',
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}

      {/* 消息列表 */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid var(--border-color)' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {/* 任务确认卡片 */}
            {msg.role === 'task-confirm' && !msg.taskConfirmed && (
              <div style={{
                maxWidth: '80%',
                padding: '16px 20px',
                borderRadius: 12,
                background: '#fef3c7',
                border: '2px solid #f59e0b',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
              }}>
                {msg.content}
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={() => confirmTask(msg.taskId!)} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
                    确认托管
                  </button>
                  <button onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))} style={{ padding: '8px 20px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 任务完成结果 */}
            {(msg.role === 'task-result' || (msg.role === 'task-confirm' && msg.taskConfirmed)) && (
              <div style={{
                maxWidth: '80%',
                padding: '14px 20px',
                borderRadius: 12,
                background: '#d1fae5',
                border: '1px solid #10b981',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
              }}>
                {msg.content}
              </div>
            )}

            {/* 普通消息 */}
            {msg.role !== 'task-confirm' && msg.role !== 'task-result' && (
              <div style={{
                maxWidth: '80%',
                padding: '10px 16px',
                borderRadius: 12,
                background: msg.role === 'user' ? 'var(--btn-primary-bg)' : msg.role === 'tool' ? '#fef3c7' : 'var(--bg-card)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                border: msg.role === 'tool' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.role === 'tool' && (
                  <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 8 }}>{msg.toolName}</span>
                    {msg.toolStatus === 'calling' ? <span style={{ fontSize: 11 }}>⏳ 调用中...</span> : <span style={{ fontSize: 11, color: '#16a34a' }}>✅ 完成</span>}
                  </div>
                )}
                {msg.file && (
                  <div style={{ marginBottom: 6, fontSize: 12, background: '#e5e7eb', padding: '4px 8px', borderRadius: 6 }}>
                    📎 {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
                {msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 文件预览 */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          {files.map((file, i) => (
            <div key={i} style={{ background: '#e5e7eb', padding: '6px 10px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              📎 {file.name}
              <span onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ cursor: 'pointer', marginLeft: 4 }}>✕</span>
            </div>
          ))}
        </div>
      )}

      {/* 高级输入区域 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '12px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
        }}
      >
        <label style={{ cursor: 'pointer', padding: '8px 4px', fontSize: 20, lineHeight: 1 }}>
          📎
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} multiple />
        </label>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述需求，或拖拽文件到此处..."
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            background: 'transparent',
            color: 'var(--text-primary)',
            maxHeight: 150,
            lineHeight: 1.5,
            fontFamily: 'inherit',
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: '8px 20px',
            background: 'var(--btn-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 14,
            whiteSpace: 'nowrap',
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
}