export default function PlanInterpreter({ plan }: { plan: { summary: string; details: string } }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <span>🤖 AI 计划解释器</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">实时</span>
      </h3>
      <p className="text-sm font-medium text-gray-800">{plan.summary}</p>
      <p className="text-xs text-gray-500 mt-1">{plan.details}</p>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">✓ 确认执行</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">↻ 微调参数</button>
      </div>
    </div>
  );
}