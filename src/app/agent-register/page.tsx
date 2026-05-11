'use client';
import { useState, useEffect } from 'react';
import { AgentContract } from '@/components/onboarding/ContractText';

type Status = 'none' | 'pending' | 'approved' | 'signed';
type NodeStatus = 'online' | 'offline';

interface Customer {
  id: string;
  name: string;
  level: string;
  signedAt: string;
  consumption: number;
  commission: number;
}

interface AgentNode {
  id: string;
  name: string;
  gpu: string;
  region: string;
  status: NodeStatus;
  monthlyRevenue: number;
}

interface PromotableAgent {
  id: string;
  name: string;
  capability: string;
  commissionRate: number;
  calls: number;
}

interface PromotableVibePack {
  id: string;
  name: string;
  style: string;
  commissionRate: number;
  calls: number;
}

interface CommissionRecord {
  id: string;
  type: 'compute' | 'agent' | 'vibe';
  productName: string;
  customerName: string;
  amount: number;
  commission: number;
  time: string;
}

const REGIONS = [
  '贵州·贵阳·云岩区', '贵州·贵阳·南明区', '贵州·贵阳·修文县',
  '贵州·遵义·红花岗区', '贵州·遵义·湄潭县',
  '广东·深圳·南山区', '广东·深圳·福田区',
  '四川·成都·高新区', '北京·朝阳区', '上海·浦东新区',
];

