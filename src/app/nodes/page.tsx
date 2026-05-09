'use client';
import { useState, useEffect } from 'react';

// 模拟异常检测规则
const checkNodeHealth = (node: any) => {
  const issues: string[] = [];
  if (node.temperature > 85) issues.push('GPU温度过高');
  if (node.networkStatus === '中断') issues.push('网络中断');
  if (node.computeErrors > 3) issues.push('计算错误过多');
  return issues;
};

// 自动处理异常节点
const autoHandleIssue = (node: any) => {
  const issues = checkNodeHealth(node);
  if (issues.length === 0) return node;

  const updated = { ...node };
  if (issues.includes('GPU温度过高')) {
    updated.status = '限流';
    updated.throttledUntil = Date.now() + 300000; // 5分钟限流
  }
  if (issues.includes('网络中断')) {
    updated.status = '离线';
    updated.score = Math.max(0, updated.score - 0.5);
    updated.alertMessage = '网络中断，已自动下线并扣分';
  }
  if (issues.includes('计算错误过多')) {
    updated.status = '隔离';
    updated.isolatedUntil = Date.now() + 600000; // 10分钟隔离
    updated.score = Math.max(0, updated.score - 1.0);
    updated.alertMessage = '连续计算错误，已自动隔离并扣分';
  }
  return updated;
};

