import { useState, useMemo } from 'react'
import { DollarSign, CheckCircle, Clock, Users, FileDown } from 'lucide-react'
import { useStore } from '@/store'

type Period = 'thisMonth' | 'lastMonth' | 'custom'

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

export default function Settlement() {
  const { billingRecords, updateBillingStatus, settleAllConfirmed } = useStore()
  const [period, setPeriod] = useState<Period>('thisMonth')

  const filtered = useMemo(() => {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

    return billingRecords.filter((r) => {
      if (period === 'thisMonth') return r.date.startsWith(thisMonth)
      if (period === 'lastMonth') return r.date.startsWith(lastMonth)
      return true
    })
  }, [billingRecords, period])

  const totalAmount = filtered.reduce((s, r) => s + r.totalAmount, 0)
  const confirmedAmount = filtered.filter((r) => r.status === 'confirmed').reduce((s, r) => s + r.totalAmount, 0)
  const pendingAmount = filtered.filter((r) => r.status === 'pending').reduce((s, r) => s + r.totalAmount, 0)
  const workerCount = new Set(filtered.map((r) => r.workerName)).size

  return (
    <div className="min-h-screen bg-steel-900 font-body text-steel-300 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-white">加工费结算</h1>
          <div className="flex gap-2">
            {([
              { key: 'thisMonth' as Period, label: '本月' },
              { key: 'lastMonth' as Period, label: '上月' },
              { key: 'custom' as Period, label: '自定义' },
            ]).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-1.5 rounded-lg font-body text-sm transition-colors ${
                  period === p.key
                    ? 'bg-industrial-orange text-white'
                    : 'bg-steel-700 text-steel-400 hover:bg-steel-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <DollarSign size={14} className="text-industrial-orange" />
              本期结算总额
            </div>
            <div className="text-2xl font-display font-bold text-industrial-orange">¥{totalAmount.toFixed(0)}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <CheckCircle size={14} className="text-industrial-blue" />
              已确认金额
            </div>
            <div className="text-2xl font-display font-bold text-industrial-blue">¥{confirmedAmount.toFixed(0)}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <Clock size={14} className="text-industrial-yellow" />
              待确认金额
            </div>
            <div className="text-2xl font-display font-bold text-industrial-yellow">¥{pendingAmount.toFixed(0)}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <Users size={14} className="text-industrial-cyan" />
              涉及工人数
            </div>
            <div className="text-2xl font-display font-bold text-industrial-cyan">{workerCount}</div>
          </div>
        </div>

        <div className="bg-steel-800 border border-steel-600 rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-600">
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工人</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工序</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">零件数</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">单价</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">总金额</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">工时</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">状态</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">操作</th>
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
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-body ${statusColors[r.status]}`}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <button
                        onClick={() => updateBillingStatus(r.id, 'confirmed')}
                        className="px-3 py-1 bg-industrial-blue/20 text-industrial-blue hover:bg-industrial-blue/30 rounded text-xs font-body transition-colors"
                      >
                        确认
                      </button>
                    )}
                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => updateBillingStatus(r.id, 'settled')}
                        className="px-3 py-1 bg-industrial-green/20 text-industrial-green hover:bg-industrial-green/30 rounded text-xs font-body transition-colors"
                      >
                        结算
                      </button>
                    )}
                    {r.status === 'settled' && (
                      <span className="text-steel-500 text-xs font-body">已结算</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-steel-700/30">
                <td className="px-4 py-3 text-white font-display font-bold" colSpan={4}>合计</td>
                <td className="px-4 py-3 font-display font-bold text-industrial-orange">¥{totalAmount.toFixed(0)}</td>
                <td className="px-4 py-3 font-display text-steel-300">{filtered.reduce((s, r) => s + r.workHours, 0)}h</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => settleAllConfirmed()}
            className="px-6 py-2 bg-industrial-green hover:bg-industrial-green/80 text-white rounded-lg font-body transition-colors"
          >
            批量结算
          </button>
          <button
            onClick={() => alert('结算单导出功能开发中')}
            className="flex items-center gap-2 px-6 py-2 bg-steel-700 hover:bg-steel-600 text-white rounded-lg font-body transition-colors border border-steel-600"
          >
            <FileDown size={16} />
            导出结算单
          </button>
        </div>
      </div>
    </div>
  )
}