export default function AgentRegisterPage() {
  const [status, setStatus] = useState<Status>('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('city');
  const [region, setRegion] = useState('');
  const [channel, setChannel] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'customers' | 'revenue' | 'withdraw' | 'stats' | 'region-nodes' | 'promote' | 'commissions' | 'contract'>('customers');
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<{ amount: string; time: string }[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: '暗夜酒吧', level: '市级', signedAt: '2026-04-15', consumption: 48000, commission: 480 },
    { id: '2', name: '星辰 Livehouse', level: '市级', signedAt: '2026-05-01', consumption: 32000, commission: 320 },
    { id: '3', name: '海边 Club', level: '县区', signedAt: '2026-05-08', consumption: 12000, commission: 360 },
  ]);

  const [regionNodes, setRegionNodes] = useState<AgentNode[]>([
    { id: 'rn1', name: 'A100-贵阳节点', gpu: 'A100×4', region: '贵州·贵阳·云岩区', status: 'online', monthlyRevenue: 12000 },
    { id: 'rn2', name: 'RTX4090-深圳节点', gpu: 'RTX 4090×2', region: '广东·深圳·南山区', status: 'online', monthlyRevenue: 6800 },
    { id: 'rn3', name: 'A100-成都节点', gpu: 'A100×1', region: '四川·成都·高新区', status: 'offline', monthlyRevenue: 0 },
  ]);

  const [promotableAgents, setPromotableAgents] = useState<PromotableAgent[]>([
    { id: 'a1', name: '图像分类专家', capability: '高精度图像识别', commissionRate: 0.02, calls: 5200 },
    { id: 'a2', name: '文本情感分析', capability: '中文情感分析', commissionRate: 0.02, calls: 3400 },
  ]);

  const [promotableVibePacks, setPromotableVibePacks] = useState<PromotableVibePack[]>([
    { id: 'v1', name: '午夜高潮-暗夜', style: 'Techno', commissionRate: 0.01, calls: 1200 },
    { id: 'v2', name: '暖场爵士', style: 'Jazz', commissionRate: 0.01, calls: 900 },
  ]);

  const [commissionRecords] = useState<CommissionRecord[]>([
    { id: 'c1', type: 'compute', productName: 'A100 算力', customerName: '暗夜酒吧', amount: 4800, commission: 48, time: '2026-05-09 15:20' },
    { id: 'c2', type: 'agent', productName: '图像分类专家', customerName: '科技公司A', amount: 1200, commission: 24, time: '2026-05-09 14:10' },
    { id: 'c3', type: 'vibe', productName: '午夜高潮包', customerName: '暗夜酒吧', amount: 300, commission: 3, time: '2026-05-08 22:45' },
  ]);

  const [chartData] = useState([480, 320, 500, 410, 380, 620, 550]);
  const [inviteLink] = useState('https://sparktech.com/ref?code=AGENT123');

  useEffect(() => {
    const saved = localStorage.getItem('agent_status');
    if (saved) setStatus(saved as Status);
  }, []);

  const updateStatus = (s: Status) => {
    setStatus(s);
    localStorage.setItem('agent_status', s);
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
    const paymentPwd = localStorage.getItem('payment_password');
    if (!paymentPwd) { alert('请先在钱包页面设置支付密码'); return; }
    const inputPwd = prompt('请输入支付密码以确认提现：');
    if (inputPwd !== paymentPwd) return alert('支付密码错误，提现失败');
    setRevenueTotal(prev => prev - amount);
    setWithdrawHistory(prev => [{ amount: withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setWithdrawAmount('');
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  // ===== 入驻状态路由 =====
  if (status === 'none') return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>🤝 精英招募 · 代理</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="真实姓名 / 企业名称" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="联系电话" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        <select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>
          <option value="city">市级代理 (年费 ¥10,000)</option>
          <option value="district">县区代理 (年费 ¥1,000)</option>
        </select>
        <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
          <option value="">请选择负责区域</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input placeholder="推广渠道 / 预计客户量" value={channel} onChange={e => setChannel(e.target.value)} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          我已阅读并同意《代理加盟协议》
        </label>
        <button onClick={() => {
          if (!name || !phone || !region) return alert('请填写姓名、电话和负责区域');
          if (!agreed) return alert('请同意协议');
          localStorage.setItem('agent_status_name', name);
          localStorage.setItem('agent_status_phone', phone);
          localStorage.setItem('agent_status_region', region);
          localStorage.setItem('agent_status_detail', level + ' / ' + channel);
          localStorage.setItem('agent_status_time', new Date().toLocaleString());
          updateStatus('pending');
        }} style={{ padding: 12, background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
          提交申请
        </button>
      </div>
    </div>
  );

  if (status === 'pending') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>⏳ 审核中</h2>
      <p style={{ color: 'var(--text-muted)' }}>您的代理申请已提交，平台将在 1-3 个工作日内审核。</p>
      <button onClick={() => { if (confirm('模拟审核通过？')) updateStatus('approved'); }} style={{ marginTop: 20, padding: '8px 20px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', cursor: 'pointer' }}>
        模拟审核通过
      </button>
    </div>
  );

  if (status === 'approved') return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>📝 签署协议</h2>
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, maxHeight: 300, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {AgentContract}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" onChange={e => setAgreed(e.target.checked)} />
        我已阅读并同意以上完整协议
      </label>
      <button onClick={() => { if (!agreed) return alert('请先同意协议'); updateStatus('signed'); alert('签约成功！您已开通代理后台。'); }} style={{ width: '100%', padding: 12, background: agreed ? 'var(--btn-primary-bg)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>
        确认签署
      </button>
    </div>
  );

  // ===== 已签约：代理后台 =====
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>🤝 代理后台</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>已签约 · {level === 'city' ? '市级代理' : '县区代理'} · 负责区域：{region || '未设置'}</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)', flexWrap: 'wrap', overflowX: 'auto' }}>
        {(['customers', 'revenue', 'withdraw', 'stats', 'region-nodes', 'promote', 'commissions', 'contract'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2, whiteSpace: 'nowrap'
            }}>
            {tab === 'customers' && '👥 客户管理'}
            {tab === 'revenue' && '💰 收益'}
            {tab === 'withdraw' && '💳 提现'}
            {tab === 'stats' && '📊 统计'}
            {tab === 'region-nodes' && '🗺️ 地区与节点'}
            {tab === 'promote' && '📢 推广产品'}
            {tab === 'commissions' && '📋 佣金明细'}
            {tab === 'contract' && '📝 合同'}
          </button>
        ))}
      </div>

      {/* 客户管理 */}
      {activeTab === 'customers' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>已拓展客户</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>客户名称</th><th style={{ padding: '8px' }}>级别</th><th style={{ padding: '8px' }}>签约时间</th><th style={{ padding: '8px' }}>累计消费</th><th style={{ padding: '8px' }}>佣金</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '8px' }}>{c.level}</td>
                    <td style={{ padding: '8px' }}>{c.signedAt}</td>
                    <td style={{ padding: '8px' }}>¥{c.consumption.toLocaleString()}</td>
                    <td style={{ padding: '8px', color: 'var(--btn-primary-bg)', fontWeight: 500 }}>¥{c.commission.toLocaleString()}</td>
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
          <h3 style={{ marginBottom: 16 }}>💰 佣金收益</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f0f9ff', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>累计佣金</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>¥{revenueTotal.toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>拓展客户</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#16a34a' }}>{customerCount}</p>
            </div>
            <div style={{ background: '#fefce8', padding: 20, borderRadius: 10, textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>佣金比例</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: '#ca8a04' }}>{level === 'city' ? '1%' : '3%'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 提现 */}
      {activeTab === 'withdraw' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>💳 提现</h3>
          <div style={{ marginBottom: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>提现账户 (本人实名)</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <select id="accountType" style={{ ...inputStyle, minWidth: 120 }}>
                <option value="wechat">微信支付</option><option value="alipay">支付宝</option><option value="bank">银行卡</option>
              </select>
              <input id="accountName" placeholder="户名" style={{ ...inputStyle, flex: 1 }} />
              <input id="accountNumber" placeholder="账号" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleBindAccount} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>绑定 / 更新</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>* 请绑定本人实名账户，提现信息与绑定账户一致方可提现。</p>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>可提现余额：<strong>¥{revenueTotal.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input placeholder="提现金额" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleWithdraw} style={{ padding: '10px 24px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>申请提现</button>
          </div>
          <div style={{ fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>提现记录</p>
            {withdrawHistory.length === 0 && <p style={{ color: 'var(--text-muted)' }}>暂无记录</p>}
            {withdrawHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>¥{item.amount}</span><span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 统计 */}
      {activeTab === 'stats' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📊 近7天佣金趋势 (¥)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '20px 0' }}>
            {chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>¥{val}</span>
                <div style={{ width: '100%', maxWidth: 40, height: val / 1.5, background: 'var(--btn-primary-bg)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 地区与节点看板 */}
      {activeTab === 'region-nodes' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>🗺️ 负责区域与节点状态 ({region || '未设置区域'})</h3>
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>节点名称</th><th style={{ padding: '8px' }}>GPU</th><th style={{ padding: '8px' }}>区域</th><th style={{ padding: '8px' }}>状态</th><th style={{ padding: '8px' }}>本月收益</th>
                </tr>
              </thead>
              <tbody>
                {regionNodes.filter(n => n.region === region).map(node => (
                  <tr key={node.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{node.name}</td>
                    <td style={{ padding: '8px' }}>{node.gpu}</td>
                    <td style={{ padding: '8px' }}>{node.region}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 12, fontSize: 12, background: node.status === 'online' ? '#d1fae5' : '#f3f4f6', color: node.status === 'online' ? '#065f46' : '#6b7280' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: node.status === 'online' ? '#10b981' : '#9ca3af' }} />{node.status === 'online' ? '在线' : '离线'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>¥{node.monthlyRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {regionNodes.filter(n => n.region === region).length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>当前区域暂无接入节点</p>
            )}
          </div>
          <button onClick={() => {
            const newNode: AgentNode = {
              id: 'rn' + Date.now(),
              name: '新接入节点',
              gpu: 'A100×1',
              region: region,
              status: 'online',
              monthlyRevenue: 0
            };
            setRegionNodes(prev => [...prev, newNode]);
            alert('新节点已自动匹配到你的区域！');
          }} style={{ padding: '10px 20px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            + 模拟接入新节点
          </button>
        </div>
      )}

      {/* 推广产品 */}
      {activeTab === 'promote' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📢 可推广智能体</h3>
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>名称</th><th style={{ padding: '8px' }}>能力</th><th style={{ padding: '8px' }}>佣金率</th><th style={{ padding: '8px' }}>已调用</th><th style={{ padding: '8px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {promotableAgents.map(agent => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{agent.name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{agent.capability}</td>
                    <td style={{ padding: '8px' }}>{(agent.commissionRate * 100).toFixed(0)}%</td>
                    <td style={{ padding: '8px' }}>{agent.calls.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => alert(`推广链接已复制：${inviteLink}&product=${agent.id}`)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>获取推广链接</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 style={{ marginBottom: 16 }}>🎵 可推广氛围包</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>名称</th><th style={{ padding: '8px' }}>风格</th><th style={{ padding: '8px' }}>佣金率</th><th style={{ padding: '8px' }}>已调用</th><th style={{ padding: '8px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {promotableVibePacks.map(pack => (
                  <tr key={pack.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{pack.name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{pack.style}</td>
                    <td style={{ padding: '8px' }}>{(pack.commissionRate * 100).toFixed(0)}%</td>
                    <td style={{ padding: '8px' }}>{pack.calls.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => alert(`推广链接已复制：${inviteLink}&product=${pack.id}`)} style={{ padding: '4px 10px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--input-bg)', cursor: 'pointer', fontSize: 12 }}>获取推广链接</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 佣金明细 */}
      {activeTab === 'commissions' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📋 佣金明细</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>时间</th><th style={{ padding: '8px' }}>类型</th><th style={{ padding: '8px' }}>产品</th><th style={{ padding: '8px' }}>客户</th><th style={{ padding: '8px' }}>交易金额</th><th style={{ padding: '8px' }}>佣金</th>
                </tr>
              </thead>
              <tbody>
                {commissionRecords.map(rec => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontSize: 12, color: 'var(--text-muted)' }}>{rec.time}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: rec.type === 'compute' ? '#dbeafe' : rec.type === 'agent' ? '#d1fae5' : '#fef3c7', color: rec.type === 'compute' ? '#1e40af' : rec.type === 'agent' ? '#065f46' : '#92400e' }}>
                        {rec.type === 'compute' ? '算力' : rec.type === 'agent' ? '智能体' : '氛围包'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>{rec.productName}</td>
                    <td style={{ padding: '8px' }}>{rec.customerName}</td>
                    <td style={{ padding: '8px' }}>¥{rec.amount.toLocaleString()}</td>
                    <td style={{ padding: '8px', fontWeight: 500, color: 'var(--btn-primary-bg)' }}>¥{rec.commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 合同 */}
      {activeTab === 'contract' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>📝 已签署协议</h3>
          <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, maxHeight: 400, overflow: 'auto', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {AgentContract}
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