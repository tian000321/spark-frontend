'use client';
import { useState } from 'react';

const faqs = [
  { q: '如何入驻星火平台？', a: '点击导航栏“入驻”下拉菜单，选择对应角色（创作者/开发者/提供者/代理），填写申请表单并签署电子协议，审核通过后即可开通后台。' },
  { q: '创作者如何获得收益？', a: '上传原创氛围包到平台，酒吧等场所调用后你将获得70%分账，前10个包100%分账。每月5日结算。' },
  { q: '开发者如何发布智能体？', a: '入驻开发者后，在后台“智能体管理”页面提交名称和能力描述，经合规审核后即可上架市场。' },
  { q: '提供者如何接入算力节点？', a: '入驻算力提供者后，在后台绑定节点信息，节点上线后自动接收任务。你获得首年95%任务收入。' },
  { q: '代理如何赚钱？', a: '代理可推广平台算力、智能体、氛围包。客户消费后，你按比例获取佣金（市级1%，县区3%，智能体代理2%）。' },
  { q: '提现需要什么条件？', a: '必须绑定本人实名的微信/支付宝/银行卡，提现金额从余额中扣除，预计1-2个工作日到账。' },
  { q: '氛围包审核要多久？', a: '一般1-3个工作日，沙箱测试通过并检查内容合规后上架。' },
  { q: '设备如何安装？', a: 'Aura Box 部署指南请联系你的专属运营经理，或查看硬件连接说明。' },
  { q: '出了问题怎么办？', a: '我们承诺按秒赔付。系统会自动检测故障并执行赔付。你也可以联系我们的人工客服。' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(f => f.q.includes(search) || f.a.includes(search));

  return (
    <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>帮助中心</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>常见问题与操作指南。找不到答案？去“星火智能体”页面直接问我。</p>

      <input placeholder="搜索问题..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: 24 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredFaqs.map((faq, i) => (
          <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ width: '100%', padding: '16px 20px', textAlign: 'left', border: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {faq.q}
              <span>{expanded === i ? '▲' : '▼'}</span>
            </button>
            {expanded === i && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p>没找到答案？</p>
        <a href="/chat" style={{ color: 'var(--btn-primary-bg)', fontWeight: 'bold' }}>去问问星火智能体吧 →</a>
      </div>
    </div>
  );
}