import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Activity, Zap, Crosshair, ArrowRight } from 'lucide-react'
import { useStore } from '@/store'

const devices = [
  { id: '1', name: '1号激光切割机', status: 'running' as const, plan: '排版方案-A001' },
  { id: '2', name: '2号激光切割机', status: 'idle' as const, plan: '排版方案-A002' },
  { id: '3', name: '3号激光切割机', status: 'maintenance' as const, plan: '排版方案-B001' },
]

const statusColors = {
  running: 'bg-industrial-green',
  idle: 'bg-industrial-yellow',
  maintenance: 'bg-industrial-red',
}

const statusLabels = {
  running: '运行中',
  idle: '空闲',
  maintenance: '维护中',
}

function PressureGauge({ value }: { value: number }) {
  const angle = -90 + (value / 1.5) * 180
  const rad = (angle * Math.PI) / 180
  const cx = 60
  const cy = 55
  const r = 40
  const nx = cx + r * Math.cos(rad)
  const ny = cy - r * Math.sin(rad)

  return (
    <svg viewBox="0 0 120 70" className="w-full">
      <path d="M 15 55 A 45 45 0 0 1 105 55" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round" />
      <path d="M 15 55 A 45 45 0 0 1 105 55" fill="none" stroke="#FF6B35" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${(value / 1.5) * 141.37} 141.37`} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#FF6B35" />
      <text x={cx} y={cy + 15} textAnchor="middle" className="fill-industrial-orange font-display text-sm font-bold">
        {value.toFixed(1)} MPa
      </text>
    </svg>
  )
}

function Sparkline() {
  const heights = [12, 18, 14, 22, 16]
  return (
    <div className="flex items-end gap-0.5 h-6">
      {heights.map((h, i) => (
        <div key={i} className="w-1.5 bg-industrial-orange/60 rounded-t" style={{ height: `${h}px` }} />
      ))}
    </div>
  )
}

export default function CuttingMonitor() {
  const { cuttingRecords } = useStore()
  const [pressures, setPressures] = useState<number[]>([0.8, 0.78, 0.85])

  useEffect(() => {
    const interval = setInterval(() => {
      setPressures((prev) =>
        prev.map(() => parseFloat((0.7 + Math.random() * 0.2).toFixed(2)))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-industrial-orange" />
          <h1 className="text-2xl font-bold text-white font-display">切割监控</h1>
        </div>
        <Link to="/cutting/params" className="flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-light text-sm">
          参数设置 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {devices.map((device, idx) => (
          <div key={device.id} className="bg-steel-800 rounded-lg p-5 industrial-border card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[device.status]}`} />
                <span className="text-white font-display font-semibold text-lg">{device.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${device.status === 'running' ? 'bg-industrial-green/20 text-industrial-green' : device.status === 'idle' ? 'bg-industrial-yellow/20 text-industrial-yellow' : 'bg-industrial-red/20 text-industrial-red'}`}>
                {statusLabels[device.status]}
              </span>
            </div>

            <div className="text-steel-300 text-sm mb-3">
              当前方案: <span className="text-white">{device.plan}</span>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-3.5 h-3.5 text-industrial-orange" />
                <span className="text-steel-400 text-xs">切割气体压力</span>
              </div>
              <PressureGauge value={pressures[idx]} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5 text-industrial-cyan" />
                <span className="text-steel-300 text-sm">焦点位置:</span>
                <span className="text-white font-display font-semibold">-2.5mm</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-industrial-yellow" />
                  <span className="text-steel-300 text-sm">切割速度:</span>
                  <span className="text-white font-display font-semibold">3200 mm/min</span>
                </div>
                <Sparkline />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-steel-800 rounded-lg industrial-border">
        <div className="px-5 py-3 border-b border-steel-700">
          <h2 className="text-white font-display font-semibold">实时切割记录</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-steel-400 border-b border-steel-700">
                <th className="text-left px-5 py-3 font-body">排版方案</th>
                <th className="text-left px-5 py-3 font-body">操作员</th>
                <th className="text-left px-5 py-3 font-body">开始时间</th>
                <th className="text-left px-5 py-3 font-body">结束时间</th>
                <th className="text-left px-5 py-3 font-body">平均速度</th>
                <th className="text-left px-5 py-3 font-body">气体压力</th>
                <th className="text-left px-5 py-3 font-body">焦点位置</th>
                <th className="text-left px-5 py-3 font-body">状态</th>
              </tr>
            </thead>
            <tbody>
              {cuttingRecords.map((record) => (
                <tr key={record.id} className="border-b border-steel-700/50 hover:bg-steel-700/30 transition-colors">
                  <td className="px-5 py-3 text-white">{record.planName}</td>
                  <td className="px-5 py-3 text-steel-300">{record.operator}</td>
                  <td className="px-5 py-3 text-steel-300 font-display">{record.startTime}</td>
                  <td className="px-5 py-3 text-steel-300 font-display">{record.endTime || '—'}</td>
                  <td className="px-5 py-3 text-white font-display">{record.avgSpeed} mm/min</td>
                  <td className="px-5 py-3 text-white font-display">{record.gasPressure} MPa</td>
                  <td className="px-5 py-3 text-white font-display">{record.focusPosition}mm</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded font-display ${
                      record.status === 'running' ? 'bg-industrial-blue/20 text-industrial-blue' :
                      record.status === 'completed' ? 'bg-industrial-green/20 text-industrial-green' :
                      'bg-industrial-red/20 text-industrial-red'
                    }`}>
                      {record.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-industrial-blue animate-pulse" />}
                      {record.status === 'running' ? '运行中' : record.status === 'completed' ? '已完成' : '异常'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
