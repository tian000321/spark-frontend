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
  progress: number; // 新增进度字段
}

const MOCK_TASKS: Task[] = [
  { id: 'task-001', name: '图像分类模型训练', type: '图像识别', urgency: '正常', estimatedCost: 120, actualCost: 118, compensationStatus: 'insuring', compensationAmount: 0, isManaged: true, status: '已完成', createdAt: '2026-05-09', progress: 100 },
  { id: 'task-002', name: '文本摘要生成', type: '自然语言处理', urgency: '加急', estimatedCost: 80, actualCost: 85, compensationStatus: 'paid', compensationAmount: 10, isManaged: false, status: '运行中', createdAt: '2026-05-10', progress: 65 },
  { id: 'task-003', name: '语音识别微调', type: '语音技术', urgency: '限时', estimatedCost: 200, actualCost: 200, compensationStatus: 'paid', compensationAmount: 400, isManaged: true, status: '失败', createdAt: '2026-05-08', progress: 42 },
  { id: 'task-004', name: '目标检测推理', type: '图像识别', urgency: '正常', estimatedCost: 60, actualCost: 55, compensationStatus: 'none', compensationAmount: 0, isManaged: false, status: '已完成', createdAt: '2026-05-07', progress: 100 },
  { id: 'task-005', name: '自然语言推理', type: '自然语言处理', urgency: '正常', estimatedCost: 95, actualCost: 90, compensationStatus: 'insuring', compensationAmount: 0, isManaged: true, status: '已完成', createdAt: '2026-05-06', progress: 100 },
];

const TASK_TYPES = ['训练', '推理', '微调'];
const BUSINESS_TYPES = ['图像识别', '自然语言处理', '语音技术', '数据挖掘'];

