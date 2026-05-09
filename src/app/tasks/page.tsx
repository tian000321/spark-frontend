'use client';
import { useState, useEffect } from 'react';

interface Task {
  id: string;
  name: string;
  status: string;
  type: string;
  time: string;
  cost: number;
  managed: boolean;      // 是否托管
  urgency: string;       // 正常 / 加急 / 限时
  business: string;      // 业务类型
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  // 新建任务弹窗
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    type: '训练',
    business: '图像识别',
    managed: true,
    urgency: '正常',
    estimatedHours: 2,
    description: '',
  });

  // 模拟初始数据
  useEffect(() => {
    const mock: Task[] = [
      { id: 'task-001', name: '图像分类模型训练', status: '已完成', type: '训练', time: '2026-05-01 09:00', cost: 3.42, managed: true, urgency: '正常', business: '图像识别' },
      { id: 'task-002', name: '文本摘要生成', status: '运行中', type: '推理', time: '2026-05-02 10:07', cost: 8.76, managed: false, urgency: '加急', business: '自然语言处理' },
      { id: 'task-003', name: '语音识别微调', status: '失败', type: '训练', time: '2026-05-03 11:14', cost: 5.20, managed: true, urgency: '限时', business: '语音技术' },
      { id: 'task-004', name: '目标检测推理', status: '已完成', type: '推理', time: '2026-05-04 12:21', cost: 2.80, managed: false, urgency: '正常', business: '图像识别' },
      { id: 'task-005', name: '自然语言推理', status: '已完成', type: '推理', time: '2026-05-05 13:28', cost: 6.15, managed: true, urgency: '正常', business: '自然语言处理' },
    ];
    setTasks(mock);
    setTotal(mock.length);
  }, []);

  // 筛选
  const filtered = tasks.filter(t => {
    const matchSearch = t.name.includes(search) || t.id.includes(search);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchUrgency = urgencyFilter === 'all' || t.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  // 分页
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // 新建任务
  const handleCreate = () => {
    const task: Task = {
      id: 'task-' + Date.now(),
      name: newTask.name || '未命名任务',
      status: '等待中',
      type: newTask.type,
      time: new Date().toLocaleString(),
      cost: 0,
      managed: newTask.managed,
      urgency: newTask.urgency,
      business: newTask.business,
    };
    setTasks(prev => [task, ...prev]);
    setTotal(prev => prev + 1);
    setShowCreate(false);
    setNewTask({ name: '', type: '训练', business: '图像识别', managed: true, urgency: '正常', estimatedHours: 2, description: '' });
  };

  const getStatusStyle = (status: string) => {
    if (status === '已完成') return { background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' };
    if (status === '运行中') return { background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' };
    if (status === '失败') return { background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)' };
    return { background: '#f5f5f5', color: '#666' };
  };

  const getUrgencyStyle = (u: string) => {
    if (u === '加急') return { background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)', fontWeight: 'bold' };
    if (u === '限时') return { background: 'var(--badge-orange-bg)', color: 'var(--badge-orange-text)' };
    return { color: 'var(--text-secondary)' };
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)' }}>任务中心</h1>
        <button
          onClick={() => setShowCreate(true)}
          style={{ padding: '10px 20px', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
        >
          + 新建任务
        </button>
      </div>

      {/* 筛选栏 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍 搜索任务名称或ID..." style={{ flex: 1, minWidth: 180, padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部状态</option>
          <option value="已完成">已完成</option>
          <option value="运行中">运行中</option>
          <option value="失败">失败</option>
          <option value="等待中">等待中</option>
        </select>
        <select value={urgencyFilter} onChange={(e) => { setUrgencyFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
          <option value="all">全部时效</option>
          <option value="正常">正常</option>
          <option value="加急">加急</option>
          <option value="限时">限时</option>
        </select>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>共 {filtered.length} 条任务，第 {page}/{totalPages} 页</p>

      {/* 任务表格 */}
      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>任务ID</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>任务名称</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>业务类型</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>时效</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>托管</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>状态</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>费用</th>
              <th style={{ padding: 12, color: 'var(--text-secondary)' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{task.id}</td>
                <td style={{ padding: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{task.name}</td>
                <td style={{ padding: 12, color: 'var(--text-secondary)' }}>{task.business}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ ...getUrgencyStyle(task.urgency), padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>{task.urgency}</span>
                </td>
                <td style={{ padding: 12 }}>
                  {task.managed ? (
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 12, background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' }}>托管</span>
                  ) : '—'}
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{ ...getStatusStyle(task.status), padding: '3px 10px', borderRadius: 12, fontSize: 12 }}>{task.status}</span>
                </td>
                <td style={{ padding: 12, color: 'var(--text-primary)' }}>¥{task.cost.toFixed(2)}</td>
                <td style={{ padding: 12 }}>
                  <a href={`/tasks/${task.id}`} style={{ color: 'var(--badge-blue-text)', fontSize: 12, textDecoration: 'underline' }}>详情</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>无匹配任务</p>}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === 1 ? '#f5f5f5' : 'var(--input-bg)', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : 'var(--text-primary)' }}>上一页</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '8px 14px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === i + 1 ? 'var(--btn-primary-bg)' : 'var(--input-bg)', color: page === i + 1 ? 'var(--btn-primary-text)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: page === i + 1 ? 'bold' : 'normal' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: page === totalPages ? '#f5f5f5' : 'var(--input-bg)', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : 'var(--text-primary)' }}>下一页</button>
        </div>
      )}

      {/* 新建任务弹窗 */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: 20, color: 'var(--text-primary)' }}>📝 新建任务</h3>

            <label style={labelStyle}>任务名称 *</label>
            <input value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} style={inputStyle} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>业务类型</label>
                <select value={newTask.business} onChange={e => setNewTask({ ...newTask, business: e.target.value })} style={inputStyle}>
                  <option>图像识别</option><option>自然语言处理</option><option>语音技术</option><option>推荐系统</option><option>时间序列</option><option>多模态</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>任务类型</label>
                <select value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value })} style={inputStyle}>
                  <option>训练</option><option>推理</option><option>数据处理</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div>
                <label style={labelStyle}>时效要求</label>
                <select value={newTask.urgency} onChange={e => setNewTask({ ...newTask, urgency: e.target.value })} style={inputStyle}>
                  <option>正常</option><option>加急</option><option>限时</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>预计耗时 (小时)</label>
                <input type="number" value={newTask.estimatedHours} onChange={e => setNewTask({ ...newTask, estimatedHours: +e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={newTask.managed} onChange={e => setNewTask({ ...newTask, managed: e.target.checked })} id="managed" />
              <label htmlFor="managed" style={{ fontSize: 14, color: 'var(--text-primary)' }}>🤖 启用托管（平台自动调度最优资源）</label>
            </div>

            <label style={{ ...labelStyle, marginTop: 12 }}>任务描述</label>
            <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>取消</button>
              <button onClick={handleCreate} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>创建任务</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--input-border)',
  borderRadius: 8,
  fontSize: 14,
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  marginBottom: 8,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 4,
  fontWeight: 500,
  fontSize: 13,
  color: 'var(--text-primary)',
};