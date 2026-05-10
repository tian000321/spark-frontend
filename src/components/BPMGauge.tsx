export default function BPMGauge({ bpm }: { bpm: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-xs text-gray-500">实时 BPM</p>
      <p className="text-3xl font-mono font-bold text-purple-600">{bpm}</p>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(bpm / 1.8, 100)}%` }}></div>
      </div>
    </div>
  );
}