export default function NodesPage() {
  const [isProvider, setIsProvider] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [nodes, setNodes] = useState<any[]>([
    { id: 'node-001', gpu: 'NVIDIA A100 80GB', status: '在线', rating: 4.8, tasks: 342, revenue: '¥1,250.00', uptime: '99.7%', temperature: 72, networkStatus: '正常', computeErrors: 1, score: 4.8, alertMessage: null },
    { id: 'node-002', gpu: 'NVIDIA RTX 4090 24GB', status: '在线', rating: 4.2, tasks: 156, revenue: '¥680.00', uptime: '95.3%', temperature: 88, networkStatus: '正常', computeErrors: 2, score: 4.2, alertMessage: null },
    { id: 'node-003', gpu: '昇腾 910B 64GB', status: '在线', rating: 4.5, tasks: 89, revenue: '¥420.00', uptime: '98.1%', temperature: 65, networkStatus: '中断', computeErrors: 4, score: 4.5, alertMessage: null },
    { id: 'node-004', gpu: 'NVIDIA A100 40GB', status: '在线', rating: 4.0, tasks: 210, revenue: '¥890.00', uptime: '97.2%', temperature: 78, networkStatus: '正常', computeErrors: 0, score: 4.0, alertMessage: null },
  ]);
  const [balance, setBalance] = useState(2847.35);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('¥3,240.00');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  // 定期检测节点健康状态
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes(prev => {
        let hasChange = false;
        const updated = prev.map(node => {
          const processed = autoHandleIssue(node);
          if (processed.status !== node.status || processed.alertMessage !== node.alertMessage) {
            hasChange = true;
            if (processed.alertMessage && processed.alertMessage !== node.alertMessage) {
              setAlerts(prevAlerts => [...prevAlerts, `${node.id}: ${processed.alertMessage}`]);
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 5000);
            }
          }
          return processed;
        });
        return hasChange ? updated : prev;
      });
    }, 5000); // 每5秒检测一次

    return () => clearInterval(timer);
  }, []);

  // 清除单个告警
  const clearAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  const handleWithdraw = async () => {
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    if (val > balance) { alert('余额不足'); return; }
    setBalance(prev => prev - val);
    setWithdrawAmount('');
    alert('提现申请已提交');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)',
    borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)',
    boxSizing: 'border-box',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', border: 'none', background: 'none',
    borderBottom: active ? '3px solid var(--btn-primary-bg)' : '3px solid transparent',
    color: active ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
    fontWeight: active ? 'bold' : 'normal', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
  });

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)', padding: 20, borderRadius: 12,
    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)',
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '在线': return { bg: 'var(--badge-green-bg)', text: 'var(--badge-green-text)' };
      case '限流': return { bg: 'var(--badge-orange-bg)', text: 'var(--badge-orange-text)' };
      case '隔离': return { bg: 'var(--badge-red-bg)', text: 'var(--badge-red-text)' };
      case '离线': return { bg: '#f5f5f5', text: '#666' };
      default: return { bg: '#f5f5f5', text: '#666' };
    }
  };

  const onlineCount = nodes.filter(n => n.status === '在线').length;
  const avgRating = nodes.reduce((s, n) => s + n.score, 0) / nodes.length;
  const totalTasks = nodes.reduce((s, n) => s + n.tasks, 0);

  // ========== 非提供者：申请表单 ==========
  if (!isProvider) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>🖥️ 算力节点入驻</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>将您的 GPU 服务器接入星火网络，赚取收益。首年 0 平台抽佣。</p>
        <form onSubmit={(e) => { e.preventDefault(); setIsProvider(true); alert('入驻申请已提交！'); }} style={{ ...cardStyle, padding: 30 }}>
          <label style={labelStyle}>联系人姓名 *</label>
          <input required style={{ ...inputStyle, marginBottom: 16 }} />
          <label style={labelStyle}>GPU 型号 *</label>
          <select required style={{ ...inputStyle, marginBottom: 16 }}><option>A100</option><option>RTX 4090</option><option>昇腾 910B</option></select>
          <label style={labelStyle}>数量 *</label>
          <input type="number" required style={{ ...inputStyle, marginBottom: 16 }} />
          <label style={labelStyle}>网关地址 *</label>
          <input required style={{ ...inputStyle, marginBottom: 24 }} placeholder="例如：192.168.1.100" />
          <button type="submit" style={{ width: '100%', padding: 14, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>提交申请</button>
        </form>
      </div>
    );
  }

  // ========== 提供者后台 ==========
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 24 }}>🖥️ 算力提供者后台</h1>

      {/* 告警横幅 */}
      {showAlert && alerts.length > 0 && (
        <div style={{ background: 'var(--badge-red-bg)', padding: 12, borderRadius: 8, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--badge-red-text)', fontSize: 13 }}>⚠️ {alerts[alerts.length - 1]}</span>
          <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', color: 'var(--badge-red-text)', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
      )}

      {/* 标签页 */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('dashboard')} style={tabStyle(activeTab === 'dashboard')}>📊 节点看板</button>
        <button onClick={() => setActiveTab('revenue')} style={tabStyle(activeTab === 'revenue')}>💰 收益与提现</button>
      </div>

      {/* 节点看板 */}
      {activeTab === 'dashboard' && (
        <div>
          {/* 指标卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>在线节点</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#2E7D32' }}>{onlineCount}/{nodes.length}</p>
            </div>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>平均评分</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#F57C00' }}>{avgRating.toFixed(1)}</p>
            </div>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>累计任务</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#1565C0' }}>{totalTasks}</p>
            </div>
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>累计收益</p>
              <p style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>{totalRevenue}</p>
            </div>
          </div>

          {/* 节点列表 */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: 10 }}>节点ID</th>
                  <th style={{ padding: 10 }}>GPU 型号</th>
                  <th style={{ padding: 10 }}>状态</th>
                  <th style={{ padding: 10 }}>温度</th>
                  <th style={{ padding: 10 }}>网络</th>
                  <th style={{ padding: 10 }}>计算错误</th>
                  <th style={{ padding: 10 }}>评分</th>
                  <th style={{ padding: 10 }}>任务数</th>
                  <th style={{ padding: 10 }}>收益</th>
                  <th style={{ padding: 10 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => (
                  <tr key={node.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 10, fontFamily: 'monospace', fontSize: 12 }}>{node.id}</td>
                    <td style={{ padding: 10, fontWeight: 500 }}>{node.gpu}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ ...getStatusStyle(node.status), padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>
                        {node.status}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: node.temperature > 80 ? '#D32F2F' : node.temperature > 70 ? '#F57C00' : '#2E7D32' }}>
                        {node.temperature}°C
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: node.networkStatus === '中断' ? '#D32F2F' : '#2E7D32' }}>
                        {node.networkStatus}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: node.computeErrors > 3 ? '#D32F2F' : '#666' }}>
                        {node.computeErrors}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: node.score < 3 ? '#D32F2F' : node.score < 4 ? '#F57C00' : '#2E7D32', fontWeight: 'bold' }}>
                        {node.score.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: 10 }}>{node.tasks}</td>
                    <td style={{ padding: 10, fontWeight: 500 }}>{node.revenue}</td>
                    <td style={{ padding: 10 }}>
                      {node.alertMessage && (
                        <span style={{ fontSize: 11, color: 'var(--badge-red-text)' }} title={node.alertMessage}>⚠️</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 收益与提现 */}
      {activeTab === 'revenue' && (
        <div>
          <div style={{ ...cardStyle, textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>累计收益</p>
            <p style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--btn-primary-bg)', marginTop: 8 }}>{totalRevenue}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>💸 提现</h3>
            <p style={{ marginBottom: 10, color: 'var(--text-muted)' }}>可用余额：<strong style={{ color: 'var(--text-primary)' }}>¥{balance.toFixed(2)}</strong></p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="请输入提现金额"
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            <button
              onClick={handleWithdraw}
              style={{ padding: '10px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
            >
              确认提现
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14, color: 'var(--text-primary)',
};