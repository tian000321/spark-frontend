'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ModeSelector from '@/components/ModeSelector';
import PlanInterpreter from '@/components/PlanInterpreter';
import VetoButton from '@/components/VetoButton';
import BPMGauge from '@/components/BPMGauge';
import CostCounter from '@/components/CostCounter';

// ==================== 媒体库数据 ====================
const mediaLibrary = [
  { id: 'a1', title: 'Midnight Pulse', artist: 'DeepWaves', type: 'audio', style: 'Techno', bpm: 128, duration: '4:32', url: '', cover: '' },
  { id: 'a2', title: 'City Lights', artist: 'LateNight', type: 'audio', style: 'Jazz', bpm: 72, duration: '3:50', url: '', cover: '' },
  { id: 'a3', title: 'Bass Drop', artist: 'ClubThunder', type: 'audio', style: 'House', bpm: 130, duration: '5:15', url: '', cover: '' },
  { id: 'a4', title: 'Silk Road', artist: 'SilkSounds', type: 'audio', style: 'Ambient', bpm: 80, duration: '6:10', url: '', cover: '' },
  { id: 'v1', title: '午夜高潮 MV', artist: 'DJ Spark', type: 'mv', style: 'Techno', bpm: 128, duration: '5:00', url: '/videos/midnight-mv.mp4', cover: '' },
  { id: 'v2', title: '暖场爵士 MV', artist: 'Mellow Beats', type: 'mv', style: 'Jazz', bpm: 72, duration: '4:20', url: '/videos/jazz-mv.mp4', cover: '' },
  { id: 'd1', title: 'Rock Anthem DJ Mix', artist: 'LiveBandX', type: 'djvideo', style: 'Rock', bpm: 110, duration: '4:05', url: '/videos/rock-live.mp4', cover: '' },
  { id: 'd2', title: 'Silk Road DJ Mix', artist: 'SilkSounds', type: 'djvideo', style: 'Ambient', bpm: 80, duration: '5:30', url: '/videos/silk-live.mp4', cover: '' },
];

const mockVibePacks = [
  { id: 'p1', name: '午夜高潮-暗夜', creator: 'DJ Spark', style: 'Techno / House', bpm: '120-140', calls: 2300, price: '¥29.90/次', icon: '🎵', license: 'exclusive', copyrightProof: '0xabc123...' },
  { id: 'p2', name: '暖场爵士-晚餐时光', creator: 'Mellow Beats', style: 'Jazz / Ambient', bpm: '60-80', calls: 1203, price: '¥19.90/次', icon: '🎷', license: 'cc', copyrightProof: '0xdef456...' },
  { id: 'p3', name: '深蓝 Chill 包', creator: 'Late Night Lab', style: 'Downtempo / Ambient', bpm: '70-90', calls: 891, price: '¥24.90/次', icon: '🌊', license: 'non-exclusive', copyrightProof: '0x789ghi...' },
];

const mockDeviceStatus = {
  auraBoxOnline: true,
  soulKnobHeartbeat: '1.2s',
  bpm: 72,
  cost: 0.47,
  plan: { summary: '维持 MODE_A 暖场氛围，BPM 稳定在 72，灯光暖黄渐变', details: '预计未来 15 分钟内不切换模式，根据场内人数自动微调音量' },
};

const generateSpectrum = (bpm: number) => Array.from({ length: 32 }, () => Math.floor(Math.random() * 100 * (bpm / 120)));

