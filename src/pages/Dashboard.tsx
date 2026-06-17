import { FileText, Grid3X3, Zap, PackageSearch, Monitor, Wrench, ClipboardList, LayoutDashboard, Settings, FolderOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import type { TodoItem } from '@/store'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Grid3X3,
  Wrench,
  PackageSearch,
  ClipboardList,
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: '紧急', className: 'bg-industrial-red/20 text-industrial-red' },
  medium: { label: '中等', className: 'bg-industrial-yellow/20 text-industrial-yellow' },
  low: { label: '一般', className: 'bg-industrial-blue/20 text-industrial-blue' },
}

const shortcuts = [
  { icon: FolderOpen, label: '图纸管理', to: '/drawings' },
  { icon: Grid3X3, label: '智能排版', to: '/nesting' },
  { icon: Zap, label: '切割监控', to: '/cutting' },
  { icon: ClipboardList, label: '生产工单', to: '/orders' },
  { icon: LayoutDashboard, label: '数据报表', to: '/reports' },
  { icon: Settings, label: '系统设置', to: '/settings' },
]

function StatCard({ icon: Icon, label, count, delay }: { icon: React.ComponentType<{ className?: string }>; label: string; count: number; delay: string }) {
  return (
    <div className={`bg-steel-800 rounded-lg p-5 industrial-border card-hover animate-slide-up`} style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-steel-400 text-sm font-body">{label}</p>
          <p className="text-3xl font-display text-white mt-1">{count}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-industrial-orange/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-industrial-orange" />
        </div>
      </div>
    </div>
  )
}

function UtilizationGauge({ rate }: { rate: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - rate)
  const percentage = Math.round(rate * 100)

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#243447" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="#FF6B35" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="gauge-ring"
        />
        <text x="60" y="60" textAnchor="middle" dominantBaseline="central" className="fill-white font-display text-2xl">
          {percentage}%
        </text>
      </svg>
      <p className="text-steel-400 text-sm font-body mt-2">板材利用率</p>
    </div>
  )
}

function DeviceStatusList() {
  const { devices } = useStore()

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <div key={device.id} className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${device.status === '运行中' ? 'bg-industrial-green' : device.status === '待机' ? 'bg-industrial-yellow' : 'bg-industrial-red'}`} />
          <Monitor className="w-4 h-4 text-steel-400" />
          <span className="text-white font-body text-sm flex-1">{device.name}</span>
          <span className={`text-xs font-body px-2 py-0.5 rounded ${device.status === '运行中' ? 'bg-industrial-green/20 text-industrial-green' : device.status === '待机' ? 'bg-industrial-yellow/20 text-industrial-yellow' : 'bg-industrial-red/20 text-industrial-red'}`}>
            {device.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function TodoRow({ item, onToggle }: { item: TodoItem; onToggle: () => void }) {
  const Icon = iconMap[item.icon]
  const config = priorityConfig[item.priority]

  return (
    <div className="flex items-center gap-3 py-2 group">
      <button onClick={onToggle} className="flex-shrink-0">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-industrial-orange border-industrial-orange' : 'border-steel-500'}`}>
          {item.checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
        </div>
      </button>
      {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${item.checked ? 'text-steel-500' : 'text-steel-400'}`} />}
      <span className={`text-sm font-body flex-1 ${item.checked ? 'line-through text-steel-500' : 'text-white'}`}>{item.text}</span>
      {config && <span className={`text-xs font-body px-2 py-0.5 rounded ${config.className}`}>{config.label}</span>}
    </div>
  )
}

export default function Dashboard() {
  const { drawings, nestingPlans, devices, todos, toggleTodo } = useStore()

  const pendingCount = drawings.filter((d) => d.status === 'pending').length
  const todayNesting = nestingPlans.length
  const cuttingCount = devices.filter((d) => d.status === '运行中').length
  const sortingCount = drawings.filter((d) => d.status === 'completed').length

  const avgUtilization = nestingPlans.length > 0
    ? nestingPlans.reduce((sum, p) => sum + p.utilizationRate, 0) / nestingPlans.length / 100
    : 0

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={FileText} label="待处理图纸" count={pendingCount} delay="0ms" />
        <StatCard icon={Grid3X3} label="今日排版" count={todayNesting} delay="80ms" />
        <StatCard icon={Zap} label="切割中" count={cuttingCount} delay="160ms" />
        <StatCard icon={PackageSearch} label="待分拣" count={sortingCount} delay="240ms" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-steel-800 rounded-lg p-5 industrial-border card-hover animate-slide-up" style={{ animationDelay: '320ms' }}>
          <h3 className="text-white font-body text-sm mb-4">板材利用率</h3>
          <div className="flex justify-center py-4">
            <UtilizationGauge rate={avgUtilization} />
          </div>
        </div>
        <div className="bg-steel-800 rounded-lg p-5 industrial-border card-hover animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-white font-body text-sm mb-4">设备状态</h3>
          <DeviceStatusList />
        </div>
      </div>

      <div className="bg-steel-800 rounded-lg p-5 industrial-border card-hover animate-slide-up" style={{ animationDelay: '480ms' }}>
        <h3 className="text-white font-body text-sm mb-3">待办事项</h3>
        <div className="divide-y divide-steel-700">
          {todos.map((todo) => (
            <TodoRow key={todo.id} item={todo} onToggle={() => toggleTodo(todo.id)} />
          ))}
        </div>
      </div>

      <div className="bg-steel-800 rounded-lg p-5 industrial-border card-hover animate-slide-up" style={{ animationDelay: '560ms' }}>
        <h3 className="text-white font-body text-sm mb-4">快捷入口</h3>
        <div className="grid grid-cols-6 gap-3">
          {shortcuts.map(({ icon: ShortcutIcon, label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-steel-700 hover:bg-steel-600 transition-colors group"
            >
              <ShortcutIcon className="w-6 h-6 text-steel-400 group-hover:text-industrial-orange transition-colors" />
              <span className="text-xs font-body text-steel-300 group-hover:text-white transition-colors">{label}</span>
              <ArrowRight className="w-3 h-3 text-steel-500 group-hover:text-industrial-orange transition-colors opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
