'use client';

import { useState } from 'react';

const mockVetoEvents = [
  {
    id: '1',
    timestamp: '2026-05-10 22:15:00',
    type: 'L1',
    device_serial: 'SK-001',
    recovery_time: '15 秒',
    plan_summary: 'AI 计划于 22:15 切换至 MODE_B，BPM 从 128 升至 138',
    state_snapshot: 'MODE_A, BPM 128, 深蓝光',
  },
  {
    id: '2',
    timestamp: '2026-05-09 23:40:00',
    type: 'L2',
    device_serial: 'SK-001',
    recovery_time: '3 分钟',
    plan_summary: 'AI 检测到人群情绪下降，建议切换至 MODE_C 降温',
    state_snapshot: 'MODE_B, BPM 135, 频闪白光',
  },
  {
    id: '3',
    timestamp: '2026-05-08 01:10:00',
    type: 'L1',
    device_serial: 'SK-001',
    recovery_time: '8 秒',
    plan_summary: '触发体验红线：深夜音量超过 85dB，AI 建议降低至 80dB',
    state_snapshot: 'MODE_B, 87dB, 频闪白光',
  },
];

export default function VetoEventLog() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">否决事件日志</h3>
      <div className="space-y-3">
        {mockVetoEvents.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(event.id)}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{event.timestamp}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${event.type === 'L1' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {event.type === 'L1' ? 'L1 静音/白光' : 'L2 场景回滚'}
                </span>
              </div>
              <span className="text-xs text-gray-400">设备 {event.device_serial} · 恢复于 {event.recovery_time}</span>
            </div>
            {expandedId === event.id && (
              <div className="mt-3 pt-3 border-t text-sm text-gray-600 space-y-2">
                <p><strong>否决前 AI 计划：</strong>{event.plan_summary}</p>
                <p><strong>否决后状态快照：</strong>{event.state_snapshot}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">默认展示最近 7 天记录</p>
    </div>
  );
}