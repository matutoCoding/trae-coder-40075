import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Filter, BarChart3, CheckCircle, AlertTriangle, Gauge } from 'lucide-react'
import { useStore } from '@/store'

export default function CuttingRecords() {
  const { cuttingRecords } = useStore()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterOperator, setFilterOperator] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = useMemo(() => {
    return cuttingRecords.filter((r) => {
      if (filterOperator && r.operator !== filterOperator) return false
      if (filterStatus && r.status !== filterStatus) return false
      if (dateFrom && r.startTime < dateFrom) return false
      if (dateTo && r.startTime > dateTo + 'z') return false
      return true
    })
  }, [cuttingRecords, dateFrom, dateTo, filterOperator, filterStatus])

  const operators = [...new Set(cuttingRecords.map((r) => r.operator))] as string[]
  const totalCount = cuttingRecords.length
  const completedCount = cuttingRecords.filter((r) => r.status === 'completed').length
  const errorCount = cuttingRecords.filter((r) => r.status === 'error').length
  const avgSpeed = cuttingRecords.length > 0
    ? Math.round(cuttingRecords.reduce((sum, r) => sum + r.avgSpeed, 0) / cuttingRecords.length)
    : 0

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-industrial-orange" />
        <h1 className="text-2xl font-bold text-white font-display">切割记录</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-industrial-cyan" />
            <span className="text-steel-400 text-xs">总记录数</span>
          </div>
          <span className="text-2xl font-display font-bold text-white">{totalCount}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-industrial-green" />
            <span className="text-steel-400 text-xs">已完成</span>
          </div>
          <span className="text-2xl font-display font-bold text-industrial-green">{completedCount}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-industrial-red" />
            <span className="text-steel-400 text-xs">异常</span>
          </div>
          <span className="text-2xl font-display font-bold text-industrial-red">{errorCount}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-industrial-orange" />
            <span className="text-steel-400 text-xs">平均速度</span>
          </div>
          <span className="text-2xl font-display font-bold text-white">{avgSpeed}<span className="text-sm text-steel-400 ml-1">mm/min</span></span>
        </div>
      </div>

      <div className="bg-steel-800 rounded-lg industrial-border mb-6 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-steel-400" />
          <span className="text-steel-300 text-sm">筛选条件</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-steel-500 text-xs mb-1">开始日期</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="bg-steel-700 text-white text-sm rounded px-3 py-1.5 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-steel-500 text-xs mb-1">结束日期</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="bg-steel-700 text-white text-sm rounded px-3 py-1.5 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-steel-500 text-xs mb-1">操作员</label>
            <select value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)}
              className="bg-steel-700 text-white text-sm rounded px-3 py-1.5 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors">
              <option value="">全部</option>
              {operators.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-steel-500 text-xs mb-1">状态</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-steel-700 text-white text-sm rounded px-3 py-1.5 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors">
              <option value="">全部</option>
              <option value="running">运行中</option>
              <option value="completed">已完成</option>
              <option value="error">异常</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-steel-800 rounded-lg industrial-border">
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
              {filtered.map((record) => (
                <tr key={record.id} className="border-b border-steel-700/50 hover:bg-steel-700/30 transition-colors">
                  <td className="px-5 py-3 text-white">{record.planName}</td>
                  <td className="px-5 py-3 text-steel-300">{record.operator}</td>
                  <td className="px-5 py-3 text-steel-300 font-display">{record.startTime}</td>
                  <td className="px-5 py-3 text-steel-300 font-display">{record.endTime || '—'}</td>
                  <td className="px-5 py-3 text-white font-display">{record.avgSpeed} mm/min</td>
                  <td className="px-5 py-3 text-white font-display">{record.gasPressure} MPa</td>
                  <td className="px-5 py-3 text-white font-display">{record.focusPosition}mm</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-display ${
                      record.status === 'running' ? 'bg-industrial-blue/20 text-industrial-blue' :
                      record.status === 'completed' ? 'bg-industrial-green/20 text-industrial-green' :
                      'bg-industrial-red/20 text-industrial-red'
                    }`}>
                      {record.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-industrial-blue animate-pulse" />}
                      {record.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {record.status === 'error' && <AlertTriangle className="w-3 h-3" />}
                      {record.status === 'running' ? '运行中' : record.status === 'completed' ? '已完成' : '异常'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-steel-500 py-8">无匹配记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Link to="/cutting/monitor" className="text-industrial-orange hover:text-industrial-orange-light text-sm transition-colors">
          ← 返回监控
        </Link>
      </div>
    </div>
  )
}
