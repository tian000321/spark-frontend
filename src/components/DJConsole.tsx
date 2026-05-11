'use client';
import { useState } from 'react';
import SparkButton from '@/components/ui/SparkButton';

const shouts = [
  '🔥 全场注意！Put your hands up！',
  '🎤 左边！右边！跟着节奏跳起来！',
  '💥 今晚不嗨不归！尖叫声！',
  '🎵 这里是 DJ Spark，带你们飞！',
  '🌟 灯光全开，感受低音的震动！',
  '🙌 我说Spark，你说牛逼！',
];

const scratchSounds = ['🎵 吱——嘎！', '💿 啾！啾！', '🎧 嗡嗡嗡...', '🎵 咚次哒次！'];
const samplePresets = ['🥁 鼓组 Loop', '🎸 贝斯 Riff', '🎤 人声切片', '🔊 特效音'];

export default function DJConsole({ bpm }: { bpm: number }) {
  const [showShout, setShowShout] = useState('');
  const [scratchEffect, setScratchEffect] = useState('');
  const [loadedSample, setLoadedSample] = useState('');
  const [beatLocked, setBeatLocked] = useState(false);

  const handleShout = () => {
    const random = shouts[Math.floor(Math.random() * shouts.length)];
    setShowShout(random);
    setTimeout(() => setShowShout(''), 2500);
  };

  const handleScratch = () => {
    const sound = scratchSounds[Math.floor(Math.random() * scratchSounds.length)];
    setScratchEffect(sound);
    setTimeout(() => setScratchEffect(''), 800);
  };

  const handleLoadSample = (sample: string) => {
    setLoadedSample(sample);
  };

  const handleBeatSync = () => {
    setBeatLocked(!beatLocked);
  };

  return (
    <div style={{ padding: 20, background: 'var(--spark-bg-card)', borderRadius: 'var(--spark-radius-lg)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 style={{ fontWeight: 600, marginBottom: 16 }}>🎧 DJ 专业控制台</h3>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <SparkButton variant="primary" size="sm" onClick={handleShout}>🎤 喊麦</SparkButton>
        <SparkButton variant="secondary" size="sm" onClick={handleScratch}>💿 搓碟</SparkButton>
        <SparkButton variant="secondary" size="sm" disabled>📀 采样器</SparkButton>
        <SparkButton
          variant={beatLocked ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleBeatSync}
        >
          🎚️ 节拍同步 {beatLocked ? '✓' : ''}
        </SparkButton>
      </div>

      {showShout && (
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #dc2626, #f59e0b)',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 'var(--spark-font-size-md)',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          🔊 {showShout}
        </div>
      )}

      {scratchEffect && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(108,92,231,0.15)',
          borderRadius: 8,
          fontSize: 'var(--spark-font-size-sm)',
          fontWeight: 500,
          marginBottom: 12,
        }}>
          {scratchEffect}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-text-secondary)', marginBottom: 6 }}>采样器预设</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {samplePresets.map(s => (
            <button
              key={s}
              onClick={() => handleLoadSample(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: `1px solid ${loadedSample === s ? 'var(--spark-brand)' : 'rgba(255,255,255,0.1)'}`,
                background: loadedSample === s ? 'rgba(108,92,231,0.2)' : 'transparent',
                color: loadedSample === s ? 'var(--spark-brand-light)' : 'var(--spark-text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--spark-font-size-sm)',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {loadedSample && (
          <p style={{ fontSize: 'var(--spark-font-size-xs)', color: 'var(--spark-brand-light)', marginTop: 8 }}>
            ✅ 已加载：{loadedSample}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
        <span style={{ fontSize: 'var(--spark-font-size-sm)', color: 'var(--spark-text-secondary)' }}>当前 BPM</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--spark-brand-light)' }}>{bpm}</span>
        {beatLocked && (
          <span style={{ fontSize: 'var(--spark-font-size-xs)', color: '#10b981', fontWeight: 500 }}>节拍已锁定</span>
        )}
      </div>
    </div>
  );
}