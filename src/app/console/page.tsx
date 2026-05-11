'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import SparkCard from '@/components/ui/SparkCard';
import SparkButton from '@/components/ui/SparkButton';
import SparkModal from '@/components/ui/SparkModal';
import SparkBadge from '@/components/ui/SparkBadge';

// ==================== 媒体库数据 ====================
const mediaLibrary = [
  { id: 'a1', title: 'Midnight Pulse', artist: 'DeepWaves', type: 'audio', style: 'Techno', bpm: 128, duration: '4:32' },
  { id: 'a2', title: 'City Lights', artist: 'LateNight', type: 'audio', style: 'Jazz', bpm: 72, duration: '3:50' },
  { id: 'a3', title: 'Bass Drop', artist: 'ClubThunder', type: 'audio', style: 'House', bpm: 130, duration: '5:15' },
  { id: 'a4', title: 'Silk Road', artist: 'SilkSounds', type: 'audio', style: 'Ambient', bpm: 80, duration: '6:10' },
  { id: 'v1', title: '午夜高潮 MV', artist: 'DJ Spark', type: 'mv', style: 'Techno', bpm: 128, duration: '5:00' },
  { id: 'v2', title: '暖场爵士 MV', artist: 'Mellow Beats', type: 'mv', style: 'Jazz', bpm: 72, duration: '4:20' },
  { id: 'd1', title: 'Rock Anthem DJ Mix', artist: 'LiveBandX', type: 'djvideo', style: 'Rock', bpm: 110, duration: '4:05' },
  { id: 'd2', title: 'Silk Road DJ Mix', artist: 'SilkSounds', type: 'djvideo', style: 'Ambient', bpm: 80, duration: '5:30' },
];

const vibePacks = [
  { id: 'p1', name: '午夜高潮-暗夜', creator: 'DJ Spark', style: 'Techno', bpm: 128, calls: 2300, price: '¥29.90', icon: '🎵', license: 'exclusive' },
  { id: 'p2', name: '暖场爵士-晚餐', creator: 'Mellow Beats', style: 'Jazz', bpm: 72, calls: 1203, price: '¥19.90', icon: '🎷', license: 'cc' },
  { id: 'p3', name: '深蓝 Chill 包', creator: 'Late Night Lab', style: 'Ambient', bpm: 80, calls: 891, price: '¥24.90', icon: '🌊', license: 'non-exclusive' },
];

const generateSpectrum = (bpm: number) => Array.from({ length: 32 }, () => Math.floor(Math.random() * 100 * (bpm / 120)));

