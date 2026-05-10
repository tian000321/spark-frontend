'use client';

const modes = [
  { id: 'MODE_A', label: '暖场', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'MODE_B', label: '高潮', color: 'bg-red-100 text-red-800' },
  { id: 'MODE_C', label: 'Chill', color: 'bg-blue-100 text-blue-800' },
  { id: 'MODE_D', label: '应急', color: 'bg-gray-100 text-gray-800' },
];

export default function ModeSelector({ currentMode, onModeChange }: { currentMode: string; onModeChange: (mode: string) => void }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">氛围模式快速切换</h3>
      <div className="flex gap-2 flex-wrap">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${mode.color} ${currentMode === mode.id ? 'ring-2 ring-offset-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}