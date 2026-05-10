'use client';
import { useState } from 'react';

interface Props {
  role: string;
  onSign: () => void;
}

export default function SignContract({ role, onSign }: Props) {
  const [agreed, setAgreed] = useState(false);

  const contractText: Record<string, string> = {
    creator: '《星火科技创作者服务协议》',
    developer: '《星火科技开发者服务协议》',
    provider: '《星火科技算力提供者服务协议》',
    agent: '《星火科技代理加盟协议》',
  };

  const handleSign = () => {
    if (!agreed) return alert('请先阅读并同意协议');
    onSign();
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8 }}>
        <p><strong>{contractText[role] || '《星火科技平台服务协议》'}</strong></p>
        <p>欢迎加入星火科技平台。作为{role === 'creator' ? '创作者' : role === 'developer' ? '开发者' : role === 'provider' ? '算力提供者' : '代理商'}，您需遵守以下条款：</p>
        <ol>
          <li>您保证提交的所有信息真实有效。</li>
          <li>您发布的内容（氛围包、智能体、算力资源）须符合法律法规，不侵犯第三方权益。</li>
          <li>收益分账比例按平台规则执行（创作者/开发者 70%，平台 30%；提供者首年 95%）。</li>
          <li>平台有权对违规行为进行处理，包括下架内容、冻结收益、终止合作等。</li>
          <li>本协议解释权归星火科技所有。</li>
        </ol>
        <p>签署日期：{new Date().toLocaleDateString()}</p>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>我已阅读并同意以上协议</span>
      </label>
      <button onClick={handleSign} style={{
        width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff',
        border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed'
      }}>
        确认签署
      </button>
    </div>
  );
}