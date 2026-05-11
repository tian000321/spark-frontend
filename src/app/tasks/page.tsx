'use client';
import { useState } from 'react';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkBadge from '@/components/ui/SparkBadge';
import SparkModal from '@/components/ui/SparkModal';

// ---------- 类型定义 ----------
interface Task {
  id: string;
  name: string;
  type: string;
  urgency: '正常' | '加急' | '限时';
  estimatedCost: number;
  actualCost: number;
  compensationStatus: 'none' | 'insuring' | 'paid' | 'confirmed';
  compensationAmount: number;
  isManaged: boolean;
  status: '运行中' | '已完成' | '失败' | '待确认';
  createdAt: string;
}

const MOCK_TASKS: Task[] = [
  { id: 'task-001', name: '图像分类模型训练', type: '图像识别', urgency: '正常', estimatedCost: 120, actualCost: 118, compensationStatus: 'insuring', compensationAmount: 0, isManaged: true, status: '已完成', createdAt: '2026-05-09 10:30' },
  { id: 'task-002', name: '文本摘要生成', type: '自然语言处理', urgency: '加急', estimatedCost: 80, actualCost: 85, compensationStatus: 'paid', compensationAmount: 10, isManaged: false, status: '运行中', createdAt: '2026-05-10 14:00' },
  { id: 'task-003', name: '语音识别微调', type: '语音技术', urgency: '限时', estimatedCost: 200, actualCost: 200, compensationStatus: 'paid', compensationAmount: 400, isManaged: true, status: '失败', createdAt: '2026-05-08 09:15' },
  { id: 'task-004', name: '目标检测推理', type: '图像识别', urgency: '正常', estimatedCost: 60, actualCost: 55, compensationStatus: 'none', compensationAmount: 0, isManaged: false, status: '已完成', createdAt: '2026-05-07 16:45' },
  { id: 'task-005', name: '自然语言推理', type: '自然语言处理', urgency: '正常', estimatedCost: 95, actualCost: 90, compensationStatus: 'insuring', compensationAmount: 0, isManaged: true, status: '已完成', createdAt: '2026-05-06 11:20' },
];

