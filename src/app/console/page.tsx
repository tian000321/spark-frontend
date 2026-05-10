'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ModeSelector from '@/components/ModeSelector';
import PlanInterpreter from '@/components/PlanInterpreter';
import VetoButton from '@/components/VetoButton';
import BPMGauge from '@/components/BPMGauge';
import CostCounter from '@/components/CostCounter';

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

const mockVibePacks = [
  { id: 'p1', name: '午夜高潮-暗夜', creator: 'DJ Spark', style: 'Techno', bpm: 128, calls: 2300, price: '¥29.90/次', icon: '🎵', license: 'exclusive' },
  { id: 'p2', name: '暖场爵士-晚餐', creator: 'Mellow Beats', style: 'Jazz', bpm: 72, calls: 1203, price: '¥19.90/次', icon: '🎷', license: 'cc' },
  { id: 'p3', name: '深蓝 Chill 包', creator: 'Late Night Lab', style: 'Ambient', bpm: 80, calls: 891, price: '¥24.90/次', icon: '🌊', license: 'non-exclusive' },
];

const mockDeviceStatus = {
  auraBoxOnline: true,
  soulKnobHeartbeat: '1.2s',
  bpm: 72,
  cost: 0.47,
  plan: { summary: '维持 MODE_A 暖场氛围，BPM 稳定在 72，灯光暖黄渐变', details: '预计未来 15 分钟内不切换模式，根据场内人数自动微调音量' },
};

const generateSpectrum = (bpm: number) => Array.from({ length: 32 }, () => Math.floor(Math.random() * 100 * (bpm / 120)));

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
        {spectrum.map((v, i) => (
          <div key={i} style={{ width: '100%', maxWidth: 8, height: `${Math.min(v, 100)}%`, background: 'linear-gradient(to top, #00c6ff, #0072ff)', borderRadius: '4px 4px 0 0', transition: 'height 0.1s ease' }} />
        ))}
      </div>
    </div>
  );
};

// ==================== 声光电智控组件 ====================
const SoundLightElectricPanel = ({ currentMode, setCurrentMode, bpm, setBpm }: any) => {
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

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 12 }}>🤖 智能编排</h3>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input type="checkbox" checked={autoMode} onChange={e => setAutoMode(e.target.checked)} />
        <span>开启声光电智能编排（根据时段自动调整）</span>
      </label>

      <h3 style={{ marginBottom: 12 }}>🎛️ 手动编排</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>音乐风格</label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
            <option>Jazz</option><option>Techno</option><option>House</option><option>Ambient</option>
          </select>
        </div>
        <div>
          <label>音量</label>
          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: '100%' }} />
          <p style={{ fontSize: 12 }}>{volume}%</p>
        </div>
        <div>
          <label>灯光模式</label>
          <select value={lightMode} onChange={e => setLightMode(e.target.value)} style={selectStyle}>
            <option>暖黄渐变</option><option>频闪激光联动</option><option>深蓝呼吸</option><option>全亮白光</option>
          </select>
        </div>
        <div>
          <label>BPM</label>
          <input type="range" min="0" max="140" value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%' }} />
          <p style={{ fontSize: 12 }}>{bpm} BPM</p>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={smokeOn} onChange={e => setSmokeOn(e.target.checked)} /> 🌫️ 烟雾
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={laserOn} onChange={e => setLaserOn(e.target.checked)} /> ⚡ 激光
        </label>
      </div>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)'
};

