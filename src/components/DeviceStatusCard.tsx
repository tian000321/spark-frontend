'use client';

import { useState, useEffect } from 'react';

const mockDeviceStatus = {
  aura_box_online: true,
  soul_knob_last_heartbeat: '3 秒前',
  current_ambiance_mode: 'MODE_B',
};

export default function DeviceStatusCard() {
  const [status, setStatus] = useState(mockDeviceStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus({ ...mockDeviceStatus });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">物理设备</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-3 h-3 rounded-full ${status.aura_box_online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        <span className="text-sm font-medium">Aura Box {status.aura_box_online ? '在线' : '离线'}</span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>Soul Knob 心跳：{status.soul_knob_last_heartbeat}</p>
        <p>当前模式：<span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">{status.current_ambiance_mode}</span></p>
      </div>
      <p className="text-xs text-gray-400 mt-4">数据每 30 秒自动刷新</p>
    </div>
  );
}