const TASK_TYPES = ['训练', '推理', '微调'];
const BUSINESS_TYPES = ['图像识别', '自然语言处理', '语音技术', '数据挖掘'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 新任务表单
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskType, setNewTaskType] = useState('训练');
  const [newBizType, setNewBizType] = useState('图像识别');
  const [newDuration, setNewDuration] = useState('');
  const [newManaged, setNewManaged] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== '全部' && t.status !== statusFilter) return false;
    if (typeFilter !== '全部' && t.type !== typeFilter) return false;
    return true;
  });

  const handleCreate = () => {
    const duration = parseInt(newDuration) || 1;
    const cost = duration * 20; // 简单预估
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: newTaskName || '未命名任务',
      type: newBizType,
      urgency: '正常',
      estimatedCost: cost,
      actualCost: 0,
      compensationStatus: newManaged ? 'insuring' : 'none',
      compensationAmount: 0,
      isManaged: newManaged,
      status: '运行中',
      createdAt: new Date().toLocaleString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskName('');
    setNewDuration('');
    setNewManaged(false);
    setShowCreate(false);
  };

  const handleRetry = (task: Task) => {
    alert(`任务 ${task.id} 已重新提交，系统将自动选择最优资源。`);
    // 实际应调用 spark_core 调度接口
  };

  const handleViewCompensation = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 4 }}>📋 任务中心</h1>
          <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>
            管理你的算力任务，托管任务失败自动赔付
          </p>
        </div>
        <SparkButton variant="primary" onClick={() => setShowCreate(true)}>
          + 新建任务
        </SparkButton>
      </div>

      {/* 筛选器 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="全部">全部状态</option>
          <option value="运行中">运行中</option>
          <option value="已完成">已完成</option>
          <option value="失败">失败</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="全部">全部业务类型</option>
          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* 任务表格 */}
      <SparkCard padding={20}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>任务ID</th>
              <th style={{ padding: 10 }}>任务名称</th>
              <th style={{ padding: 10 }}>业务类型</th>
              <th style={{ padding: 10 }}>时效</th>
              <th style={{ padding: 10 }}>托管</th>
              <th style={{ padding: 10 }}>预估费用</th>
              <th style={{ padding: 10 }}>实际费用</th>
              <th style={{ padding: 10 }}>状态</th>
              <th style={{ padding: 10 }}>赔付</th>
              <th style={{ padding: 10 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: 10, fontFamily: 'monospace' }}>{task.id}</td>
                <td style={{ padding: 10, fontWeight: 500 }}>{task.name}</td>
                <td style={{ padding: 10 }}>{task.type}</td>
                <td style={{ padding: 10 }}>
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, background: task.urgency === '加急' ? 'rgba(239,68,68,0.12)' : task.urgency === '限时' ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)', color: task.urgency === '加急' ? '#ef4444' : task.urgency === '限时' ? '#f59e0b' : '#a0a0b0' }}>{task.urgency}</span>
                </td>
                <td style={{ padding: 10 }}>
                  {task.isManaged ? <SparkBadge variant="info">托管</SparkBadge> : <span style={{ color: 'var(--spark-text-muted)' }}>—</span>}
                </td>
                <td style={{ padding: 10 }}>¥{task.estimatedCost}</td>
                <td style={{ padding: 10 }}>¥{task.actualCost}</td>
                <td style={{ padding: 10 }}>
                  <SparkBadge variant={task.status === '已完成' ? 'success' : task.status === '失败' ? 'danger' : 'warning'}>{task.status}</SparkBadge>
                </td>
                <td style={{ padding: 10 }}>
                  {task.compensationStatus === 'paid' ? <SparkBadge variant="danger">已赔付 ¥{task.compensationAmount}</SparkBadge> : task.compensationStatus === 'insuring' ? <SparkBadge variant="success">🔒 保障中</SparkBadge> : <span style={{ color: 'var(--spark-text-muted)' }}>—</span>}
                </td>
                <td style={{ padding: 10, display: 'flex', gap: 6 }}>
                  {task.status === '失败' && (
                    <>
                      <SparkButton size="sm" variant="primary" onClick={() => handleRetry(task)}>重试</SparkButton>
                      {task.compensationStatus === 'paid' && (
                        <SparkButton size="sm" variant="secondary" onClick={() => handleViewCompensation(task)}>赔付详情</SparkButton>
                      )}
                    </>
                  )}
                  {task.status === '已完成' && (
                    <SparkButton size="sm" variant="ghost" onClick={() => alert('查看任务详情')}>详情</SparkButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SparkCard>

      {/* 创建任务弹窗 */}
      <SparkModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="+ 新建任务">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="任务名称" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: 10 }}>
            <select value={newTaskType} onChange={e => setNewTaskType(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={newBizType} onChange={e => setNewBizType(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <input placeholder="预计耗时（小时）" type="number" value={newDuration} onChange={e => setNewDuration(e.target.value)} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={newManaged} onChange={e => setNewManaged(e.target.checked)} />
            <span>启用托管（平台自动调度最优资源，失败按不低于服务费200%赔率赔付）</span>
          </label>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: 13 }}>
            预估费用：<strong>¥{(parseInt(newDuration) || 0) * 20}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <SparkButton variant="secondary" onClick={() => setShowCreate(false)}>取消</SparkButton>
          <SparkButton variant="primary" onClick={handleCreate}>创建任务</SparkButton>
        </div>
      </SparkModal>

      {/* 赔付详情弹窗 */}
      {selectedTask && (
        <SparkModal isOpen={true} onClose={() => setSelectedTask(null)} title="🔍 赔付详情">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div><strong>任务ID：</strong>{selectedTask.id}</div>
            <div><strong>故障原因：</strong>供应商宕机</div>
            <div><strong>赔付金额：</strong>¥{selectedTask.compensationAmount}</div>
            <div><strong>赔付方式：</strong>按不低于服务费200%自动赔付</div>
            <div><strong>赔付状态：</strong>{selectedTask.compensationStatus === 'paid' ? '已到账' : '处理中'}</div>
            <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(245,158,11,0.1)', borderRadius: 8, fontSize: 12 }}>
              ⚠️ 赔付已自动执行，不可篡改。如有疑问请在24小时内联系客服申诉。
            </div>
          </div>
        </SparkModal>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff', boxSizing: 'border-box' };
const selectStyle: React.CSSProperties = { padding: '10px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff' };