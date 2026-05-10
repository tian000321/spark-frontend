export default function CostCounter({ cost }: { cost: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-xs text-gray-500">今日成本</p>
      <p className="text-3xl font-mono font-bold text-green-600">¥{cost.toFixed(2)}</p>
      <p className="text-xs text-gray-400 mt-1">按秒计赔保障中</p>
    </div>
  );
}