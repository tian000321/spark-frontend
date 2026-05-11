'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import SparkButton from '@/components/ui/SparkButton';

// 模拟曲库
const SONG_LIBRARY = [
  { id: 'a1', title: 'Midnight Pulse', artist: 'DeepWaves', bpm: 128 },
  { id: 'a2', title: 'City Lights', artist: 'LateNight', bpm: 72 },
  { id: 'a3', title: 'Bass Drop', artist: 'ClubThunder', bpm: 130 },
  { id: 'a4', title: 'Silk Road', artist: 'SilkSounds', bpm: 80 },
];

// ---------- 圆形转盘组件 ----------
const JogWheel = ({ label, onScratch }: { label: string; onScratch: (delta: number) => void }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef(0);
  const dragging = useRef(false);

  const getAngle = (e: React.MouseEvent) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastAngle.current = getAngle(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const currentAngle = getAngle(e);
    let delta = currentAngle - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    onScratch(delta);
    lastAngle.current = currentAngle;
  };

  const handleMouseUp = () => { dragging.current = false; };

  return (
    <div
      ref={wheelRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: 120, height: 120, borderRadius: '50%',
        background: 'conic-gradient(#333 0deg, #555 90deg, #333 180deg, #555 270deg, #333 360deg)',
        border: '4px solid #888', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'grab', userSelect: 'none',
        margin: '0 auto', position: 'relative', boxShadow: '0 0 12px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontSize: 10, color: '#ccc', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>🎧</div>
        {label}
      </div>
    </div>
  );
};

// ---------- 主 DJ 控制器 ----------
export default function DJController() {
  const [channelA, setChannelA] = useState({ song: SONG_LIBRARY[0], bpm: SONG_LIBRARY[0].bpm, volume: 80, high: 0, mid: 0, low: 0 });
  const [channelB, setChannelB] = useState({ song: SONG_LIBRARY[1], bpm: SONG_LIBRARY[1].bpm, volume: 80, high: 0, mid: 0, low: 0 });
  const [crossfader, setCrossfader] = useState(50); // 0=全A，100=全B
  const [isPlaying, setIsPlaying] = useState(false);
  const [scratchMsg, setScratchMsg] = useState('');

  const handleScratchA = useCallback((delta: number) => {
    const change = delta * 0.02; // 模拟转速影响 BPM
    setChannelA(prev => ({ ...prev, bpm: Math.max(60, Math.min(200, prev.bpm - change)) }));
    setScratchMsg('💿 搓碟 A');
    setTimeout(() => setScratchMsg(''), 600);
  }, []);

  const handleScratchB = useCallback((delta: number) => {
    const change = delta * 0.02;
    setChannelB(prev => ({ ...prev, bpm: Math.max(60, Math.min(200, prev.bpm - change)) }));
    setScratchMsg('💿 搓碟 B');
    setTimeout(() => setScratchMsg(''), 600);
  }, []);

  const playPause = () => setIsPlaying(!isPlaying);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* 顶部波形区域（简化） */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: 60 }}>
        <div style={{ background: '#111', borderRadius: 8, display: 'flex', alignItems: 'flex-end', padding: 4, gap: 1 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: `${Math.sin(i * 0.3) * 40 + 50}%`, background: i < (isPlaying ? 40 : 0) ? 'var(--spark-brand)' : '#333', borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ background: '#111', borderRadius: 8, display: 'flex', alignItems: 'flex-end', padding: 4, gap: 1 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: `${Math.cos(i * 0.3) * 40 + 50}%`, background: i < (isPlaying ? 40 : 0) ? '#a29bfe' : '#333', borderRadius: 1 }} />
          ))}
        </div>
      </div>

      {/* 双通道转盘 + 推子 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {/* 通道 A */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--spark-brand-light)' }}>通道 A</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{channelA.song.title}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{channelA.song.artist} · {channelA.bpm.toFixed(1)} BPM</div>
          <JogWheel label="A" onScratch={handleScratchA} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#888' }}>BPM</span>
            <input type="range" min="60" max="200" value={channelA.bpm} onChange={e => setChannelA(prev => ({ ...prev, bpm: Number(e.target.value) }))} style={sliderStyle} />
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#888' }}>高 中 低</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="range" min="-12" max="12" value={channelA.high} onChange={e => setChannelA(prev => ({ ...prev, high: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
              <input type="range" min="-12" max="12" value={channelA.mid} onChange={e => setChannelA(prev => ({ ...prev, mid: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
              <input type="range" min="-12" max="12" value={channelA.low} onChange={e => setChannelA(prev => ({ ...prev, low: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
            </div>
          </div>
        </div>

        {/* 通道 B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#a29bfe' }}>通道 B</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{channelB.song.title}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{channelB.song.artist} · {channelB.bpm.toFixed(1)} BPM</div>
          <JogWheel label="B" onScratch={handleScratchB} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#888' }}>BPM</span>
            <input type="range" min="60" max="200" value={channelB.bpm} onChange={e => setChannelB(prev => ({ ...prev, bpm: Number(e.target.value) }))} style={sliderStyle} />
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#888' }}>高 中 低</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="range" min="-12" max="12" value={channelB.high} onChange={e => setChannelB(prev => ({ ...prev, high: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
              <input type="range" min="-12" max="12" value={channelB.mid} onChange={e => setChannelB(prev => ({ ...prev, mid: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
              <input type="range" min="-12" max="12" value={channelB.low} onChange={e => setChannelB(prev => ({ ...prev, low: Number(e.target.value) }))} style={{ ...sliderStyle, flex: 1 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 横推子 + 中央控制 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px' }}>
        <span style={{ fontSize: 12, color: 'var(--spark-brand-light)' }}>A</span>
        <input type="range" min="0" max="100" value={crossfader} onChange={e => setCrossfader(Number(e.target.value))} style={{ ...sliderStyle, flex: 1 }} />
        <span style={{ fontSize: 12, color: '#a29bfe' }}>B</span>
        <SparkButton size="sm" variant={isPlaying ? 'secondary' : 'primary'} onClick={playPause}>
          {isPlaying ? '⏸' : '▶'}
        </SparkButton>
        {scratchMsg && (
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500 }}>{scratchMsg}</span>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
        Crossfader: {crossfader < 40 ? 'A 为主' : crossfader > 60 ? 'B 为主' : '混音中'}
      </div>

      {/* 曲库 */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
        {SONG_LIBRARY.map(song => (
          <div key={song.id} style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setChannelA(prev => ({ ...prev, song, bpm: song.bpm }))} style={libBtnStyle}>A</button>
            <span style={{ fontSize: 12, color: '#ccc', marginRight: 8 }}>{song.title} ({song.bpm})</span>
            <button onClick={() => setChannelB(prev => ({ ...prev, song, bpm: song.bpm }))} style={{ ...libBtnStyle, background: '#a29bfe' }}>B</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const sliderStyle: React.CSSProperties = { width: '100%', height: 4, cursor: 'pointer', accentColor: '#6C5CE7' };
const libBtnStyle: React.CSSProperties = { padding: '2px 10px', borderRadius: 4, border: 'none', background: 'var(--spark-brand)', color: '#fff', cursor: 'pointer', fontSize: 12 };