import { useState, useMemo } from 'react'
import { Clock, Package, TrendingUp, Users, Search } from 'lucide-react'
import { useStore } from '@/store'

const statusLabels: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  settled: '已结算',
}

const statusColors: Record<string, string> = {
  pending: 'bg-industrial-yellow/20 text-industrial-yellow',
  confirmed: 'bg-industrial-blue/20 text-industrial-blue',
  settled: 'bg-industrial-green/20 text-industrial-green',
}

export default function WorkHours() {
  const { billingRecords } = useStore()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchName, setSearchName] = useState('')

  const filtered = useMemo(() => {
    return billingRecords.filter((r) => {
      if (dateFrom && r.date < dateFrom) return false
      if (dateTo && r.date > dateTo) return false
      if (searchName && !r.workerName.includes(searchName)) return false
      return true
    })
  }, [billingRecords, dateFrom, dateTo, searchName])

  const totalHours = filtered.reduce((s, r) => s + r.workHours, 0)
  const totalParts = filtered.reduce((s, r) => s + r.partCount, 0)
  const avgEfficiency = totalHours > 0 ? (totalParts / totalHours).toFixed(1) : '0.0'
  const workerCount = new Set(filtered.map((r) => r.workerName)).size

  const workerSummary = useMemo(() => {
    const map = new Map<string, { partCount: number; totalAmount: number; workHours: number }>()
    filtered.forEach((r) => {
      const existing = map.get(r.workerName) || { partCount: 0, totalAmount: 0, workHours: 0 }
      existing.partCount += r.partCount
      existing.totalAmount += r.totalAmount
      existing.workHours += r.workHours
      map.set(r.workerName, existing)
    })
    return Array.from(map.entries()).map(([name, data]) => ({ workerName: name, ...data }))
  }, [filtered])

  return (
    <div className="min-h-screen bg-steel-900 font-body text-steel-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-white mb-6">计件工时统计</h1>

        <div className="flex items-end gap-4 mb-6">
          <div>
            <label className="block text-sm text-steel-400 mb-1">开始日期</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
            />
          </div>
          <div>
            <label className="block text-sm text-steel-400 mb-1">结束日期</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
            />
          </div>
          <div className="relative flex-1 max-w-xs">
            <label className="block text-sm text-steel-400 mb-1">工人姓名</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="搜索工人姓名"
                className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg pl-9 pr-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <Clock size={14} className="text-industrial-cyan" />
              总工时
            </div>
            <div className="text-2xl font-display font-bold text-industrial-cyan">{totalHours}<span className="text-sm ml-1 text-steel-400">小时</span></div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <Package size={14} className="text-industrial-orange" />
              总零件数
            </div>
            <div className="text-2xl font-display font-bold text-industrial-orange">{totalParts}<span className="text-sm ml-1 text-steel-400">件</span></div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <TrendingUp size={14} className="text-industrial-green" />
              平均效率
            </div>
            <div className="text-2xl font-display font-bold text-industrial-green">{avgEfficiency}<span className="text-sm ml-1 text-steel-400">件/小时</span></div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <Users size={14} className="text-industrial-yellow" />
              涉及工人
            </div>
            <div className="text-2xl font-display font-bold text-industrial-yellow">{workerCount}<span className="text-sm ml-1 text-steel-400">人</span></div>
          </div>
        </div>

        <div className="bg-steel-800 border border-steel-600 rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-600">
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工人姓名</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工序类型</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">零件数</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">单价</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">总金额</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工时</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">日期</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-steel-700 hover:bg-steel-700/50 transition-colors">
                  <td className="px-4 py-3 text-white font-body">{r.workerName}</td>
                  <td className="px-4 py-3 text-white font-body">{r.processType}</td>
                  <td className="px-4 py-3 font-display text-white">{r.partCount}</td>
                  <td className="px-4 py-3 font-display text-steel-300">¥{r.unitPrice.toFixed(1)}</td>
                  <td className="px-4 py-3 font-display text-industrial-orange">¥{r.totalAmount.toFixed(0)}</td>
                  <td className="px-4 py-3 font-display text-steel-300">{r.workHours}h</td>
                  <td className="px-4 py-3 text-steel-400 font-body text-sm">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-body ${statusColors[r.status]}`}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-steel-800 border border-steel-600 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-steel-600">
            <h2 className="text-lg font-display font-bold text-white">工人汇总</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-600">
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工人姓名</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">零件数</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">总金额</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">总工时</th>
              </tr>
            </thead>
            <tbody>
              {workerSummary.map((w) => (
                <tr key={w.workerName} className="border-b border-steel-700 hover:bg-steel-700/50 transition-colors">
                  <td className="px-4 py-3 text-white font-body">{w.workerName}</td>
                  <td className="px-4 py-3 font-display text-white">{w.partCount}</td>
                  <td className="px-4 py-3 font-display text-industrial-orange">¥{w.totalAmount.toFixed(0)}</td>
                  <td className="px-4 py-3 font-display text-steel-300">{w.workHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
