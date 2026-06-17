import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScanLine, Package, MapPin, ArrowRight } from 'lucide-react'
import { useStore } from '@/store'

const statusConfig = {
  pending: { bg: 'bg-steel-600', border: 'border-steel-500', text: 'text-steel-300', label: '待分拣', barColor: 'bg-steel-400' },
  sorting: { bg: 'bg-industrial-orange/10', border: 'border-industrial-orange/30', text: 'text-industrial-orange', label: '分拣中', barColor: 'bg-industrial-orange' },
  completed: { bg: 'bg-industrial-green/10', border: 'border-industrial-green/30', text: 'text-industrial-green', label: '已完成', barColor: 'bg-industrial-green' },
}

export default function SortingGuide() {
  const { partSortItems, incrementSortedCount } = useStore()
  const [scanValues, setScanValues] = useState<Record<string, string>>({})

  const firstBatch = partSortItems.length > 0 ? partSortItems[0] : null
  const batchItems = partSortItems.filter((i) => i.batchNo === (firstBatch?.batchNo || ''))
  const totalInBatch = batchItems.reduce((s, i) => s + i.quantity, 0)
  const sortedInBatch = batchItems.reduce((s, i) => s + i.sortedCount, 0)

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ScanLine className="w-6 h-6 text-industrial-orange" />
          <h1 className="text-2xl font-bold text-white font-display">分拣指引</h1>
        </div>
        <Link to="/sorting/progress" className="flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-light text-sm">
          分拣进度 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {firstBatch && (
        <div className="bg-steel-800 rounded-lg industrial-border p-5 mb-6">
          <h2 className="text-white font-display font-semibold mb-3">当前批次信息</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-steel-400 text-xs block mb-0.5">批次号</span>
              <span className="text-white font-display font-semibold">{firstBatch.batchNo}</span>
            </div>
            <div>
              <span className="text-steel-400 text-xs block mb-0.5">关联排版方案</span>
              <span className="text-white font-display font-semibold">{firstBatch.batchNo}</span>
            </div>
            <div>
              <span className="text-steel-400 text-xs block mb-0.5">零件总数</span>
              <span className="text-white font-display font-semibold">{totalInBatch}</span>
            </div>
            <div>
              <span className="text-steel-400 text-xs block mb-0.5">已分拣数</span>
              <span className="text-industrial-orange font-display font-semibold">{sortedInBatch}<span className="text-steel-500 text-sm ml-1">/ {totalInBatch}</span></span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partSortItems.map((item) => {
          const config = statusConfig[item.status]
          const progress = item.quantity > 0 ? (item.sortedCount / item.quantity) * 100 : 0
          return (
            <div key={item.id}
              onClick={() => { if (item.status !== 'completed') incrementSortedCount(item.id) }}
              className={`rounded-lg border p-4 cursor-pointer card-hover ${config.bg} ${config.border}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className={`w-4 h-4 ${config.text}`} />
                  <span className="text-white font-display font-semibold">{item.partName}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${config.text} bg-black/20`}>
                  {config.label}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-steel-400">数量</span>
                  <span className="text-white font-display">{item.sortedCount} / {item.quantity}</span>
                </div>
                <div className="w-full h-2 bg-steel-700 rounded-full overflow-hidden">
                  <div className={`h-full ${config.barColor} rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3 h-3 text-steel-500" />
                <span className="text-steel-400 text-xs">{item.location}</span>
              </div>

              {item.status !== 'completed' ? (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <ScanLine className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steel-500" />
                    <input
                      type="text"
                      value={scanValues[item.id] || ''}
                      onChange={(e) => setScanValues({ ...scanValues, [item.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && scanValues[item.id]) {
                          incrementSortedCount(item.id)
                          setScanValues({ ...scanValues, [item.id]: '' })
                        }
                      }}
                      placeholder="扫码确认"
                      className="w-full bg-steel-700 text-white text-xs rounded pl-8 pr-3 py-1.5 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-center text-industrial-green text-xs font-display py-1.5 bg-industrial-green/10 rounded">
                  ✓ 分拣完成
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
