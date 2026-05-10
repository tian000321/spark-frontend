'use client';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string;
  toolStatus?: 'calling' | 'success' | 'error';
}

const quickActions = [
  { label: '部署GPU', prompt: '帮我找最便宜的A100，跑12小时' },
  { label: '查信任', prompt: '查看信任仪表盘' },
  { label: '申请入驻', prompt: '我想成为创作者入驻' },
  { label: '切换氛围', prompt: '把酒吧切换成午夜高潮模式' },
  { label: '紧急停止', prompt: '立即停止所有任务' },
  { label: '提现', prompt: '帮我提现收益' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好，我是Orca，你的AI编排员。\n\n你可以：\n• 直接说“部署GPU”来调用算力\n• 说“查信任”查看赔付与审计数据\n• 说“申请入驻”我会引导你完成入驻流程\n• 或直接描述你的需求，我会为你处理。',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // 模拟智能体回复与工具调用
    const lower = input.toLowerCase();
    setTimeout(() => {
      if (lower.includes('部署') || lower.includes('gpu')) {
        const toolMsg: Message = { id: Date.now() + '1', role: 'tool', content: '正在调用 find_cheapest_gpu...', toolName: '算力雷达', toolStatus: 'calling' };
        setMessages(prev => [...prev, toolMsg]);
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === toolMsg.id ? { ...m, toolStatus: 'success', content: '✅ 最优方案已找到：A100 80GB，¥2.20/小时，延迟15ms，供应商信誉0.92。正在部署...' } : m));
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '部署完成！SSH密钥已生成：ssh spark@192.168.1.10\n搞砸了赔你双倍，放心跑。' }]);
          }, 1000);
        }, 1500);
      } else if (lower.includes('信任') || lower.includes('仪表盘')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '当前信任状态：🟢 GREEN\n今日调度：127次 成功率98.4%\n已赔付：2笔 ¥43.50\n准备金余额：¥10,000\n\n[查看完整仪表盘](/trust)' }]);
      } else if (lower.includes('入驻')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '欢迎！你可以选择以下角色入驻：\n• 创作者：上传氛围包赚取分账\n• 开发者：发布智能体按调用量收益\n• 提供者：接入算力节点赚钱\n• 代理：推广产品获取佣金\n\n请告诉我你想成为哪一类？' }]);
      } else if (lower.includes('氛围') || lower.includes('切换')) {
        const toolMsg: Message = { id: Date.now() + '2', role: 'tool', content: '正在调用 switch_ambiance...', toolName: 'Aura引擎', toolStatus: 'calling' };
        setMessages(prev => [...prev, toolMsg]);
        setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === toolMsg.id ? { ...m, toolStatus: 'success', content: '✅ 已切换至MODE_B（午夜高潮），BPM 128→138，灯光频闪联动。查看控制台：[/console](/console)' } : m));
        }, 1500);
      } else if (lower.includes('停止') || lower.includes('急停')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '⚠️ 紧急停止已触发！所有AI任务已暂停，系统已回滚至安全状态。' }]);
      } else if (lower.includes('提现')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '请先确保你已经绑定了提现账户。然后告诉我你要提现的金额（例如“提现500元”），我会帮你发起申请。' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: '我收到了。不过你说的内容我需要确认一下。你可以试试快捷操作，或者告诉我具体需求（例如“部署GPU”、“查信任”）。' }]);
      }
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 900, margin: '0 auto', padding: '20px 0' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>星火智能体 · Orca</h1>
      
      {/* 快捷操作 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {quickActions.map(action => (
          <button key={action.label} onClick={() => setInput(action.prompt)}
            style={{ padding: '6px 14px', border: '1px solid var(--input-border)', borderRadius: 20, background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {action.label}
          </button>
        ))}
      </div>

      {/* 消息列表 */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid var(--border-color)' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '10px 16px', borderRadius: 12,
              background: msg.role === 'user' ? 'var(--btn-primary-bg)' : msg.role === 'tool' ? '#fef3c7' : 'var(--bg-card)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              border: msg.role === 'tool' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word'
            }}>
              {msg.role === 'tool' && (
                <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 8 }}>{msg.toolName}</span>
                  {msg.toolStatus === 'calling' ? <span style={{ fontSize: 11 }}>⏳ 调用中...</span> : <span style={{ fontSize: 11, color: '#16a34a' }}>✅ 完成</span>}
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="描述需求，或说“帮我远程操作..”" 
          style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--input-border)', borderRadius: 12, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <button onClick={handleSend} style={{ padding: '12px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>
          发送
        </button>
      </div>
    </div>
  );
}