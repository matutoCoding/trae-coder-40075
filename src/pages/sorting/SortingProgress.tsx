import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, CheckCircle, Clock, TrendingUp, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store'

export default function SortingProgress() {
  const { partSortItems } = useStore()

  const totalQuantity = partSortItems.reduce((s, i) => s + i.quantity, 0)
  const totalSorted = partSortItems.reduce((s, i) => s + i.sortedCount, 0)
  const completedItems = partSortItems.filter((i) => i.status === 'completed').length
  const pendingItems = partSortItems.filter((i) => i.status === 'pending').length
  const overallProgress = totalQuantity > 0 ? (totalSorted / totalQuantity) * 100 : 0

  const batchMap = useMemo(() => {
    const map = new Map<string, typeof partSortItems>()
    partSortItems.forEach((item) => {
      const list = map.get(item.batchNo) || []
      list.push(item)
      map.set(item.batchNo, list)
    })
    return map
  }, [partSortItems])

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/sorting/guide" className="text-steel-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <BarChart3 className="w-6 h-6 text-industrial-orange" />
        <h1 className="text-2xl font-bold text-white font-display">分拣进度</h1>
      </div>

      <div className="bg-steel-800 rounded-lg industrial-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-steel-300 text-sm">总体进度</span>
          <span className="text-industrial-orange font-display font-bold text-lg">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 bg-steel-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-industrial-orange to-industrial-orange-light rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-steel-500">
          <span>已分拣: <span className="text-white font-display">{totalSorted}</span></span>
          <span>总数: <span className="text-white font-display">{totalQuantity}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-industrial-cyan" />
            <span className="text-steel-400 text-xs">零件种类</span>
          </div>
          <span className="text-2xl font-display font-bold text-white">{partSortItems.length}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-industrial-green" />
            <span className="text-steel-400 text-xs">已完成</span>
          </div>
          <span className="text-2xl font-display font-bold text-industrial-green">{completedItems}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-industrial-yellow" />
            <span className="text-steel-400 text-xs">待分拣</span>
          </div>
          <span className="text-2xl font-display font-bold text-industrial-yellow">{pendingItems}</span>
        </div>
        <div className="bg-steel-800 rounded-lg p-4 industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-industrial-orange" />
            <span className="text-steel-400 text-xs">完成率</span>
          </div>
          <span className="text-2xl font-display font-bold text-white">{overallProgress.toFixed(1)}<span className="text-sm text-steel-400 ml-0.5">%</span></span>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from(batchMap.entries()).map(([batchNo, items]) => {
          const batchTotal = items.reduce((s, i) => s + i.quantity, 0)
          const batchSorted = items.reduce((s, i) => s + i.sortedCount, 0)
          const batchProgress = batchTotal > 0 ? (batchSorted / batchTotal) * 100 : 0
          const completedCount = items.filter((i) => i.status === 'completed').length

          return (
            <div key={batchNo} className="bg-steel-800 rounded-lg industrial-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-display font-semibold">{batchNo}</h3>
                  <span className="text-steel-500 text-xs">{items[0]?.batchNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-industrial-orange font-display font-bold">{batchProgress.toFixed(1)}%</span>
                  <div className="text-steel-500 text-xs">{completedCount}/{items.length} 零件完成</div>
                </div>
              </div>
              <div className="w-full h-2.5 bg-steel-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-industrial-orange rounded-full transition-all duration-500"
                  style={{ width: `${batchProgress}%` }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((item) => {
                  const itemProgress = item.quantity > 0 ? (item.sortedCount / item.quantity) * 100 : 0
                  const barColor = item.status === 'completed' ? 'bg-industrial-green' : item.status === 'sorting' ? 'bg-industrial-orange' : 'bg-steel-400'
                  return (
                    <div key={item.id} className="bg-steel-700/50 rounded p-3">
                      <div className="text-white text-sm font-display font-semibold mb-1">{item.partName}</div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-steel-400">{item.sortedCount}/{item.quantity}</span>
                        <span className={`font-display ${item.status === 'completed' ? 'text-industrial-green' : item.status === 'sorting' ? 'text-industrial-orange' : 'text-steel-500'}`}>
                          {item.status === 'completed' ? '完成' : item.status === 'sorting' ? '分拣中' : '待分拣'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-steel-600 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-300`}
                          style={{ width: `${itemProgress}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
