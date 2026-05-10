'use client';

import { useState } from 'react';

export default function VetoButton({ onVeto }: { onVeto: () => void }) {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    onVeto();
    setTimeout(() => setPressed(false), 2000);
  };

  return (
    <div className="text-center">
      <button
        onClick={handlePress}
        disabled={pressed}
        className={`w-32 h-32 rounded-full text-white font-bold text-lg transition-all ${
          pressed
            ? 'bg-gray-400 scale-90'
            : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg'
        }`}
      >
        {pressed ? '已否决' : '否决'}
      </button>
      <p className="text-xs text-gray-500 mt-2">按下立即静音 + 全亮白光</p>
    </div>
  );
}