'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkModal from '@/components/ui/SparkModal';
import SparkBadge from '@/components/ui/SparkBadge';
import OrcaFloating from '@/components/OrcaFloating';

// ===== 子组件直接定义在本文件中，避免导入缺失 =====

// 模式选择器
const ModeSelector = ({ currentMode, onModeChange }: { currentMode: string; onModeChange: (m: string) => void }) => {
  const modes = [
    { id: 'MODE_A', label: '暖场', color: '#fbbf24', textColor: '#78350f' },
    { id: 'MODE_B', label: '高潮', color: '#ef4444', textColor: '#fff' },
    { id: 'MODE_C', label: 'Chill', color: '#3b82f6', textColor: '#fff' },
    { id: 'MODE_D', label: '应急', color: '#6b7280', textColor: '#fff' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {modes.map(m => (
        <SparkButton
          key={m.id}
          variant={currentMode === m.id ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onModeChange(m.id)}
        >
          {m.label}
        </SparkButton>
      ))}
    </div>
  );
};

// 否决按钮
const VetoButton = ({ onVeto }: { onVeto: () => void }) => {
  const [pressed, setPressed] = useState(false);
  const handlePress = () => { setPressed(true); onVeto(); setTimeout(() => setPressed(false), 2000); };
  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handlePress}
        disabled={pressed}
        style={{
          width: 100, height: 100, borderRadius: '50%', border: 'none', background: pressed ? '#9ca3af' : '#ef4444',
          color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--spark-shadow-md)',
          transition: 'all 0.2s', transform: pressed ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {pressed ? '已否决' : '否决'}
      </button>
    </div>
  );
};

// BPM 仪表
const BPMGauge = ({ bpm }: { bpm: number }) => (
  <SparkCard padding={16} style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)', marginBottom: 4 }}>实时 BPM</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: '#a855f7' }}>{bpm}</div>
    <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
      <div style={{ width: `${Math.min(bpm / 1.6, 100)}%`, height: '100%', background: '#a855f7', borderRadius: 2 }} />
    </div>
  </SparkCard>
);

// 成本计数器
const CostCounter = ({ cost }: { cost: number }) => (
  <SparkCard padding={16} style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)', marginBottom: 4 }}>今日成本</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>¥{cost.toFixed(2)}</div>
    <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)' }}>按秒赔付保障中</div>
  </SparkCard>
);

// 计划解释器
const PlanInterpreter = ({ plan }: { plan: { summary: string; details: string } }) => (
  <SparkCard padding={20} style={{ borderLeft: '4px solid var(--spark-brand)', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span>🤖 AI 计划解释器</span>
      <SparkBadge variant="info">实时</SparkBadge>
    </div>
    <div style={{ fontSize: 'var(--spark-font-size-md)', fontWeight: 500 }}>{plan.summary}</div>
    <div style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)', marginTop: 4 }}>{plan.details}</div>
    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
      <SparkButton variant="primary" size="sm" onClick={() => alert('计划已执行')}>✓ 确认执行</SparkButton>
      <SparkButton variant="secondary" size="sm" onClick={() => alert('参数微调')}>↻ 微调参数</SparkButton>
    </div>
  </SparkCard>
);

// 声光电智控面板
const SoundLightPanel = ({ bpm, setBpm, currentMode, setCurrentMode }: any) => {
  const [autoMode, setAutoMode] = useState(false);
  const [lightMode, setLightMode] = useState('暖黄渐变');
  const [style, setStyle] = useState('Jazz');
  const [smokeOn, setSmokeOn] = useState(false);
  const [laserOn, setLaserOn] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (autoMode) {
      const hour = new Date().getHours();
      if (hour < 18) { setCurrentMode('MODE_A'); setLightMode('暖黄渐变'); setStyle('Jazz'); }
      else if (hour < 23) { setCurrentMode('MODE_B'); setLightMode('频闪激光联动'); setStyle('Techno'); }
      else { setCurrentMode('MODE_C'); setLightMode('深蓝呼吸'); setStyle('Ambient'); }
    }
  }, [autoMode]);

  const scenePresets = [
    { name: '🌅 周日暖场', mode: 'MODE_A', bpm: 72, light: '暖黄渐变', style: 'Jazz' },
    { name: '🔥 午夜狂飙', mode: 'MODE_B', bpm: 132, light: '频闪激光联动', style: 'Techno' },
    { name: '🌌 深夜 Chill', mode: 'MODE_C', bpm: 80, light: '深蓝呼吸', style: 'Ambient' },
  ];

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>✨ 场景推荐</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 20 }}>
        {scenePresets.map(p => (
          <SparkCard key={p.name} padding={12} hoverable onClick={() => { setCurrentMode(p.mode); setBpm(p.bpm); setLightMode(p.light); setStyle(p.style); }}>
            <div style={{ fontWeight: 500, fontSize: 'var(--spark-font-size-sm)' }}>{p.name}</div>
            <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>{p.mode} · {p.bpm}BPM</div>
          </SparkCard>
        ))}
      </div>

      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>🤖 智能编排</h3>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 'var(--spark-font-size-sm)' }}>
        <input type="checkbox" checked={autoMode} onChange={e => setAutoMode(e.target.checked)} />
        <span>开启声光电智能编排（根据时段自动调整）</span>
      </label>

      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>🎛️ 手动编排</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>音乐风格</label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
            <option>Jazz</option><option>Techno</option><option>House</option><option>Ambient</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>音量</label>
          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ fontSize: 'var(--spark-font-size-xs)' }}>{volume}%</div>
        </div>
        <div>
          <label style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>灯光模式</label>
          <select value={lightMode} onChange={e => setLightMode(e.target.value)} style={selectStyle}>
            <option>暖黄渐变</option><option>频闪激光联动</option><option>深蓝呼吸</option><option>全亮白光</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>BPM</label>
          <input type="range" min="0" max="140" value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ fontSize: 'var(--spark-font-size-xs)' }}>{bpm} BPM</div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
        <label><input type="checkbox" checked={smokeOn} onChange={e => setSmokeOn(e.target.checked)} /> 🌫️ 烟雾</label>
        <label><input type="checkbox" checked={laserOn} onChange={e => setLaserOn(e.target.checked)} /> ⚡ 激光</label>
      </div>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  width: '100%', padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'var(--spark-text-primary)', fontSize: 'var(--spark-font-size-sm)'
};

