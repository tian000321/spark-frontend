'use client';
import { useState, useEffect } from 'react';
import { ProviderContract } from '@/components/onboarding/ContractText';

type Status = 'none' | 'pending' | 'approved' | 'signed';
type NodeStatus = 'online' | 'offline';

interface ComputeNode {
  id: string;
  name: string;
  gpu: string;
  location: string;
  status: NodeStatus;
  tasks: number;
  revenue: number;
}

export default function ProviderPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gpuType, setGpuType] = useState('');
  const [location, setLocation] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'nodes' | 'revenue' | 'withdraw' | 'stats'>('nodes');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  const [nodes, setNodes] = useState<ComputeNode[]>([
    { id: '1', name: 'A100-集群-01', gpu: 'A100×4', location: '北京', status: 'online', tasks: 340, revenue: 12500 },
    { id: '2', name: 'RTX4090-工作站', gpu: 'RTX 4090×2', location: '上海', status: 'online', tasks: 180, revenue: 4200 },
    { id: '3', name: 'A100-备用节点', gpu: 'A100×1', location: '深圳', status: 'offline', tasks: 50, revenue: 800 },
  ]);

  const [chartData] = useState([3400, 2900, 4100, 3800, 3600, 4500, 4200]);

  useEffect(() => {
    const saved = localStorage.getItem('provider_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('provider_status', s);
  };

  const handleToggleNode = (id: string) => {
    setNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, status: n.status === 'online' ? 'offline' as const : 'online' as const } : n))
    );
  };

  const handleBindAccount = () => {
    const type = (document.getElementById('accountType') as HTMLSelectElement)?.value;
    const aname = (document.getElementById('accountName') as HTMLInputElement)?.value;
    const number = (document.getElementById('accountNumber') as HTMLInputElement)?.value;
    if (!aname || !number) return alert('请填写完整的账户信息');
    localStorage.setItem('withdraw_account', JSON.stringify({ type, name: aname, number }));
    alert(`${type} 账户绑定成功！`);
  };

  const handleWithdraw = () => {
    const account = localStorage.getItem('withdraw_account');
    if (!account) return alert('请先绑定提现账户');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return alert('请输入有效金额');
    if (amount > revenueTotal) return alert('余额不足');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  // ===== 未申请 =====
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>🖥️ 节点入驻申请</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="真实姓名 / 企业名称" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="联系电话" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="GPU 型号 / 数量（如 A100×4）" value={gpuType} onChange={e => setGpuType(e.target.value)} style={inputStyle} />
        <input placeholder="所在机房 / 地区" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《算力提供者服务协议》
        </label>
        <button onClick={() => {
          if (!name || !phone) return alert('请填写姓名和电话');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('provider_status_name', name);
          localStorage.setItem('provider_status_phone', phone);
          localStorage.setItem('provider_status_detail', gpuType + ' / ' + location);
          localStorage.setItem('provider_status_time', new Date().toLocaleString());
          updateStatus('pending');
        }} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
          提交申请
        </button>
      </div>
    </div>
  );

  // ===== 审核中 =====
  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的入驻申请已提交，平台将在 1-3 个工作日内审核。</p>
      <button onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }} style={{ marginTop: 20, padding: '8px 20px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>
        模拟审核通过
      </button>
    </div>
  );

  // ===== 待签约 =====
  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {ProviderContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通提供者后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // ===== 已签约：节点提供者后台 =====
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>🖥️ 节点提供者平台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · 管理您的算力节点，按任务量获得收益。</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)', flexWrap: 'wrap' }}>
        {(['nodes', 'revenue', 'withdraw', 'stats'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2
            }}>
            {tab === 'nodes' && '🖥️ 节点管理'}
            {tab === 'revenue' && '💰 收益'}
            {tab === 'withdraw' && '💳 提现'}
            {tab === 'stats' && '📊 统计'}
          </button>
        ))}
      </div>

      {/* 节点管理 */}
      {activeTab === 'nodes' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>已接入算力节点</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>节点名称</th>
                  <th style={{ padding: '8px' }}>GPU</th>
                  <th style={{ padding: '8px' }}>位置</th>
                  <th style={{ padding: '8px' }}>状态</th>
                  <th style={{ padding: '8px' }}>完成任务</th>
                  <th style={{ padding: '8px' }}>收益</th>
                  <th style={{ padding: '8px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => (
                  <tr key={node.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{node.name}</td>
                    <td style={{ padding: '8px' }}>{node.gpu}</td>
                    <td style={{ padding: '8px' }}>{node.location}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '2px 10px', borderRadius: 12, fontSize: 12,
                        background: node.status === 'online' ? '#d1fae5' : '#f3f4f6',
                        color: node.status === 'online' ? '#065f46' : '#6b7280'
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: node.status === 'online' ? '#10b981' : '#9ca3af' }} />
                        {node.status === 'online' ? '在线' : '离线'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>{node.tasks.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>¥{node.revenue.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => handleToggleNode(node.id)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>
                        {node.status === 'online' ? '下线' : '上线'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 收益 */}
      {activeTab === 'revenue' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💰 收益看板</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f0f9ff', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>累计收益</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{revenueTotal.toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>完成任务</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#16a34a' }}>{taskCount}</p>
            </div>
            <div style={{ background: '#fefce8', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>分账比例</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#ca8a04' }}>95%</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计 */}
      {activeTab === 'stats' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📊 近7天收益趋势 (¥)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '20px 0' }}>
            {chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>¥{val}</span>
                <div style={{ width: '100%', maxWidth: 40, height: val / 30, background: 'var(--btn-primary-bg)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 提现 */}
      {activeTab === 'withdraw' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>提现账户 (企业实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={{ ...inputStyle, minWidth: 120 }}>
                <option value="bank">银行卡（对公）</option>
                <option value="alipay">支付宝</option>
                <option value="wechat">微信支付</option>
              </select>
              <input id="accountName" placeholder="户名（企业全称）" style={{ ...inputStyle, flex: 1 }} />
              <input id="accountNumber" placeholder="账号" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleBindAccount} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                绑定 / 更新
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>* 请绑定企业对公账户或法人账户，提现信息与绑定账户一致方可提现。</p>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleWithdraw} style={{ padding: '10px 24px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              申请提现
            </button>
          </div>
          <div style={{ fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>提现记录</p>
            {withdrawHistory.length === 0 && <p style={{ color: 'var(--text-muted)' }}>暂无记录</p>}
            {withdrawHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>¥{item.amount}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14,
  background: 'var(--input-bg)', color: 'var(--text-primary)', boxSizing: 'border-box'
};