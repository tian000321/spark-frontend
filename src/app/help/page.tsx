'use client';
import { useState } from 'react';
import SparkCard from '@/components/ui/SparkCard';
import SparkInput from '@/components/ui/SparkInput';

const faqs = [
  { q: '如何加入星火精英招募？', a: '点击导航栏“精英招募”或侧边栏“⭐ 精英招募”，选择创作者、开发者、节点提供者或代理商角色，填写表单并签署电子协议。审核通过后即可开通后台。' },
  { q: '创作者如何上传氛围包？', a: '签约创作者后，在后台“上传氛围包”页面填写名称、风格、BPM范围，上传.vibe JSON和音频文件。审核通过后进入嗨吧市场，按调用次数获得70%分账。' },
  { q: '开发者如何发布智能体？', a: '签约开发者后，在后台“智能体管理”页面提交名称和能力描述，经合规审核后上架智能体市场。调用产生收益，分账比例70%。' },
  { q: '算力提供者如何接入节点？', a: '签约节点提供者后，在后台绑定节点信息（GPU型号/地区/网络带宽），节点上线后自动接收任务。首年可获得95%任务收入。' },
  { q: '代理商如何赚钱？', a: '代理可推广算力、智能体和氛围包。客户消费后你按比例获取佣金：市级代理1%调度量，县区代理3%。还可以直接招揽场所使用嗨吧控台。' },
  { q: '提现需要什么条件？', a: '必须绑定本人实名的微信/支付宝/银行卡，并在钱包页面设置支付密码。提现金额从可用余额中扣除，预计1-2个工作日到账。' },
  { q: '氛围包审核要多久？', a: '通常1-3个工作日。通过沙箱模拟测试并且内容合规后即可上架。' },
  { q: '设备如何安装？', a: 'Aura Box连接DMX灯光和音响，Soul Knob旋钮按压急停。详细部署指南请联系运营经理，或在帮助中心下载说明书。' },
  { q: '出了问题怎么办？', a: '平台承诺按秒赔付。系统自动检测故障并执行赔付。你也可直接联系客服。' },
  { q: '什么是信任准备金？', a: '平台设立的独立赔付储备金，当前余额¥10,000。如果低于¥8,000将触发全局熔断保护。' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(f => f.q.includes(search) || f.a.includes(search));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>帮助中心</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>
        常见问题与操作指南。找不到答案？问问右下角的Orca助手。
      </p>

      <SparkInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索问题..."
        style={{ marginBottom: 24 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredFaqs.map((faq, i) => (
          <SparkCard key={i} padding={16} onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 500, fontSize: 'var(--spark-font-size-md)' }}>
              <span>{faq.q}</span>
              <span style={{ fontSize: 14 }}>{expanded === i ? '▲' : '▼'}</span>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </SparkCard>
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--spark-text-secondary)' }}>没找到答案？</p>
        <a href="/" style={{ color: 'var(--spark-brand-light)', fontWeight: 500 }} onClick={() => window.dispatchEvent(new CustomEvent('open-orca'))}>问问星火智能体吧 →</a>
      </div>
    </div>
  );
}