'use client';

import { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import PlanInterpreter from '@/components/PlanInterpreter';
import VetoButton from '@/components/VetoButton';
import BPMGauge from '@/components/BPMGauge';
import CostCounter from '@/components/CostCounter';

export default function ConsolePage() {
  const [currentMode, setCurrentMode] = useState('MODE_A');
  const [bpm, setBpm] = useState(72);
  const [cost, setCost] = useState(0.47);
  const [plan, setPlan] = useState({
    summary: '维持 MODE_A 暖场氛围，BPM 稳定在 72，灯光暖黄渐变',
    details: '预计未来 15 分钟内不切换模式，根据场内人数自动微调音量',
  });

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    // 模拟 BPM 与成本变化
    const bpmMap: Record<string, number> = { MODE_A: 72, MODE_B: 128, MODE_C: 80, MODE_D: 0 };
    setBpm(bpmMap[mode] || 0);
    setCost(Math.random() * 2 + 0.3);
  };

  const handleVeto = () => {
    setCurrentMode('MODE_D');
    setBpm(0);
    setPlan({ summary: '紧急停止已触发', details: '全场静音，灯光全亮白光' });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Aura 运营台 · 暗夜场所</h1>

      {/* 实时指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BPMGauge bpm={bpm} />
        <CostCounter cost={cost} />
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-xs text-gray-500">当前模式</p>
          <p className="text-2xl font-mono font-bold text-blue-600">{currentMode}</p>
        </div>
      </div>

      {/* 计划解释器 */}
      <PlanInterpreter plan={plan} />

      {/* 氛围模式快速切换 */}
      <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />

      {/* 否决按钮 */}
      <VetoButton onVeto={handleVeto} />
    </div>
  );
}