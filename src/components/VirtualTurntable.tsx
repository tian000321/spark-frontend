'use client';
import { useState, useEffect, useRef } from 'react';
import SparkButton from '@/components/ui/SparkButton';
import SparkBadge from '@/components/ui/SparkBadge';

// 模拟节拍波形
const generateWaveform = () => {
  const bars = 40;
  return Array.from({ length: bars }, () => Math.floor(Math.random() * 100));
};

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
}

interface Props {
  onPlan: (plan: string) => void;       // 向控台发送计划
  onCompensation: () => void;           // 触发赔付
  isVetoed: boolean;                    // 是否被否决
}

export default function VirtualTurntable({ onPlan, onCompensation, isVetoed }: Props) {
  const [channelA, setChannelA] = useState<Song>({ id: 'a1', title: 'Midnight Pulse', artist: 'DeepWaves', bpm: 128 });
  const [channelB, setChannelB] = useState<Song | null>(null);
  const [activeChannel, setActiveChannel] = useState<'A' | 'B'>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpmA, setBpmA] = useState(128);
  const [bpmB, setBpmB] = useState(128);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [scratchEffect, setScratchEffect] = useState(false);
  const [waveformA] = useState(generateWaveform());
  const [waveformB] = useState(generateWaveform());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 模拟播放进度
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgressA(prev => Math.min(prev + 1, 100));
        if (channelB) setProgressB(prev => Math.min(prev + 1, 100));
      }, 200);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, channelB]);

  // 否决监听
  useEffect(() => {
    if (isVetoed) {
      setIsPlaying(false);
      setProgressA(0);
      setProgressB(0);
    }
  }, [isVetoed]);

  const playPause = () => setIsPlaying(!isPlaying);

  // 手动搓碟
  const handleScratch = () => {
    setScratchEffect(true);
    if (activeChannel === 'A') {
      setProgressA(prev => Math.max(prev - 10, 0));
    } else if (channelB) {
      setProgressB(prev => Math.max(prev - 10, 0));
    }
    setTimeout(() => setScratchEffect(false), 300);
  };

  // AI 自动混音
  const handleAutoMix = () => {
    if (!channelB) return;
    const bpmDiff = Math.abs(bpmA - bpmB);

    if (bpmDiff > 15) {
      // BPM 突变触发赔付
      onCompensation();
      onPlan('⚠️ AI 混音检测到 BPM 剧烈突变，已自动停止并触发赔付。');
      setIsPlaying(false);
      return;
    }

    const planText = `🤖 AI 计划：将在 ${activeChannel === 'A' ? '4 个小节' : '下一个节拍'} 内，将 ${activeChannel === 'A' ? channelA.title : channelB?.title} 切换到 ${activeChannel === 'A' ? channelB?.title : channelA.title}。BPM 将从 ${activeChannel === 'A' ? bpmA : bpmB} 平滑过渡至 ${activeChannel === 'A' ? bpmB : bpmA}。`;
    onPlan(planText);

    // 模拟平滑过渡
    setTimeout(() => {
      setActiveChannel(activeChannel === 'A' ? 'B' : 'A');
      setProgressA(0);
      setProgressB(0);
    }, 2000);
  };

  // 加载歌曲到B通道
  const loadToChannelB = (song: Song) => {
    setChannelB(song);
    setBpmB(song.bpm);
  };

  const songList: Song[] = [
    { id: 'a1', title: 'Midnight Pulse', artist: 'DeepWaves', bpm: 128 },
    { id: 'a2', title: 'City Lights', artist: 'LateNight', bpm: 72 },
    { id: 'a3', title: 'Bass Drop', artist: 'ClubThunder', bpm: 130 },
    { id: 'a4', title: 'Silk Road', artist: 'SilkSounds', bpm: 80 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 双通道播放器 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* 通道 A */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, border: `2px solid ${activeChannel === 'A' ? 'var(--spark-brand)' : 'transparent'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>🎵 通道 A</span>
            <SparkBadge variant="info">{channelA.title}</SparkBadge>
          </div>
          <div style={{ marginBottom: 12, fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>
            {channelA.artist} · BPM {bpmA}
          </div>
          {/* 虚拟黑胶盘 / 波形 */}
          <div style={{ position: 'relative', height: 60, background: '#000', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', padding: 4, gap: 1 }}>
              {waveformA.map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}%`, background: i < (progressA / 100) * waveformA.length ? 'var(--spark-brand)' : '#333', transition: 'background 0.1s' }} />
              ))}
            </div>
            <div style={{ position: 'absolute', left: `${progressA}%`, top: 0, bottom: 0, width: 2, background: '#fff' }} />
          </div>
          <input type="range" min="60" max="150" value={bpmA} onChange={e => setBpmA(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        {/* 通道 B */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, border: `2px solid ${activeChannel === 'B' ? 'var(--spark-brand)' : 'transparent'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>🎵 通道 B</span>
            {channelB ? <SparkBadge variant="info">{channelB.title}</SparkBadge> : <span style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-muted)' }}>空</span>}
          </div>
          <div style={{ marginBottom: 12, fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>
            {channelB ? `${channelB.artist} · BPM ${bpmB}` : '未加载歌曲'}
          </div>
          <div style={{ position: 'relative', height: 60, background: '#000', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', padding: 4, gap: 1 }}>
              {waveformB.map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}%`, background: channelB && i < (progressB / 100) * waveformB.length ? '#a29bfe' : '#333', transition: 'background 0.1s' }} />
              ))}
            </div>
            {channelB && <div style={{ position: 'absolute', left: `${progressB}%`, top: 0, bottom: 0, width: 2, background: '#fff' }} />}
          </div>
          <input type="range" min="60" max="150" value={bpmB} onChange={e => setBpmB(Number(e.target.value))} disabled={!channelB} style={{ width: '100%' }} />
        </div>
      </div>

      {/* DJ 控制面板 */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <SparkButton variant="primary" size="md" onClick={playPause}>
          {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
        </SparkButton>
        <SparkButton variant="secondary" size="md" onClick={handleScratch}>
          💿 搓碟 {scratchEffect ? '🔥' : ''}
        </SparkButton>
        <SparkButton variant="secondary" size="md" onClick={handleAutoMix} disabled={!channelB || !isPlaying}>
          🎚️ AI 自动混音
        </SparkButton>
        <span style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-muted)' }}>
          当前输出：通道 {activeChannel}
        </span>
      </div>

      {/* 曲库列表 */}
      <div style={{ marginTop: 8 }}>
        <p style={{ fontWeight: 500, marginBottom: 8, fontSize: 'var(--spark-font-size-sm)' }}>📀 曲库</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {songList.map(song => (
            <button
              key={song.id}
              onClick={() => loadToChannelB(song)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: 'var(--spark-text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--spark-font-size-sm)',
                transition: 'all 0.2s',
              }}
            >
              {song.title} ({song.bpm} BPM)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}