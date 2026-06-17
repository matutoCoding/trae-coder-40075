import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Upload, Eye, Trash2, FileText, FolderOpen } from 'lucide-react'
import { useStore } from '@/store'
import type { DrawingStatus, DrawingFormat } from '@/store'

const statusConfig: Record<DrawingStatus, { label: string; className: string }> = {
  pending: { label: '待处理', className: 'bg-industrial-yellow/20 text-industrial-yellow' },
  parsing: { label: '解析中', className: 'bg-industrial-blue/20 text-industrial-blue' },
  parsed: { label: '已解析', className: 'bg-industrial-green/20 text-industrial-green' },
  'in-production': { label: '生产中', className: 'bg-industrial-orange/20 text-industrial-orange' },
  completed: { label: '已完成', className: 'bg-industrial-green/20 text-industrial-green' },
}

const formatConfig: Record<DrawingFormat, { label: string; className: string }> = {
  DXF: { label: 'DXF', className: 'bg-industrial-cyan/20 text-industrial-cyan' },
  DWG: { label: 'DWG', className: 'bg-industrial-blue/20 text-industrial-blue' },
  PDF: { label: 'PDF', className: 'bg-industrial-orange/20 text-industrial-orange' },
}

export default function DrawingList() {
  const { drawings, deleteDrawing } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formatFilter, setFormatFilter] = useState<string>('all')

  const filtered = drawings.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    const matchFormat = formatFilter === 'all' || d.format === formatFilter
    return matchSearch && matchStatus && matchFormat
  })

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-body text-white">图纸管理</h1>
        <Link
          to="/drawings/upload"
          className="flex items-center gap-2 px-4 py-2 bg-industrial-orange hover:bg-industrial-orange-light rounded-lg text-white font-body text-sm transition-colors"
        >
          <Upload className="w-4 h-4" />
          上传图纸
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索图纸名称或客户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-steel-800 border border-steel-600 rounded-lg pl-10 pr-4 py-2 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-steel-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-steel-800 border border-steel-600 rounded-lg pl-10 pr-8 py-2 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors"
          >
            <option value="all">全部状态</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="appearance-none bg-steel-800 border border-steel-600 rounded-lg px-4 py-2 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors"
        >
          <option value="all">全部格式</option>
          {Object.entries(formatConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-steel-800 rounded-lg p-16 industrial-border flex flex-col items-center justify-center">
          <FolderOpen className="w-12 h-12 text-steel-500 mb-4" />
          <p className="text-steel-400 font-body text-sm">暂无图纸数据</p>
          <Link
            to="/drawings/upload"
            className="mt-4 text-industrial-orange font-body text-sm hover:underline"
          >
            上传第一份图纸
          </Link>
        </div>
      ) : (
        <div className="bg-steel-800 rounded-lg industrial-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700">
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">图纸名称</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">客户</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">格式</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">状态</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">零件数</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">上传时间</th>
                <th className="text-left text-steel-400 font-body text-xs px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((drawing) => {
                const status = statusConfig[drawing.status]
                const format = formatConfig[drawing.format]
                return (
                  <tr key={drawing.id} className="border-b border-steel-700/50 hover:bg-steel-700 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-steel-400" />
                        <span className="text-white font-body text-sm">{drawing.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-steel-300 font-body text-sm">{drawing.customer}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-body px-2 py-0.5 rounded ${format.className}`}>{format.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-body px-2 py-0.5 rounded ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-3 text-white font-display text-sm">{drawing.partCount}</td>
                    <td className="px-5 py-3 text-steel-400 font-body text-sm">{drawing.uploadTime}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/drawings/${drawing.id}`} className="text-industrial-blue font-body text-sm hover:underline flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          查看
                        </Link>
                        <button
                          onClick={() => deleteDrawing(drawing.id)}
                          className="text-industrial-red font-body text-sm hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
