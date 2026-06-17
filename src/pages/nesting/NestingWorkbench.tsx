import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Plus, Play, Eye } from 'lucide-react'

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'text-industrial-yellow' },
  confirmed: { label: '已确认', color: 'text-industrial-green' },
  cutting: { label: '切割中', color: 'text-industrial-orange' },
  completed: { label: '已完成', color: 'text-industrial-blue' },
}

export default function NestingWorkbench() {
  const navigate = useNavigate()
  const { nestingPlans } = useStore()
  const selectedPlan = nestingPlans[0]
  const rate = selectedPlan.utilizationRate / 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference * (1 - rate)

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">套料排版工作台</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-industrial-orange px-4 py-2 text-white hover:bg-industrial-orange-light">
            <Plus size={18} />
            新建排版方案
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-steel-700 px-4 py-2 text-steel-300 hover:bg-steel-600">
            <Play size={18} />
            自动排版
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-6">
        <div className="flex-[2]">
          <div className="rounded-lg bg-steel-800 p-4 industrial-border">
            <div className="flex items-end gap-3">
              <div className="flex flex-col items-center">
                <span className="mb-1 text-xs text-steel-400 font-display [writing-mode:vertical-lr] rotate-180">
                  {selectedPlan.sheetSize.height}mm
                </span>
                <div
                  className="relative rounded border border-steel-500/50 bg-steel-900"
                  style={{
                    width: '100%',
                    aspectRatio: `${selectedPlan.sheetSize.width} / ${selectedPlan.sheetSize.height}`,
                    maxWidth: '100%',
                    backgroundImage:
                      'linear-gradient(rgba(74,85,104,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(74,85,104,0.2) 1px, transparent 1px)',
                    backgroundSize: '10% 10%',
                  }}
                >
                  <div
                    className="absolute rounded-sm border border-industrial-orange/50 bg-industrial-orange/20"
                    style={{ left: '3%', top: '2%', width: '30%', height: '12%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-blue/50 bg-industrial-blue/20"
                    style={{ left: '35%', top: '2%', width: '25%', height: '10%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-green/50 bg-industrial-green/20"
                    style={{ left: '3%', top: '18%', width: '18%', height: '20%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-cyan/50 bg-industrial-cyan/20"
                    style={{ left: '62%', top: '5%', width: '35%', height: '11%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-1 text-center text-xs text-steel-400 font-display">
              {selectedPlan.sheetSize.width}mm
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-3 text-sm text-steel-400">利用率</h3>
            <div className="flex items-center justify-center">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="40" fill="none" stroke="#243447" strokeWidth="8" />
                <circle
                  cx="55"
                  cy="55"
                  r="40"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                  className="gauge-ring"
                />
                <text
                  x="55"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FF6B35"
                  className="font-display"
                  fontSize="22"
                >
                  {selectedPlan.utilizationRate.toFixed(1)}%
                </text>
              </svg>
            </div>
          </div>

          <div className="flex-1 rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-3 text-sm text-steel-400">零件清单</h3>
            <div className="space-y-2">
              {selectedPlan.parts.map((part, i) => (
                <div key={i} className="flex items-center justify-between rounded bg-steel-700/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: part.color }} />
                    <span className="text-sm text-steel-200">{part.name}</span>
                  </div>
                  <span className="font-display text-industrial-orange">×{part.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-3 text-sm text-steel-400">板材信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-steel-400">规格</span>
                <span className="text-steel-200 font-display">{selectedPlan.sheetSpec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-400">尺寸</span>
                <span className="text-steel-200 font-display">
                  {selectedPlan.sheetSize.width}×{selectedPlan.sheetSize.height}mm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <h3 className="mb-4 text-lg font-bold text-white">排版方案列表</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-600 text-steel-400">
              <th className="pb-3 text-left font-normal">方案名称</th>
              <th className="pb-3 text-left font-normal">板材规格</th>
              <th className="pb-3 text-left font-normal">利用率</th>
              <th className="pb-3 text-left font-normal">零件数</th>
              <th className="pb-3 text-left font-normal">状态</th>
              <th className="pb-3 text-left font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {nestingPlans.map(plan => (
              <tr key={plan.id} className="border-b border-steel-700/50 transition-colors hover:bg-steel-700/30">
                <td className="py-3 text-steel-200">{plan.name}</td>
                <td className="py-3 font-display text-steel-300">{plan.sheetSpec}</td>
                <td className="py-3 font-display text-industrial-orange">
                  {plan.utilizationRate.toFixed(1)}%
                </td>
                <td className="py-3 font-display text-steel-200">{plan.partCount}</td>
                <td className={`py-3 ${statusMap[plan.status].color}`}>
                  {statusMap[plan.status].label}
                </td>
                <td className="py-3">
                  <Link
                    to={`/nesting/${plan.id}`}
                    className="flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-light"
                  >
                    <Eye size={14} />
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
