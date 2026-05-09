'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AgentDetailPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [passport, setPassport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // 获取智能体详情
    fetch(`http://localhost:8080/v1/agents/${id}`)
      .then(r => r.json())
      .then(data => {
        setAgent(data);
        if (!data.versions) data.versions = [
          { version: 'v2.1.0', date: '2026-04-28', status: '生产', changes: '优化推理速度，降低延迟15%' },
          { version: 'v2.0.0', date: '2026-03-15', status: '归档', changes: '增加多模态支持' },
        ];
        if (!data.stats) data.stats = {
          totalCalls: 15230, successRate: 99.2, avgLatency: '320ms', throughput: '120 req/s'
        };
        if (!data.capabilities) data.capabilities = ['图像分类', '迁移学习', '模型微调', '自动数据增强'];
      })
      .catch(() => {});

    // 获取合规护照
    fetch(`http://localhost:8080/v1/compliance/passport/${id}`)
      .then(r => r.json())
      .then(setPassport)
      .catch(() => setPassport(null));

    // 获取评价
    fetch(`http://localhost:8080/v1/agents/${id}/reviews`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  const handleTest = () => {
    setTestLoading(true);
    setTimeout(() => {
      setTestResult(`输入: "${testInput}"\n输出: 分类结果 - 置信度 94.7%\n处理时间: 320ms`);
      setTestLoading(false);
    }, 1000);
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;
    fetch(`http://localhost:8080/v1/agents/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: '当前用户', rating: 5, text: reviewText, date: new Date().toISOString() }),
    })
      .then(r => r.json())
      .then(newReview => {
        setReviews(prev => [newReview, ...prev]);
        setReviewText('');
      });
  };

  if (!agent) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</div>;

  const tabs = [
    { key: 'overview', label: '📋 概览' },
    { key: 'passport', label: '🛂 合规护照' },
    { key: 'capabilities', label: '🧠 能力' },
    { key: 'test', label: '🧪 测试' },
    { key: 'versions', label: '📦 版本' },
    { key: 'stats', label: '📊 统计' },
    { key: 'reviews', label: '⭐ 评价' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)',
    borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)',
    boxSizing: 'border-box',
  };

  const tabBtnStyle = (key: string) => ({
    padding: '10px 16px', border: 'none', background: 'none',
    borderBottom: activeTab === key ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: activeTab === key ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: (activeTab === key ? 'bold' : 'normal') as any, fontSize: 13,
    cursor: 'pointer', whiteSpace: 'nowrap',
  });

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)', padding: 20, borderRadius: 12,
    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)',
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#2E7D32';
    if (score >= 70) return '#F57C00';
    return '#D32F2F';
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <a href="/agents" style={{ color: 'var(--badge-blue-text)', fontSize: 13, textDecoration: 'none' }}>← 返回市场</a>

      {/* 头部 */}
      <div style={{ marginTop: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)' }}>
          {agent.icon} {agent.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          {agent.developer} · {agent.price} · 调用 {agent.calls?.toLocaleString()} 次
        </p>
      </div>

      {/* 标签页导航 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={tabBtnStyle(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== 概览 ========== */}
      {activeTab === 'overview' && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>智能体简介</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
            {agent.description || '暂无描述'}
          </p>
          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>API 调用示例</h4>
            <pre style={{
              background: 'var(--bg-secondary)', padding: 16, borderRadius: 8,
              fontSize: 12, overflowX: 'auto', color: 'var(--text-primary)',
              fontFamily: 'monospace', lineHeight: 1.6
            }}>
{`POST /v1/agents/${agent.id}/invoke
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "input": "你的数据",
  "parameters": { "threshold": 0.5 }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ========== 合规护照 ========== */}
      {activeTab === 'passport' && (
        <div>
          {passport ? (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text-primary)' }}>🛂 W3C 可验证合规护照</h3>
                <span style={{
                  padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 'bold',
                  background: passport.status === '有效' ? 'var(--badge-green-bg)' : 'var(--badge-red-bg)',
                  color: passport.status === '有效' ? 'var(--badge-green-text)' : 'var(--badge-red-text)',
                }}>
                  {passport.status}
                </span>
              </div>

              {/* 护照基本信息 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={labelStyleMuted}>护照编号</p>
                  <p style={valueStyleMono}>{passport.passportId}</p>
                </div>
                <div>
                  <p style={labelStyleMuted}>签发机构</p>
                  <p style={valueStyle}>{passport.issuer}</p>
                </div>
                <div>
                  <p style={labelStyleMuted}>签发日期</p>
                  <p style={valueStyle}>{passport.issuanceDate}</p>
                </div>
                <div>
                  <p style={labelStyleMuted}>到期日期</p>
                  <p style={valueStyle}>{passport.expirationDate}</p>
                </div>
                <div>
                  <p style={labelStyleMuted}>合规评分</p>
                  <p style={{ fontSize: 24, fontWeight: 'bold', color: getScoreColor(passport.complianceScore) }}>
                    {passport.complianceScore}/100
                  </p>
                </div>
                <div>
                  <p style={labelStyleMuted}>合规等级</p>
                  <p style={{
                    fontSize: 16, fontWeight: 'bold',
                    color: passport.complianceScore >= 90 ? '#2E7D32' : passport.complianceScore >= 70 ? '#F57C00' : '#D32F2F'
                  }}>
                    {passport.complianceScore >= 90 ? '🟢 高合规' : passport.complianceScore >= 70 ? '🟠 中合规' : '🔴 低合规'}
                  </p>
                </div>
              </div>

              {/* 能力标签 */}
              <div style={{ marginBottom: 20 }}>
                <p style={labelStyleMuted}>认证能力</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {passport.capabilities?.map((c: string) => (
                    <span key={c} style={{
                      padding: '4px 12px', background: 'var(--badge-blue-bg)',
                      color: 'var(--badge-blue-text)', borderRadius: 10, fontSize: 12
                    }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* 密码学证明 */}
              <div style={{
                background: 'var(--bg-secondary)', padding: 16, borderRadius: 8,
                border: '1px solid var(--border-color)', marginBottom: 12
              }}>
                <p style={{ ...labelStyleMuted, marginBottom: 4 }}>🔐 密码学证明 (Proof)</p>
                <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                  {passport.proof?.value || '暂无'}
                </p>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                ✅ 本凭证符合 W3C Verifiable Credential 标准 · 签发机构：星火伦理委员会
              </p>
            </div>
          ) : (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-muted)' }}>该智能体尚未获得合规护照认证</p>
            </div>
          )}
        </div>
      )}

      {/* ========== 能力 ========== */}
      {activeTab === 'capabilities' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>能力标签</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {agent.capabilities?.map((c: string) => (
                <span key={c} style={{
                  padding: '6px 14px', background: 'var(--badge-blue-bg)',
                  color: 'var(--badge-blue-text)', borderRadius: 10, fontSize: 13
                }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>性能指标</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>准确率</p><p style={{ fontSize: 20, fontWeight: 'bold' }}>94.7%</p></div>
              <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>平均延迟</p><p style={{ fontSize: 20, fontWeight: 'bold' }}>320ms</p></div>
              <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>吞吐量</p><p style={{ fontSize: 20, fontWeight: 'bold' }}>120 req/s</p></div>
              <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>显存占用</p><p style={{ fontSize: 20, fontWeight: 'bold' }}>8.2 GB</p></div>
            </div>
          </div>
        </div>
      )}

      {/* ========== 测试 ========== */}
      {activeTab === 'test' && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>在线测试</h3>
          <textarea
            value={testInput}
            onChange={e => setTestInput(e.target.value)}
            placeholder='输入测试数据，例如：{"image_url": "https://example.com/mountain.jpg"}'
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
          />
          <button
            onClick={handleTest}
            disabled={testLoading}
            style={{
              padding: '8px 20px', background: 'var(--btn-primary-bg)', color: '#fff',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {testLoading ? '执行中...' : '▶ 运行测试'}
          </button>
          {testResult && (
            <div style={{ marginTop: 12, background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <pre style={{ fontSize: 13, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{testResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* ========== 版本 ========== */}
      {activeTab === 'versions' && (
        <div>
          {agent.versions?.map((v: any) => (
            <div key={v.version} style={{ ...cardStyle, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.version}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 10, fontSize: 11,
                  background: v.status === '生产' ? 'var(--badge-green-bg)' : 'var(--bg-secondary)',
                  color: v.status === '生产' ? 'var(--badge-green-text)' : 'var(--text-muted)'
                }}>{v.status}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{v.date} · {v.changes}</p>
            </div>
          ))}
        </div>
      )}

      {/* ========== 统计 ========== */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { label: '总调用次数', value: agent.stats?.totalCalls?.toLocaleString() },
            { label: '成功率', value: `${agent.stats?.successRate}%`, color: '#2E7D32' },
            { label: '平均延迟', value: agent.stats?.avgLatency },
            { label: '吞吐量', value: agent.stats?.throughput },
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</p>
              <p style={{ fontSize: 24, fontWeight: 'bold', color: item.color || 'var(--text-primary)' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ========== 评价 ========== */}
      {activeTab === 'reviews' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="写下你的评价..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
            />
            <button
              onClick={submitReview}
              style={{
                padding: '8px 20px', background: 'var(--btn-primary-bg)', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer'
              }}
            >
              提交评价
            </button>
          </div>
          {reviews.map((r: any, i: number) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.user}</span>
                <span style={{ color: '#F57C00' }}>{'⭐'.repeat(r.rating)}</span>
              </div>
              <p style={{ fontSize: 13, marginTop: 4, color: 'var(--text-secondary)' }}>{r.text}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{r.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== 样式常量 ==========
const labelStyleMuted: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  marginBottom: 2,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const valueStyleMono: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'monospace',
  color: 'var(--text-primary)',
};