'use client';
import { useState } from 'react';

export default function TechCenterPage() {
  const [activeTab, setActiveTab] = useState('about');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviews, setReviews] = useState([
    { name: '张先生', date: '2026-05-05', text: '星火平台让我们的AI算力调度效率提升了300%，合规功能非常省心。', rating: 5 },
    { name: '李教授', date: '2026-05-03', text: '作为高校实验室，星火的智能体市场让我们的模型快速变现，强烈推荐。', rating: 5 },
    { name: '王总', date: '2026-04-28', text: '代理体系设计合理，收益透明，技术支持响应及时。', rating: 4 },
    { name: '赵工', date: '2026-04-20', text: '节点接入简单快捷，10分钟就完成了部署，首年免抽佣很实在。', rating: 5 },
  ]);

  const submitReview = () => {
    if (!reviewText.trim() || !reviewName.trim()) { alert('请填写姓名和评价内容'); return; }
    setReviews(prev => [{
      name: reviewName,
      date: new Date().toISOString().slice(0, 10),
      text: reviewText,
      rating: 5,
    }, ...prev]);
    setReviewText('');
    setReviewName('');
    alert('感谢您的评价！');
  };

  const tabs = [
    { key: 'about', label: '🏢 平台简介' },
    { key: 'product', label: '📦 产品介绍' },
    { key: 'support', label: '🔧 技术支持' },
    { key: 'contact', label: '📞 联系我们' },
    { key: 'review', label: '⭐ 评价区' },
  ];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    border: 'none',
    background: 'none',
    borderBottom: active ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: active ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: active ? 'bold' : 'normal',
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const sectionStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    padding: 24,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
    marginBottom: 16,
    lineHeight: 1.8,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--input-border)',
    borderRadius: 8,
    fontSize: 14,
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      {/* 头部 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 8 }}>
          🔧 技术交流中心
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          贵州星火算力科技有限公司 · 让每一次AI决策都经得起人类的审视与追问
        </p>
      </div>

      {/* 标签页导航 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto', justifyContent: 'center' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabStyle(activeTab === tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== 平台简介 ========== */}
      {activeTab === 'about' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>🏢 平台简介</h2>
          
          <p style={{ marginBottom: 12, fontSize: 15 }}>
            <strong>贵州星火算力科技有限公司</strong>成立于 2026 年，总部位于中国贵州省贵阳市，是一家专注于
            <strong>异构算力调度</strong>与<strong>多智能体协作</strong>的人工智能基础设施服务商。
          </p>
          
          <p style={{ marginBottom: 12, fontSize: 15 }}>
            公司自主研发的<strong>「星火算力AI智能体平台」</strong>是全球首个内建全合规链路的操作系统级产品，
            致力于为开发者、算力提供者和企业客户提供可信、高效、合规的AI计算服务。
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>🎯 核心定位</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}><strong>数字文明时代的信任基础设施</strong> —— 每一行AI输出都经得起审视与追问</li>
            <li style={{ marginBottom: 8 }}><strong>全球首个内建全合规链路</strong> —— 满足GDPR、个保法、EU AI Act等国际法规</li>
            <li style={{ marginBottom: 8 }}><strong>异构算力统一调度</strong> —— 支持NVIDIA、昇腾等多种GPU算力资源</li>
          </ul>

          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>🏆 资质与合规</h3>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>ISO/IEC 42001 人工智能管理体系认证</li>
            <li style={{ marginBottom: 8 }}>NIST AI RMF 风险管控框架遵循</li>
            <li style={{ marginBottom: 8 }}>EU AI Act 高风险AI系统合规准备</li>
            <li style={{ marginBottom: 8 }}>中国《生成式人工智能服务管理办法》完全合规</li>
            <li style={{ marginBottom: 8 }}>W3C DID/VC 去中心化身份与可验证凭证支持</li>
          </ul>
        </div>
      )}

      {/* ========== 产品介绍 ========== */}
      {activeTab === 'product' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>📦 产品介绍</h2>

          <div style={{ display: 'grid', gap: 16 }}>
            {/* 产品1 */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>💬 星火智能体 —— 对话式AI任务编排引擎</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                用户通过自然语言描述需求，系统自动解析意图、生成DAG任务图、调度最优算力资源执行。
                支持文件上传、远程托管操作。全流程触发合规边车，生成不可篡改的DecisionRecord。
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>核心特性：AI生成标识 · 数据出境管控 · 决策链审计 · 数字水印(C2PA)</p>
            </div>

            {/* 产品2 */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>🖥️ 算力节点市场 —— 全球异构算力调度网络</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                汇聚全球GPU算力资源，支持A100、RTX 4090、昇腾910B等多型号。提供者一键接入，首年0平台抽佣。
                系统自动进行MLPerf基准测试、合规四维评分，保障任务调度公平高效。
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>核心特性：动态评级 · 竞价/预留/按需混合调度 · 10秒沙箱清理 · eBPF实时监控</p>
            </div>

            {/* 产品3 */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>🤖 智能体市场 —— AI模型分发与变现平台</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                开发者可将训练好的AI模型打包发布为智能体，平台自动进行合规认证并签发W3C VC合规护照。
                用户可按合规等级、能力标签、价格筛选智能体，一键调用。
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>核心特性：合规护照 · 能力标签 · 在线测试 · 版本管理 · 调用统计</p>
            </div>

            {/* 产品4 */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>🤝 代理加盟体系 —— 区域算力推广与合作</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                市级代理（¥10,000/年）、县区代理（¥1,000/年）、智能体代理（¥1,000/个/年）。
                系统自动划定区域节点，按节点收入分润。代理负责推广平台并接入边缘节点，获得接入报酬。
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>核心特性：先缴费后开通 · 到期自动收回 · 解约无补偿 · 收益透明</p>
            </div>

            {/* 产品5 */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 8 }}>💰 钱包与收益系统 —— 毫分结算 · 实时透明</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                平台统一钱包充值，各角色（提供者/代理/开发者）按合约规则分润。
                内部使用BigInt整数运算避免浮点误差，事件溯源+Merkle审计保障每笔交易可追溯。
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>核心特性：毫分计量 · 事件溯源 · 定期Merkle审计 · 月度结算</p>
            </div>
          </div>
        </div>
      )}

      {/* ========== 技术支持 ========== */}
      {activeTab === 'support' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>🔧 技术支持</h2>

          <h3 style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>📚 常见问题</h3>

          {[
            { q: '如何接入节点？', a: '访问「节点入驻」页面，填写GPU型号、数量、网关地址等信息，提交申请后审核通过即可上线。首年免平台抽佣。' },
            { q: '如何发布智能体？', a: '先完成「开发者入驻」，审核通过后在开发者后台点击「发布新智能体」，填写名称、能力标签、单价等信息，提交后进入合规审核。' },
            { q: '代理费用如何缴纳？', a: '请先到「钱包」页面充值，然后在「代理加盟」页面提交申请，系统会自动从钱包扣除年费并开通代理权限。' },
            { q: '数据出境有什么要求？', a: '平台已内建合规边车，当任务涉及数据出境时，系统会自动弹出逐项授权弹窗，用户需逐项勾选同意后方可继续。所有授权可在个人中心随时撤回。' },
            { q: '如何查看决策记录？', a: '在Chat对话页，任务完成后会出现「查看决策记录」链接，点击可展开完整的时间轴，包含每一步的证据哈希和来源信息。' },
            { q: '被遗忘权如何行使？', a: '在「个人中心 → 数据管理」中点击「请求删除我的所有数据」，系统将标记删除并在30天内彻底清除，同时生成DataErasure DR存证。' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Q: {item.q}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>A: {item.a}</p>
            </div>
          ))}

          <h3 style={{ fontSize: 17, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>📖 开发文档</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            完整API文档、SDK使用指南、合规集成手册请访问：
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 4 }}>API 文档：<code>GET /v1/audit/:task_id</code> · <code>POST /v1/conversation</code></li>
            <li style={{ marginBottom: 4 }}>SDK 下载：星火开源验证库 (Apache 2.0)</li>
            <li style={{ marginBottom: 4 }}>合规手册：C01-C22 检查清单</li>
          </ul>
        </div>
      )}

      {/* ========== 联系我们 ========== */}
      {activeTab === 'contact' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>📞 联系我们</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>🏢 公司名称</p>
              <p style={{ fontSize: 15 }}>贵州星火算力科技有限公司</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>📍 总部地址</p>
              <p style={{ fontSize: 15 }}>贵州省贵阳市贵安新区</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>📞 产品工程师</p>
              <p style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>
                <a href="tel:15329557310" style={{ color: 'var(--btn-primary-bg)', textDecoration: 'none' }}>153 2955 7310</a>
              </p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>📧 电子邮箱</p>
              <p style={{ fontSize: 14 }}>support@sparkcompute.com</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>🌐 官方网站</p>
              <p style={{ fontSize: 14 }}>https://sparkcompute.com</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>⏰ 工作时间</p>
              <p style={{ fontSize: 14 }}>周一至周五 9:00 - 18:00</p>
            </div>
          </div>

          <div style={{ background: 'var(--badge-blue-bg)', padding: 16, borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--badge-blue-text)' }}>
              💡 紧急技术支持请拨打产品工程师电话：<strong>153 2955 7310</strong>
            </p>
          </div>
        </div>
      )}

      {/* ========== 评价区 ========== */}
      {activeTab === 'review' && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>⭐ 用户评价</h2>

          {/* 提交评价 */}
          <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 12 }}>写下您的评价</h3>
            <input
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              placeholder="您的姓名"
              style={{ ...inputStyle, marginBottom: 10 }}
            />
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="分享您的使用体验..."
              rows={3}
              style={{ ...inputStyle, marginBottom: 10, resize: 'vertical' }}
            />
            <button
              onClick={submitReview}
              style={{ padding: '8px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
            >
              提交评价
            </button>
          </div>

          {/* 评价列表 */}
          {reviews.map((review, idx) => (
            <div key={idx} style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{review.name}</span>
                <span style={{ color: '#F57C00' }}>{'⭐'.repeat(review.rating)}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{review.text}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{review.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}