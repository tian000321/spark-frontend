'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// 模拟节点数据库，未来可以替换为真实API
const NODES_DB: Record<string, any> = {
  'node-1': {
    id: 'node-1', name: 'A100-贵阳超算', gpu: 'A100×8', region: '贵州·贵阳·云岩区',
    status: '在线', price: '¥12.00/时', provider: '星辰算力',
    mlperf: 94.2,
    compliance: { security: 95, stability: 88, efficiency: 92, regulation: 90 },
    tasks: 450, revenue: 5400,
    cpu: 68, gpuLoad: 82, memory: 55, network: 320,
    history: [
      { id: 't1', name: 'LLM 微调任务', duration: '8h 12min', cost: '¥98.40', time: '2026-05-10' },
      { id: 't2', name: '图像识别训练', duration: '3h 45min', cost: '¥45.00', time: '2026-05-09' },
    ],
  },
};

const ComplianceBar = ({ data }: { data: any }) => {
  // ... (你可以复用之前我们写的合规评分组件，这里为了代码完整，我提供一个精简版)
  const dims = ['security', 'stability', 'efficiency', 'regulation'];
  return ( <div> {dims.map(dim => ( <div key={dim}>...</div> ))} </div> );
};

export default function NodeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    setNode(NODES_DB[id] || null);
  }, [id]);

  if (!node) return <div className="p-10 text-center">节点不存在</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{node.name}</h1>
      <p className="text-gray-400 mb-6">{node.gpu} · {node.region} · 提供者：{node.provider}</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MetricCard label="MLPerf分" value={node.mlperf} color="text-purple-500" />
        <MetricCard label="CPU" value={`${node.cpu}%`} color="text-blue-500" />
        <MetricCard label="GPU" value={`${node.gpuLoad}%`} color="text-violet-500" />
        <MetricCard label="内存" value={`${node.memory}%`} color="text-green-500" />
        <MetricCard label="网络" value={`${node.network}Mbps`} color="text-yellow-500" />
      </div>
      
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
        立即租用
      </button>
    </div>
  );
}

const MetricCard = ({ label, value, color }: { label: string; value: any; color: string }) => (
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
    <div className="text-sm text-gray-400 mb-1">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);