// ---------- 单任务卡片组件 (打碟机风格) ----------
const TaskCard = ({ task, onRetry, onViewCompensation }: { task: Task; onRetry: () => void; onViewCompensation: () => void }) => {
  return (
    <SparkCard padding={20} hoverable>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 任务名称 & 状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 600, fontSize: 'var(--spark-font-size-lg)' }}>{task.name}</h3>
          <SparkBadge variant={task.status === '已完成' ? 'success' : task.status === '失败' ? 'danger' : 'warning'}>
            {task.status}
          </SparkBadge>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>
          <span>{task.type}</span>
          <span>·</span>
          <span style={{ color: task.urgency === '加急' ? '#ef4444' : task.urgency === '限时' ? '#f59e0b' : '#a0a0b0' }}>{task.urgency}</span>
          <span>·</span>
          <span>{task.createdAt}</span>
        </div>

        {/* 进度条 (打碟机播放进度) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)', width: 40 }}>进度</span>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${task.progress}%`, height: '100%', background: task.status === '失败' ? '#ef4444' : 'var(--spark-brand-gradient)', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <span style={{ fontSize: 'var(--spark-font-size-xs)', fontWeight: 600 }}>{task.progress}%</span>
        </div>

        {/* 费用与托管 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--spark-font-size-sm)' }}>
          <div>
            <span style={{ color: 'var(--spark-text-muted)' }}>费用：</span>
            <span style={{ fontWeight: 600 }}>¥{task.actualCost} / ¥{task.estimatedCost}</span>
          </div>
          <div>
            {task.isManaged ? <SparkBadge variant="info">🔒 托管中</SparkBadge> : <span style={{ color: 'var(--spark-text-muted)' }}>未托管</span>}
          </div>
        </div>

        {/* 赔付状态 & 操作按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {task.compensationStatus === 'paid' ? (
              <SparkBadge variant="danger">已赔付 ¥{task.compensationAmount}</SparkBadge>
            ) : task.compensationStatus === 'insuring' ? (
              <SparkBadge variant="success">保障中</SparkBadge>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {task.status === '失败' && (
              <>
                <SparkButton size="sm" variant="primary" onClick={onRetry}>🔄 重试</SparkButton>
                {task.compensationStatus === 'paid' && (
                  <SparkButton size="sm" variant="secondary" onClick={onViewCompensation}>赔付详情</SparkButton>
                )}
              </>
            )}
            {task.status === '运行中' && (
              <SparkButton size="sm" variant="ghost" onClick={() => alert('查看实时日志')}>📋 实时日志</SparkButton>
            )}
            {task.status === '已完成' && (
              <SparkButton size="sm" variant="ghost" onClick={() => alert('下载结果')}>📥 下载</SparkButton>
            )}
          </div>
        </div>
      </div>
    </SparkCard>
  );
};

// ---------- 主任务中心页面 ----------
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('全部');

  // 新建任务表单
  const [newTaskName, setNewTaskName] = useState('');
  const [newBizType, setNewBizType] = useState('图像识别');
  const [newDuration, setNewDuration] = useState('');
  const [newManaged, setNewManaged] = useState(false);

  const filteredTasks = filterStatus === '全部' ? tasks : tasks.filter(t => t.status === filterStatus);

  const handleCreate = () => {
    const duration = parseInt(newDuration) || 1;
    const cost = duration * 20;
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
      createdAt: new Date().toLocaleDateString(),
      progress: 0,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskName('');
    setNewDuration('');
    setNewManaged(false);
    setShowCreate(false);
  };

  const handleRetry = (task: Task) => {
    alert(`已重新提交任务 ${task.id}，平台正自动调度最优资源。`);
  };

  const handleViewCompensation = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 4 }}>🎛️ 任务操作台</h1>
          <p style={{ color: 'var(--spark-text-secondary)', fontSize: 'var(--spark-font-size-sm)' }}>
            每一个任务都可监控、可干预、可赔付
          </p>
        </div>
        <SparkButton variant="primary" onClick={() => setShowCreate(true)}>
          + 启动新任务
        </SparkButton>
      </div>

      {/* 状态筛选器 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['全部', '运行中', '已完成', '失败'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 18px',
              border: 'none',
              background: filterStatus === s ? 'var(--spark-brand-gradient)' : 'rgba(255,255,255,0.06)',
              color: filterStatus === s ? '#fff' : 'var(--spark-text-secondary)',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 'var(--spark-font-size-sm)',
              fontWeight: filterStatus === s ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 任务卡片网格 (打碟机风格) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onRetry={() => handleRetry(task)}
            onViewCompensation={() => handleViewCompensation(task)}
          />
        ))}
      </div>

      {/* 创建任务弹窗 */}
      <SparkModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="🚀 启动新任务">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="任务名称" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} style={inputStyle} />
          <select value={newBizType} onChange={e => setNewBizType(e.target.value)} style={inputStyle}>
            {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input placeholder="预计耗时（小时）" type="number" value={newDuration} onChange={e => setNewDuration(e.target.value)} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={newManaged} onChange={e => setNewManaged(e.target.checked)} />
            <span>启用托管（失败按不低于服务费200%赔付）</span>
          </label>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: 13 }}>
            预估费用：<strong>¥{(parseInt(newDuration) || 0) * 20}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <SparkButton variant="secondary" onClick={() => setShowCreate(false)}>取消</SparkButton>
          <SparkButton variant="primary" onClick={handleCreate}>确认启动</SparkButton>
        </div>
      </SparkModal>

      {/* 赔付详情弹窗 */}
      {selectedTask && (
        <SparkModal isOpen={true} onClose={() => setSelectedTask(null)} title="⚖️ 赔付记录">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div><strong>任务ID：</strong>{selectedTask.id}</div>
            <div><strong>故障原因：</strong>供应商节点离线</div>
            <div><strong>赔付倍数：</strong>200%</div>
            <div><strong>赔付金额：</strong>¥{selectedTask.compensationAmount}</div>
            <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, fontSize: 12 }}>
              此赔付已由代码自动执行，不可篡改。<br />
              若对赔付有疑问，请在24小时内提起申诉。
            </div>
          </div>
        </SparkModal>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  fontSize: 14,
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  boxSizing: 'border-box',
};