// 频谱可视化
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
        {spectrum.map((v, i) => (
          <div key={i} style={{ width: '100%', maxWidth: 8, height: `${Math.min(v, 100)}%`, background: 'linear-gradient(to top, #00c6ff, #0072ff)', borderRadius: '4px 4px 0 0', transition: 'height 0.1s ease' }} />
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
          {item.type === 'mv' ? 'MV' : item.type === 'djvideo' ? 'DJ' : '音频'} 播放中
        </div>
      </div>
      <SpectrumVisualizer bpm={item.bpm} />
    </div>
    <p style={{ marginTop: 8 }}>正在播放：{item.title} - {item.artist} ({item.bpm} BPM)</p>
    <button onClick={onStop} style={{ padding: '6px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>停止播放</button>
  </div>
);

// 媒体列表表格
const MediaTable = ({ items, onPlay }: { items: any[]; onPlay: (item: any) => void }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
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
        {items.map(item => (
          <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <td>{item.type === 'audio' ? '🎵' : item.type === 'mv' ? '🎬' : '🎧'}</td>
            <td style={{ fontWeight: 500 }}>{item.title}</td>
            <td>{item.artist}</td>
            <td>{item.style}</td>
            <td>{item.bpm}</td>
            <td>{item.duration}</td>
            <td><SparkButton size="sm" variant="primary" onClick={() => onPlay(item)}>播放</SparkButton></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 点歌队列组件
const SongRequestSystem = ({ requests, setRequests, playNext, mode }: any) => {
  const [requestName, setRequestName] = useState('');
  const handleSubmit = () => {
    if (!requestName.trim()) return;
    setRequests((prev: string[]) => [...prev, requestName]);
    setRequestName('');
  };
  const removeSong = (index: number) => setRequests((prev: string[]) => prev.filter((_, i) => i !== index));
  const topSong = (index: number) => {
    if (index === 0) return;
    setRequests((prev: string[]) => { const newArr = [...prev]; const [item] = newArr.splice(index, 1); newArr.unshift(item); return newArr; });
  };
  const smartNext = () => {
    const styleMap: Record<string, string> = { MODE_A: 'Jazz', MODE_B: 'Techno', MODE_C: 'Ambient' };
    const targetStyle = styleMap[mode] || 'Techno';
    const candidates = mediaLibrary.filter(m => m.style === targetStyle);
    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setRequests((prev: string[]) => [`${pick.title} - ${pick.artist} (智能推荐)`, ...prev]);
      playNext();
    }
  };
  return (
    <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="点歌或输入指令" value={requestName} onChange={e => setRequestName(e.target.value)} style={inputStyle} />
        <SparkButton size="sm" onClick={handleSubmit}>点歌</SparkButton>
        <SparkButton size="sm" variant="secondary" onClick={playNext}>切歌 ⏭</SparkButton>
        <SparkButton size="sm" variant="ghost" onClick={smartNext}>智能切歌 ✨</SparkButton>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>📋 待播队列 ({requests.length})</p>
        {requests.map((r: string, i: number) => (
          <div key={i} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i + 1}. {r}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => topSong(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#a29bfe' }}>置顶</button>
              <button onClick={() => removeSong(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444' }}>取消</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 声光电智控（之前已提供）
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
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" checked={autoMode} onChange={e => setAutoMode(e.target.checked)} />
        <span>开启声光电智能编排</span>
      </label>
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>🎛️ 手动编排</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label>音乐风格</label><select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}><option>Jazz</option><option>Techno</option><option>House</option><option>Ambient</option></select></div>
        <div><label>音量</label><input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: '100%' }} /><div>{volume}%</div></div>
        <div><label>灯光模式</label><select value={lightMode} onChange={e => setLightMode(e.target.value)} style={selectStyle}><option>暖黄渐变</option><option>频闪激光联动</option><option>深蓝呼吸</option><option>全亮白光</option></select></div>
        <div><label>BPM</label><input type="range" min="0" max="140" value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%' }} /><div>{bpm} BPM</div></div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
        <label><input type="checkbox" checked={smokeOn} onChange={e => setSmokeOn(e.target.checked)} /> 🌫️ 烟雾</label>
        <label><input type="checkbox" checked={laserOn} onChange={e => setLaserOn(e.target.checked)} /> ⚡ 激光</label>
      </div>
    </div>
  );
};

// 否决按钮
const VetoButton = ({ onVeto }: { onVeto: () => void }) => {
  const [pressed, setPressed] = useState(false);
  const handlePress = () => { setPressed(true); onVeto(); setTimeout(() => setPressed(false), 2000); };
  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={handlePress} disabled={pressed} style={{ width: 100, height: 100, borderRadius: '50%', border: 'none', background: pressed ? '#9ca3af' : '#ef4444', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
        {pressed ? '已否决' : '否决'}
      </button>
    </div>
  );
};

const inputStyle: React.CSSProperties = { flex: 1, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: 'var(--spark-text-primary)' };
const selectStyle: React.CSSProperties = { width: '100%', padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'var(--spark-text-primary)' };

// ==================== 主组件 ====================
export default function ConsolePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'media';
  const validTabs = ['media', 'dj', 'sing', 'scene', 'tuner', 'market'];
  const defaultTab = validTabs.includes(initialTab) ? initialTab : 'media';

  const [currentMode, setCurrentMode] = useState('MODE_A');
  const [bpm, setBpm] = useState(72);
  const [cost, setCost] = useState(0.47);
  const [plan, setPlan] = useState({ summary: '暖场模式，BPM 72', details: '等待指令...' });
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [playingItem, setPlayingItem] = useState<any>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'audio' | 'mv' | 'djvideo'>('all');
  const [eqBands, setEqBands] = useState({ low: 0, mid: 0, high: 0 });
  const [vocalMode, setVocalMode] = useState(false);
  const [autoTune, setAutoTune] = useState(true);
  const [reverb, setReverb] = useState(30);
  const [songRequests, setSongRequests] = useState<string[]>(['告白气球 - 周杰伦', 'Last Dance - 伍佰']);

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
  const playNext = () => {
    if (songRequests.length > 0) {
      setSongRequests(prev => prev.slice(1));
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--spark-font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>🎛️ 智能嗨吧控台</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24 }}>实时掌控现场氛围 · 旋转选模式，按下急停，一切尽在指尖</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <SparkCard padding={16} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>实时 BPM</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#a855f7' }}>{bpm}</div>
        </SparkCard>
        <SparkCard padding={16} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>今日成本</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>¥{cost.toFixed(2)}</div>
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)' }}>按秒赔付保障中</div>
        </SparkCard>
        <SparkCard padding={16} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)' }}>当前模式</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--spark-brand-light)' }}>{currentMode}</div>
        </SparkCard>
      </div>

      {/* 计划解释器 */}
      <SparkCard padding={20} style={{ borderLeft: '4px solid var(--spark-brand)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span>🤖 AI 计划解释器</span>
          <SparkBadge variant="info">实时</SparkBadge>
        </div>
        <div style={{ fontWeight: 500 }}>{plan.summary}</div>
        <div style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>{plan.details}</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <SparkButton size="sm" onClick={() => alert('已执行')}>✓ 确认执行</SparkButton>
          <SparkButton size="sm" variant="secondary" onClick={() => alert('微调')}>↻ 微调参数</SparkButton>
        </div>
      </SparkCard>

      {/* 选项卡 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {[
          { key: 'media', label: '🎬 媒体库' }, { key: 'dj', label: '🎧 DJ模式' }, { key: 'sing', label: '🎤 唱歌模式' },
          { key: 'scene', label: '🎭 声光电智控' }, { key: 'tuner', label: '🎚️ 智能调音' }, { key: 'market', label: '🛒 嗨吧市场' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 24px', border: 'none', background: 'transparent', borderBottom: activeTab === tab.key ? '2px solid var(--spark-brand)' : '2px solid transparent', color: activeTab === tab.key ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)', fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer', marginBottom: -14 }}>{tab.label}</button>
        ))}
      </div>

      {/* 内容区 */}
      <SparkCard padding={20}>
        {/* 媒体库 */}
        {activeTab === 'media' && (
          <>
            {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['all', 'audio', 'mv', 'djvideo'] as const).map(f => (
                <SparkButton key={f} size="sm" variant={mediaFilter === f ? 'primary' : 'ghost'} onClick={() => setMediaFilter(f)}>
                  {f === 'all' ? '全部' : f === 'audio' ? '🎵 音频' : f === 'mv' ? '🎬 MV' : '🎧 DJ视频'}
                </SparkButton>
              ))}
            </div>
            <MediaTable items={mediaLibrary.filter(m => mediaFilter === 'all' ? true : m.type === mediaFilter)} onPlay={setPlayingItem} />
          </>
        )}

        {/* DJ模式 */}
        {activeTab === 'dj' && (
          <>
            {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['audio', 'djvideo'] as const).map(f => (
                <SparkButton key={f} size="sm" variant={mediaFilter === f ? 'primary' : 'ghost'} onClick={() => setMediaFilter(f)}>
                  {f === 'audio' ? '🎵 音频' : '🎧 DJ视频'}
                </SparkButton>
              ))}
            </div>
            <MediaTable items={mediaLibrary.filter(m => m.type === 'audio' || m.type === 'djvideo')} onPlay={setPlayingItem} />
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>🎧 DJ 专业控制台</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <SparkButton variant="primary" size="sm" onClick={() => alert('喊麦：全场注意！')}>🎤 喊麦</SparkButton>
                <SparkButton variant="secondary" size="sm" onClick={() => alert('搓碟音效')}>💿 搓碟</SparkButton>
                <SparkButton variant="secondary" size="sm" onClick={() => alert('采样器加载')}>📀 采样器</SparkButton>
                <SparkButton variant="secondary" size="sm" onClick={() => alert('节拍锁定')}>🎚️ 节拍同步</SparkButton>
              </div>
              <div style={{ marginTop: 16 }}>
                <span>手动BPM</span>
                <input type="range" min="60" max="160" value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%' }} />
                <div>当前：{bpm} BPM</div>
              </div>
            </div>
          </>
        )}

        {/* 唱歌模式 */}
        {activeTab === 'sing' && (
          <>
            {playingItem && <MediaPlayer item={playingItem} onStop={() => setPlayingItem(null)} />}
            <SongRequestSystem requests={songRequests} setRequests={setSongRequests} playNext={playNext} mode={currentMode} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['audio', 'mv'] as const).map(f => (
                <SparkButton key={f} size="sm" variant={mediaFilter === f ? 'primary' : 'ghost'} onClick={() => setMediaFilter(f)}>
                  {f === 'audio' ? '🎵 音频' : '🎬 MV'}
                </SparkButton>
              ))}
            </div>
            <MediaTable items={mediaLibrary.filter(m => m.type === 'audio' || m.type === 'mv')} onPlay={setPlayingItem} />
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>🎤 唱歌控制</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label>人声切换</label>
                  <input type="checkbox" checked={vocalMode} onChange={e => setVocalMode(e.target.checked)} /> 原唱/伴唱
                </div>
                <div>
                  <label>自动修音</label>
                  <input type="checkbox" checked={autoTune} onChange={e => setAutoTune(e.target.checked)} /> 音准修正
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <span>混响强度：{reverb}%</span>
                <input type="range" min="0" max="100" value={reverb} onChange={e => setReverb(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          </>
        )}

        {/* 声光电智控 */}
        {activeTab === 'scene' && <SoundLightPanel bpm={bpm} setBpm={setBpm} currentMode={currentMode} setCurrentMode={handleModeChange} />}

        {/* 智能调音 */}
        {activeTab === 'tuner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['low', 'mid', 'high'].map(band => (
              <div key={band} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 40 }}>{band === 'low' ? '低频' : band === 'mid' ? '中频' : '高频'}</span>
                <input type="range" min="-12" max="12" value={eqBands[band as keyof typeof eqBands]} onChange={e => setEqBands({ ...eqBands, [band]: Number(e.target.value) })} style={{ flex: 1 }} />
                <span style={{ width: 40, textAlign: 'right' }}>{eqBands[band as keyof typeof eqBands] > 0 ? '+' : ''}{eqBands[band as keyof typeof eqBands]} dB</span>
              </div>
            ))}
          </div>
        )}

        {/* 嗨吧市场 */}
        {activeTab === 'market' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {vibePacks.map(p => (
              <SparkCard key={p.id} padding={16} hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <SparkBadge variant={p.license === 'exclusive' ? 'warning' : 'info'}>{p.license === 'exclusive' ? '独家' : '非独家'}</SparkBadge>
                </div>
                <h3 style={{ fontWeight: 600, margin: '8px 0' }}>{p.name}</h3>
                <p style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>{p.creator} · {p.style} · {p.bpm} BPM</p>
                <p style={{ fontWeight: 500, color: 'var(--spark-brand-light)' }}>{p.price}</p>
                <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)' }}>调用 {p.calls}</div>
                <SparkButton size="sm" fullWidth onClick={() => alert('已应用到场所')} style={{ marginTop: 12 }}>应用</SparkButton>
              </SparkCard>
            ))}
          </div>
        )}
      </SparkCard>

      {/* 否决按钮 + 设备状态 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <SparkCard padding={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VetoButton onVeto={handleVeto} />
          <div style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-muted)', marginTop: 12 }}>按下立即静音 + 全亮白光（&lt;100ms 急停）</div>
        </SparkCard>
        <SparkCard padding={24}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>📡 设备状态</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 'var(--spark-font-size-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Aura Box</span><span style={{ color: '#10b981' }}>● 在线</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Soul Knob 心跳</span><span>1.2s</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>DMX 灯光</span><span>已连接 · 512 通道</span></div>
          </div>
        </SparkCard>
      </div>
    </div>
  );
}