// ==================== 浮动智能助手 ====================
const FloatingAssistant = ({ mode, setMode, setBpm, setPlan, setCost }: any) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([
    { id: 'init', role: 'assistant', content: '👋 嗨，有需要直接对我说，比如“切换高潮模式”或“点歌”。' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let reply = '';
      if (query.includes('高潮') || query.includes('mode_b')) {
        setMode('MODE_B'); setBpm(128); setPlan('午夜高潮模式：BPM 128，频闪激光联动'); reply = '✅ 已切换至午夜高潮模式。';
      } else if (query.includes('chill') || query.includes('mode_c')) {
        setMode('MODE_C'); setBpm(80); setPlan('Chill 模式：BPM 80，深蓝呼吸灯'); reply = '✅ 已切换至 Chill 模式。';
      } else if (query.includes('暖场') || query.includes('mode_a')) {
        setMode('MODE_A'); setBpm(72); setPlan('暖场模式：BPM 72，暖黄渐变'); reply = '✅ 已切回暖场模式。';
      } else if (query.includes('点歌') || query.includes('播放')) {
        const song = query.replace(/点歌|播放/g, '').trim();
        reply = song ? `🎵 已点歌：${song}` : '请告诉我歌名。';
      } else if (query.includes('灯光')) {
        reply = '💡 灯光已调整。';
      } else if (query.includes('急停') || query.includes('停止')) {
        setMode('MODE_D'); setBpm(0); setPlan('应急模式：全场静音'); reply = '🛑 已执行紧急停止。';
      } else {
        reply = '收到，我会帮你处理。';
      }
      if (reply) setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply }]);
    }, 500);
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
          background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          fontSize: 24, cursor: 'pointer', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        🤖
      </button>

      {/* 对话窗口 */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, width: 360, height: 480,
          background: 'var(--bg-card)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🤖 嗨吧助手</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '8px 12px', borderRadius: 8,
                  background: msg.role === 'user' ? 'var(--btn-primary-bg)' : '#f3f4f6',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
              placeholder="说点什么..."
              style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid var(--input-border)', fontSize: 13, background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
            <button onClick={handleSend} style={{ padding: '8px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ==================== 主页面 ====================
export default function ConsolePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'media';
  const validTabs = ['media', 'dj', 'sing', 'scene', 'tuner', 'market'];
  const defaultTab = validTabs.includes(initialTab) ? initialTab : 'media';

  const [currentMode, setCurrentMode] = useState('MODE_A');
  const [bpm, setBpm] = useState(72);
  const [cost, setCost] = useState(0.47);
  const [plan, setPlan] = useState({ summary: '暖场模式', details: 'BPM 72，暖黄渐变' });
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [playingItem, setPlayingItem] = useState<any>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'audio' | 'mv' | 'djvideo'>('all');
  const [vocalMode, setVocalMode] = useState(false);
  const [eqBands, setEqBands] = useState({ low: 0, mid: 0, high: 0 });
  const [reverb, setReverb] = useState(30);
  const [autoTune, setAutoTune] = useState(true);
  const [songRequests, setSongRequests] = useState<string[]>(['告白气球 - 周杰伦', 'Last Dance - 伍佰']);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && validTabs.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleVeto = () => {
    setCurrentMode('MODE_D');
    setBpm(0);
    setPlan({ summary: '应急安全模式', details: '全场静音，全亮白光' });
  };

  const playNext = () => {
    if (songRequests.length > 0) setSongRequests(prev => prev.slice(1));
  };

  const renderMediaGrid = (type: string) => (
    <div style={{ overflowX: 'auto', marginTop: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>类型</th><th style={{ padding: '8px' }}>歌曲/视频</th><th style={{ padding: '8px' }}>艺人</th><th style={{ padding: '8px' }}>风格</th><th style={{ padding: '8px' }}>BPM</th><th style={{ padding: '8px' }}>时长</th><th style={{ padding: '8px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {mediaLibrary.filter(m => type === 'all' ? true : m.type === type).map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td>{item.type === 'audio' ? '🎵' : item.type === 'mv' ? '🎬' : '🎧'}</td>
              <td style={{ fontWeight: 500 }}>{item.title}</td><td>{item.artist}</td><td>{item.style}</td><td>{item.bpm}</td><td>{item.duration}</td>
              <td><button onClick={() => setPlayingItem(item)} style={{ padding: '4px 12px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>播放</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>🎛️ 智能嗨吧控台</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>实时掌控现场氛围 · 旋转选模式，按下急停，一切尽在指尖</p>
      </div>

      {/* 实时指标卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <BPMGauge bpm={bpm} />
        <CostCounter cost={cost} />
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>当前模式</p>
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
          { key: 'scene', label: '🎭 声光电智控' },
          { key: 'tuner', label: '🎚️ 智能调音' },
          { key: 'market', label: '🛒 嗨吧市场' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', border: 'none', background: 'transparent',
              borderBottom: activeTab === tab.key ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal', cursor: 'pointer', fontSize: 14, marginBottom: -14,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
        {/* 媒体库选项卡 */}
        {activeTab === 'media' && (
          <>
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
          </>
        )}

        {/* DJ模式 */}
        {activeTab === 'dj' && (
          <>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
          </>
        )}

        {/* 唱歌模式 */}
        {activeTab === 'sing' && (
          <>
            <div style={{ marginBottom: 20, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input placeholder="点歌或输入指令" style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--input-border)', borderRadius: 6, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                <button onClick={playNext} style={{ padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>切歌 ⏭</button>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>📋 待播队列</p>
                {songRequests.map((song, i) => (
                  <div key={i} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>{i + 1}. {song}</div>
                ))}
              </div>
            </div>
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
              </div>
              <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>实时修音</p>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={autoTune} onChange={e => setAutoTune(e.target.checked)} />
                  自动音准修正
                </label>
              </div>
            </div>
            <h3 style={{ marginBottom: 16 }}>声场优化</h3>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>混响/延迟自适应空间声场</p>
              <input type="range" min="0" max="100" value={reverb} onChange={e => setReverb(Number(e.target.value))} style={{ width: '100%' }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>混响强度：{reverb}%</p>
            </div>
          </>
        )}

        {/* 声光电智控 */}
        {activeTab === 'scene' && (
          <SoundLightElectricPanel currentMode={currentMode} setCurrentMode={setCurrentMode} bpm={bpm} setBpm={setBpm} />
        )}

        {/* 智能调音 */}
        {activeTab === 'tuner' && (
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
        )}

        {/* 嗨吧市场 */}
        {activeTab === 'market' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {mockVibePacks.map(p => (
              <div key={p.id} style={{ padding: 16, background: '#f9fafb', borderRadius: 8, textAlign: 'center' }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <p style={{ fontWeight: 500 }}>{p.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.creator}</p>
                <p style={{ fontWeight: 500 }}>{p.price}</p>
                <button style={{ width: '100%', marginTop: 8, padding: '6px 0', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>应用</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 否决按钮 + 设备状态 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VetoButton onVeto={handleVeto} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>按下立即静音 + 全亮白光（&lt;100ms 急停）</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📡 设备状态</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Aura Box</span><span style={{ color: '#10b981' }}>● 在线</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Soul Knob 心跳</span><span>1.2s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DMX 灯光</span><span>已连接 · 512通道</span>
            </div>
          </div>
        </div>
      </div>

      {/* 浮动智能助手 */}
      <FloatingAssistant
        mode={currentMode}
        setMode={setCurrentMode}
        setBpm={setBpm}
        setPlan={setPlan}
        setCost={setCost}
      />
    </div>
  );
}