import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { ArrowLeft, Check, Download, Scissors } from 'lucide-react'

export default function NestingPlanDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { findNestingPlan } = useStore()
  const plan = findNestingPlan(id!)

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-steel-900 font-body">
        <div className="text-center">
          <p className="mb-4 text-xl text-steel-400">未找到该排版方案</p>
          <button
            onClick={() => navigate('/nesting')}
            className="rounded-lg bg-industrial-orange px-4 py-2 text-white hover:bg-industrial-orange-light"
          >
            返回工作台
          </button>
        </div>
      </div>
    )
  }

  const rate = plan.utilizationRate / 100
  const circumference = 2 * Math.PI * 50
  const offset = circumference * (1 - rate)

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/nesting')}
          className="flex items-center gap-1 rounded-lg bg-steel-700 px-3 py-2 text-steel-300 hover:bg-steel-600 hover:text-white"
        >
          <ArrowLeft size={18} />
          返回
        </button>
        <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-[3]">
          <div className="rounded-lg bg-steel-800 p-6 industrial-border">
            <h3 className="mb-4 text-sm text-steel-400">排版预览</h3>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center">
                <span className="mb-1 text-xs text-steel-400 font-display [writing-mode:vertical-lr] rotate-180">
                  {plan.sheetSize.height}mm
                </span>
                <div
                  className="relative rounded border border-steel-500/50 bg-steel-900"
                  style={{
                    width: '100%',
                    aspectRatio: `${plan.sheetSize.width} / ${plan.sheetSize.height}`,
                    maxWidth: '100%',
                    backgroundImage:
                      'linear-gradient(rgba(74,85,104,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(74,85,104,0.2) 1px, transparent 1px)',
                    backgroundSize: '8% 8%',
                  }}
                >
                  <div
                    className="absolute rounded-sm border border-industrial-orange/50 bg-industrial-orange/20"
                    style={{ left: '3%', top: '2%', width: '28%', height: '12%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-blue/50 bg-industrial-blue/20"
                    style={{ left: '33%', top: '2%', width: '22%', height: '9%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-green/50 bg-industrial-green/20"
                    style={{ left: '3%', top: '17%', width: '16%', height: '22%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-cyan/50 bg-industrial-cyan/20"
                    style={{ left: '57%', top: '4%', width: '38%', height: '10%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-yellow/50 bg-industrial-yellow/20"
                    style={{ left: '22%', top: '14%', width: '34%', height: '15%' }}
                  />
                  <div
                    className="absolute rounded-sm border border-industrial-red/50 bg-industrial-red/20"
                    style={{ left: '3%', top: '42%', width: '45%', height: '14%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-1 text-center text-xs text-steel-400 font-display">
              {plan.sheetSize.width}mm
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-4 text-sm text-steel-400">利用率</h3>
            <div className="flex items-center justify-center">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="50" fill="none" stroke="#243447" strokeWidth="10" />
                <circle
                  cx="65"
                  cy="65"
                  r="50"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  className="gauge-ring"
                />
                <text
                  x="65"
                  y="65"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FF6B35"
                  className="font-display"
                  fontSize="26"
                >
                  {plan.utilizationRate.toFixed(1)}%
                </text>
              </svg>
            </div>
          </div>

          <div className="rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-4 text-sm text-steel-400">图纸列表</h3>
            <div className="space-y-2">
              {plan.drawingIds.map(dId => (
                <div key={dId} className="flex items-center justify-between rounded bg-steel-700/50 px-3 py-2">
                  <span className="text-sm text-steel-200">图纸 {dId}</span>
                  <span className="text-xs text-industrial-cyan">查看</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-steel-800 p-5 industrial-border">
            <h3 className="mb-4 text-sm text-steel-400">板材信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-steel-400">规格</span>
                <span className="text-steel-200 font-display">{plan.sheetSpec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-400">尺寸</span>
                <span className="text-steel-200 font-display">
                  {plan.sheetSize.width}×{plan.sheetSize.height}mm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-400">零件数</span>
                <span className="text-steel-200 font-display">{plan.partCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-400">创建日期</span>
                <span className="text-steel-200 font-display">{plan.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-industrial-green px-4 py-2.5 text-white hover:opacity-90">
              <Check size={18} />
              确认方案
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-steel-700 px-4 py-2.5 text-steel-200 hover:bg-steel-600">
              <Download size={18} />
              导出NC代码
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-industrial-orange px-4 py-2.5 text-white hover:bg-industrial-orange-light">
              <Scissors size={18} />
              开始切割
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