// ===== 主组件 =====
export default function ConsolePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'media';
  const validTabs = ['media', 'dj', 'sing', 'scene', 'tuner', 'market'];
  const defaultTab = validTabs.includes(initialTab) ? initialTab : 'media';

  const [currentMode, setCurrentMode] = useState('MODE_A');
  const [bpm, setBpm] = useState(72);
  const [cost, setCost] = useState(0.47);
  const [plan, setPlan] = useState({ summary: '暖场模式，BPM 72，暖黄渐变', details: '等待指令...' });
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [eqBands, setEqBands] = useState({ low: 0, mid: 0, high: 0 });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && validTabs.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    const bpmMap: Record<string, number> = { MODE_A: 72, MODE_B: 128, MODE_C: 80, MODE_D: 0 };
    setBpm(bpmMap[mode] || 72);
    const planMap: Record<string, { summary: string; details: string }> = {
      MODE_A: { summary: '暖场模式已激活', details: 'BPM 60-80，暖黄光缓慢渐变' },
      MODE_B: { summary: '午夜高潮模式已激活', details: 'BPM 120-140，频闪激光联动' },
      MODE_C: { summary: 'Chill 模式已激活', details: 'BPM 70-90，深蓝呼吸灯' },
      MODE_D: { summary: '应急安全模式', details: '全场静音，全亮白光' },
    };
    setPlan(planMap[mode] || plan);
  };

  const handleVeto = () => handleModeChange('MODE_D');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🎛️ 智能嗨吧控台</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24, fontSize: 'var(--spark-font-size-sm)' }}>
        实时掌控现场氛围 · 旋转选模式，按下急停，一切尽在指尖
      </p>

      {/* 实时指标 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <BPMGauge bpm={bpm} />
        <CostCounter cost={cost} />
        <SparkCard padding={16} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)', marginBottom: 4 }}>当前模式</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--spark-brand-light)' }}>{currentMode}</div>
        </SparkCard>
      </div>

      {/* 计划解释器 */}
      <PlanInterpreter plan={plan} />

      {/* 选项卡 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {[
          { key: 'media', label: '🎬 媒体库' },
          { key: 'dj', label: '🎧 DJ模式' },
          { key: 'sing', label: '🎤 唱歌模式' },
          { key: 'scene', label: '🎭 声光电智控' },
          { key: 'tuner', label: '🎚️ 智能调音' },
          { key: 'market', label: '🛒 嗨吧市场' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 24px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab.key ? '2px solid var(--spark-brand)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)',
              fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer', fontSize: 'var(--spark-font-size-md)',
              marginBottom: -14,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <SparkCard padding={20}>
        {activeTab === 'media' && <div>媒体库功能（待重构）</div>}
        {activeTab === 'dj' && <div>DJ 控制台（待重构）</div>}
        {activeTab === 'sing' && <div>唱歌模式（待重构）</div>}
        {activeTab === 'scene' && (
          <SoundLightPanel bpm={bpm} setBpm={setBpm} currentMode={currentMode} setCurrentMode={handleModeChange} />
        )}
        {activeTab === 'tuner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['low', 'mid', 'high'].map(band => (
              <div key={band} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 40, fontSize: 'var(--spark-font-size-sm)', fontWeight: 500 }}>
                  {band === 'low' ? '低频' : band === 'mid' ? '中频' : '高频'}
                </span>
                <input type="range" min="-12" max="12" value={eqBands[band as keyof typeof eqBands]} onChange={e => setEqBands({ ...eqBands, [band]: Number(e.target.value) })} style={{ flex: 1 }} />
                <span style={{ width: 40, textAlign: 'right', fontSize: 'var(--spark-font-size-sm)' }}>
                  {eqBands[band as keyof typeof eqBands] > 0 ? '+' : ''}{eqBands[band as keyof typeof eqBands]} dB
                </span>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'market' && (
          <div>嗨吧市场（待重构）</div>
        )}
      </SparkCard>

      {/* 否决按钮 + 设备状态 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <SparkCard padding={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VetoButton onVeto={handleVeto} />
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)', marginTop: 12 }}>
            按下立即静音 + 全亮白光（&lt;100ms 急停）
          </div>
        </SparkCard>
        <SparkCard padding={24}>
          <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: 'var(--spark-font-size-lg)' }}>📡 设备状态</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 'var(--spark-font-size-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Aura Box</span><span style={{ color: '#10b981' }}>● 在线</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Soul Knob 心跳</span><span>1.2s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DMX 灯光</span><span>已连接 · 512 通道</span>
            </div>
          </div>
        </SparkCard>
      </div>
    </div>
  );
}