// ==================== 点歌队列组件 ====================
const SongRequestSystem = ({ requests, setRequests, playNext, mode }: any) => {
  const [requestName, setRequestName] = useState('');

  const handleSubmit = () => {
    if (!requestName.trim()) return;
    setRequests((prev: string[]) => [...prev, requestName]);
    setRequestName('');
  };

  const removeSong = (index: number) => {
    setRequests((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const topSong = (index: number) => {
    if (index === 0) return;
    setRequests((prev: string[]) => {
      const newArr = [...prev];
      const [item] = newArr.splice(index, 1);
      newArr.unshift(item);
      return newArr;
    });
  };

  // 智能切歌：根据当前模式推荐风格匹配的歌曲
  const smartNext = () => {
    const styleMap: Record<string, string> = { MODE_A: 'Jazz', MODE_B: 'Techno', MODE_C: 'Ambient' };
    const targetStyle = styleMap[mode] || 'Techno';
    const candidates = mediaLibrary.filter(m => m.style === targetStyle);
    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setRequests((prev: string[]) => [`${pick.title} - ${pick.artist} (智能推荐)`, ...prev]);
      playNext(); // 立即切到下一首
    }
  };

  return (
    <div style={{ marginBottom: 20, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="输入你想点的歌名或艺人" value={requestName} onChange={e => setRequestName(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--input-border)', borderRadius: 6, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
        <button onClick={handleSubmit} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>点歌</button>
        <button onClick={playNext} style={{ padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>切歌 ⏭</button>
        <button onClick={smartNext} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>智能切歌 ✨</button>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>📋 待播队列 ({requests.length})</p>
        {requests.map((r: string, i: number) => (
          <div key={i} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i + 1}. {r}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => topSong(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--btn-primary-bg)' }}>置顶</button>
              <button onClick={() => removeSong(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#dc2626' }}>取消</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 场景编排组件 ====================
const SceneArranger = ({ setCurrentMode, currentMode }: { setCurrentMode: (m: string) => void; currentMode: string }) => {
  const [sceneBpm, setSceneBpm] = useState(120);
  const [sceneLight, setSceneLight] = useState('频闪');
  const [sceneStyle, setSceneStyle] = useState('Techno');
  const [autoScene, setAutoScene] = useState(false);

  useEffect(() => {
    if (autoScene) {
      const now = new Date().getHours();
      const autoMode = now < 18 ? 'MODE_A' : now < 23 ? 'MODE_B' : 'MODE_C';
      setCurrentMode(autoMode);
    }
  }, [autoScene]);

  const sceneRules: Record<string, string> = {
    MODE_A: '🌅 暖场模式：BPM 自动维持在 60-80，灯光暖黄渐变，偏好爵士/氛围音乐。',
    MODE_B: '🔥 高潮模式：BPM 升至 120-140，灯光频闪联动，主打 Techno/House。',
    MODE_C: '🌌 Chill 模式：BPM 回落 70-90，深蓝紫呼吸灯光，氛围音乐放松。',
    MODE_D: '🚨 应急模式：全场静音，灯光全亮白光。',
  };

  return (
    <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12, marginBottom: 20 }}>
      <h3 style={{ marginBottom: 16 }}>🎭 场景编排</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>目标 BPM</label>
          <input type="range" min="60" max="140" value={sceneBpm} onChange={e => setSceneBpm(Number(e.target.value))} style={{ width: '100%' }} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sceneBpm} BPM</p>
        </div>
        <div>
          <label>灯光效果</label>
          <select value={sceneLight} onChange={e => setSceneLight(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }}>
            <option>暖黄渐变</option><option>频闪</option><option>呼吸蓝</option><option>全亮白光</option>
          </select>
        </div>
        <div>
          <label>音乐风格</label>
          <select value={sceneStyle} onChange={e => setSceneStyle(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }}>
            <option>Techno</option><option>House</option><option>Jazz</option><option>Ambient</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={autoScene} onChange={e => setAutoScene(e.target.checked)} />
            <span>🤖 智能场景编排</span>
          </label>
        </div>
      </div>
      <button onClick={() => alert(`场景已保存：BPM ${sceneBpm}，灯光 ${sceneLight}，风格 ${sceneStyle}`)} style={{ marginTop: 16, padding: '8px 20px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        应用自定义场景
      </button>
      <div style={{ marginTop: 20, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid var(--border-color)' }}>
        <h4 style={{ marginBottom: 8 }}>📖 当前场景智能规则</h4>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sceneRules[currentMode] || '暂无规则'}</p>
      </div>
    </div>
  );
};

// ==================== DJ 专业控制组件 ====================
const DJConsole = () => {
  const [showShout, setShowShout] = useState(false);
  const handleShout = () => {
    setShowShout(true);
    setTimeout(() => setShowShout(false), 2000);
  };

  return (
    <div style={{ padding: 20, background: '#f9fafb', borderRadius: 12 }}>
      <h3 style={{ marginBottom: 16 }}>🎧 DJ 专业控制台</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={handleShout} style={djButtonStyle}>🎤 喊麦</button>
        <button onClick={() => alert('搓碟音效已触发')} style={djButtonStyle}>💿 搓碟</button>
        <button onClick={() => alert('采样器：已加载预设音效')} style={djButtonStyle}>📀 采样器</button>
        <button onClick={() => alert('节拍同步锁定中...')} style={djButtonStyle}>🎚️ 节拍同步</button>
        <button onClick={() => alert('EQ 预设：重低音增强')} style={djButtonStyle}>🎛️ EQ预设</button>
      </div>
      {showShout && (
        <div style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', borderRadius: 8, textAlign: 'center' }}>
          🔊 全场注意！现在是 DJ 时间！Put your hands up! 🙌
        </div>
      )}
    </div>
  );
};

const djButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'var(--btn-primary-bg)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: 14,
};

// ==================== 频谱可视化组件 ====================
const SpectrumVisualizer = ({ bpm }: { bpm: number }) => {
  const [spectrum, setSpectrum] = useState(generateSpectrum(bpm));
  useEffect(() => {
    const interval = setInterval(() => setSpectrum(generateSpectrum(bpm)), 100);
    return () => clearInterval(interval);
  }, [bpm]);

  return (
    <div style={{ padding: 16, background: '#1a1a2e', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 200 }}>
      <p style={{ color: '#fff', fontSize: 14, marginBottom: 12 }}>🎚️ 实时频谱</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, flex: 1 }}>
        {spectrum.map((value, index) => (
          <div key={index} style={{
            width: '100%', maxWidth: 8, height: `${Math.min(value, 100)}%`,
            background: `linear-gradient(to top, #00c6ff, #0072ff)`,
            borderRadius: '4px 4px 0 0', transition: 'height 0.1s ease',
          }} />
        ))}
      </div>
    </div>
  );
};

// 媒体播放器
const MediaPlayer = ({ item, onStop }: { item: any; onStop: () => void }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ padding: 16, background: '#000', borderRadius: 12, minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {item.type !== 'audio' ? (
          <video autoPlay loop muted style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} src={item.url || '/videos/placeholder.mp4'} />
        ) : (
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 48 }}>🎵</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 12 }}>
          {item.type === 'mv' ? 'MV 播放中' : item.type === 'djvideo' ? 'DJ 视频播放中' : '音频播放中'}
        </div>
      </div>
      <SpectrumVisualizer bpm={item.bpm} />
    </div>
    <p style={{ marginTop: 8 }}>正在播放：{item.title} - {item.artist} ({item.bpm} BPM)</p>
    <button onClick={onStop} style={{ padding: '6px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>停止播放</button>
  </div>
);

export default function ConsolePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const validTabs = ['media', 'dj', 'sing', 'scene', 'tuner', 'market'];
  const defaultTab = initialTab && validTabs.includes(initialTab) ? initialTab : 'media';

  const [currentMode, setCurrentMode] = useState('MODE_A');
  const [bpm, setBpm] = useState(72);
  const [cost, setCost] = useState(0.47);
  const [plan, setPlan] = useState(mockDeviceStatus.plan);
  const [activeFeature, setActiveFeature] = useState<string>(defaultTab);
  const [playingItem, setPlayingItem] = useState<any>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'audio' | 'mv' | 'djvideo'>('all');
  const [vocalMode, setVocalMode] = useState(false);
  const [eqBands, setEqBands] = useState({ low: 0, mid: 0, high: 0 });
  const [reverb, setReverb] = useState(30);
  const [autoTune, setAutoTune] = useState(true);

  // 点歌队列
  const [songRequests, setSongRequests] = useState<string[]>(['告白气球 - 周杰伦', 'Last Dance - 伍佰']);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && validTabs.includes(tab)) setActiveFeature(tab);
  }, [searchParams]);

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    const bpmMap: Record<string, number> = { MODE_A: 72, MODE_B: 128, MODE_C: 80, MODE_D: 0 };
    setBpm(bpmMap[mode] || 72);
    setCost(Math.random() * 2 + 0.3);
    const planMap: Record<string, { summary: string; details: string }> = {
      MODE_A: { summary: '暖场模式已激活，爵士/氛围电子，暖黄光缓慢渐变', details: 'BPM 60-80，预计持续至客人陆续入场结束' },
      MODE_B: { summary: '午夜高潮模式已激活，Techno/House，频闪激光联动', details: 'BPM 120-140，能量逐渐攀升，灯光与低频同步' },
      MODE_C: { summary: 'Chill/After Party 模式已激活，Downtempo/Ambient，深蓝紫呼吸', details: 'BPM 70-90，营造放松氛围，灯光柔和渐变' },
      MODE_D: { summary: '应急安全模式！全场静音，灯光全亮白光', details: '所有 AI 决策暂停，等待人工恢复操作' },
    };
    setPlan(planMap[mode] || mockDeviceStatus.plan);
  };

  const handleVeto = () => handleModeChange('MODE_D');

  // 切歌功能：移除队列第一首歌
  const playNext = () => {
    setSongRequests(prev => prev.slice(1));
    // 模拟开始播放下一首
    if (songRequests.length > 1) {
      const nextSong = songRequests[0];
      alert(`切歌成功，正在播放下一首：${nextSong}`);
    }
  };

  const renderMediaGrid = (type: string) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>类型</th>
              <th style={{ padding: '8px' }}>歌曲/视频</th>
              <th style={{ padding: '8px' }}>艺人</th>
              <th style={{ padding: '8px' }}>风格</th>
              <th style={{ padding: '8px' }}>BPM</th>
              <th style={{ padding: '8px' }}>时长</th>
              <th style={{ padding: '8px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {mediaLibrary.filter(m => type === 'all' ? true : m.type === type).map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px' }}>{item.type === 'audio' ? '🎵' : item.type === 'mv' ? '🎬' : '🎧'}</td>
                <td style={{ padding: '8px', fontWeight: 500 }}>{item.title}</td>
                <td style={{ padding: '8px' }}>{item.artist}</td>
                <td style={{ padding: '8px' }}>{item.style}</td>
                <td style={{ padding: '8px' }}>{item.bpm}</td>
                <td style={{ padding: '8px' }}>{item.duration}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setPlayingItem(item)} style={{ padding: '4px 12px', border: '1px solid var(--input-border)', borderRadius: 4, background: 'var(--btn-primary-bg)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>播放</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 4 }}>🎛️ 智能嗨吧控台</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>实时掌控现场氛围 · 旋转选模式，按下急停，一切尽在指尖</p>
      </div>

      {/* 实时指标卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <BPMGauge bpm={bpm} />
        <CostCounter cost={cost} />
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>当前模式</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--btn-primary-bg)' }}>{currentMode}</p>
        </div>
      </div>

      {/* 计划解释器 */}
      <div style={{ marginBottom: 24 }}>
        <PlanInterpreter plan={plan} />
      </div>

      {/* 功能选项卡 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', borderBottom: '2px solid var(--border-color)', paddingBottom: 12 }}>
        {[
          { key: 'media', label: '🎬 媒体库' },
          { key: 'dj', label: '🎧 DJ模式' },
          { key: 'sing', label: '🎤 唱歌模式' },
          { key: 'scene', label: '🎭 场景托管' },
          { key: 'tuner', label: '🎚️ 智能调音' },
          { key: 'market', label: '🛒 嗨吧市场' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFeature(tab.key)}
            style={{
              padding: '10px 20px', border: 'none', background: 'transparent',
              borderBottom: activeFeature === tab.key ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeFeature === tab.key ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeFeature === tab.key ? 'bold' : 'normal', cursor: 'pointer', fontSize: 14, marginBottom: -14,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========= 媒体库 ========= */}
      {activeFeature === 'media' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['all', 'audio', 'mv', 'djvideo'].map(f => (
              <button key={f} onClick={() => setMediaFilter(f as any)} style={{
                padding: '6px 16px', border: '1px solid var(--input-border)', borderRadius: 20,
                background: mediaFilter === f ? 'var(--btn-primary-bg)' : 'var(--input-bg)',
                color: mediaFilter === f ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontSize: 13,
              }}>
                {f === 'all' ? '全部' : f === 'audio' ? '🎵 音频' : f === 'mv' ? '🎬 MV' : '🎧 DJ视频'}
              </button>
            ))}
          </div>
          {renderMediaGrid(mediaFilter)}
        </div>
      )}

      {/* ========= DJ模式（媒体库+专业控制台） ========= */}
      {activeFeature === 'dj' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
          <h3 style={{ marginBottom: 16 }}>DJ 媒体库</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['audio', 'djvideo'].map(f => (
              <button key={f} onClick={() => setMediaFilter(f as any)} style={{
                padding: '6px 16px', border: '1px solid var(--input-border)', borderRadius: 20,
                background: mediaFilter === f ? 'var(--btn-primary-bg)' : 'var(--input-bg)',
                color: mediaFilter === f ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontSize: 13,
              }}>
                {f === 'audio' ? '🎵 音频' : '🎧 DJ视频'}
              </button>
            ))}
          </div>
          {renderMediaGrid(mediaFilter)}
          <h3 style={{ margin: '16px 0' }}>AI DJ 控制台</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>自动混音</p>
              <button style={{ marginTop: 8, padding: '6px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>开启自动混音</button>
            </div>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>手动BPM</p>
              <input type="range" min="60" max="160" value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%' }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>当前：{bpm} BPM</p>
            </div>
          </div>
          <DJConsole />
        </div>
      )}

      {/* ========= 唱歌模式（点歌系统+切歌+智能切歌） ========= */}
      {activeFeature === 'sing' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
          <SongRequestSystem requests={songRequests} setRequests={setSongRequests} playNext={playNext} mode={currentMode} />
          <h3 style={{ margin: '16px 0' }}>唱歌媒体库</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['audio', 'mv'].map(f => (
              <button key={f} onClick={() => setMediaFilter(f as any)} style={{
                padding: '6px 16px', border: '1px solid var(--input-border)', borderRadius: 20,
                background: mediaFilter === f ? 'var(--btn-primary-bg)' : 'var(--input-bg)',
                color: mediaFilter === f ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontSize: 13,
              }}>
                {f === 'audio' ? '🎵 音频' : '🎬 MV'}
              </button>
            ))}
          </div>
          {renderMediaGrid(mediaFilter)}
          <h3 style={{ margin: '16px 0' }}>智能唱歌控制</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>人声切换</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={vocalMode} onChange={e => setVocalMode(e.target.checked)} />
                启用原唱/伴唱切换
              </label>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>当前：{vocalMode ? '伴唱模式' : '原唱模式'}</p>
            </div>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>实时修音</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={autoTune} onChange={e => setAutoTune(e.target.checked)} />
                自动音准修正
              </label>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>AI 不得擅自改变歌手原声特质</p>
            </div>
          </div>
          <h3 style={{ marginBottom: 16 }}>声场优化</h3>
          <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>混响/延迟自适应空间声场</p>
            <input type="range" min="0" max="100" value={reverb} onChange={e => setReverb(Number(e.target.value))} style={{ width: '100%' }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>混响强度：{reverb}%</p>
          </div>
        </div>
      )}

      {/* ========= 场景托管（编排+智能编排） ========= */}
      {activeFeature === 'scene' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>一键场景切换</h3>
          <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
          <SceneArranger setCurrentMode={setCurrentMode} currentMode={currentMode} />
        </div>
      )}

      {/* ========= 智能调音（手动调音+频谱） ========= */}
      {activeFeature === 'tuner' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>智能均衡器</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['low', 'mid', 'high'].map(band => (
                <div key={band} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, fontSize: 14, fontWeight: 500 }}>{band === 'low' ? '低频' : band === 'mid' ? '中频' : '高频'}</span>
                  <input type="range" min="-12" max="12" value={eqBands[band]} onChange={e => setEqBands({ ...eqBands, [band]: Number(e.target.value) })} style={{ flex: 1 }} />
                  <span style={{ width: 40, textAlign: 'right', fontSize: 13 }}>{eqBands[band] > 0 ? '+' : ''}{eqBands[band]} dB</span>
                </div>
              ))}
            </div>
            <SpectrumVisualizer bpm={bpm} />
          </div>
        </div>
      )}

      {/* ========= 嗨吧市场 ========= */}
      {activeFeature === 'market' && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>🛒 氛围包市场</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>浏览由专业 DJ 和音乐制作人创作的氛围包，一键应用到你的场所。</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {mockVibePacks.map((pkg) => (
              <div key={pkg.id} style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{pkg.icon}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{pkg.name}</h3>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, background: pkg.license === 'exclusive' ? '#d1fae5' : '#dbeafe', color: pkg.license === 'exclusive' ? '#065f46' : '#1e40af' }}>
                    {pkg.license === 'exclusive' ? '独家' : pkg.license === 'cc' ? 'CC' : '非独家'}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{pkg.creator}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: '#f3f4f6', color: '#6b7280' }}>{pkg.style}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, background: '#f3f4f6', color: '#6b7280' }}>🎵 {pkg.bpm} BPM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📞 {pkg.calls?.toLocaleString()} 次调用</span>
                  <span style={{ fontWeight: 500, color: 'var(--btn-primary-bg)' }}>{pkg.price}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 12, wordBreak: 'break-all' }}>
                  存证：{pkg.copyrightProof}
                </div>
                <button style={{ width: '100%', padding: '10px 0', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
                  应用到此场所
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 否决按钮 + 设备状态 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VetoButton onVeto={handleVeto} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>按下立即静音 + 全亮白光（&lt;100ms 急停）</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📡 设备状态</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>Aura Box</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 12px', borderRadius: 12, fontSize: 12,
                background: mockDeviceStatus.auraBoxOnline ? '#d1fae5' : '#f3f4f6',
                color: mockDeviceStatus.auraBoxOnline ? '#065f46' : '#6b7280',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: mockDeviceStatus.auraBoxOnline ? '#10b981' : '#9ca3af' }} />
                {mockDeviceStatus.auraBoxOnline ? '在线' : '离线'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>Soul Knob 心跳</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mockDeviceStatus.soulKnobHeartbeat}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>DMX 灯光</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>已连接 · 512 通道</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>音响输出</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>3.5mm 线路输出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}