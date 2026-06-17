import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, User, FileType, Clock, Layers, Calendar, Edit3, Trash2, RefreshCw } from 'lucide-react'
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

const statusOptions: { value: DrawingStatus; label: string }[] = [
  { value: 'pending', label: '待处理' },
  { value: 'parsing', label: '解析中' },
  { value: 'parsed', label: '已解析' },
  { value: 'in-production', label: '生产中' },
  { value: 'completed', label: '已完成' },
]

export default function DrawingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { findDrawing, updateDrawingStatus, deleteDrawing } = useStore()
  const drawing = id ? findDrawing(id) : undefined

  const handleStatusChange = (status: DrawingStatus) => {
    if (!drawing) return
    updateDrawingStatus(drawing.id, status)
  }

  const handleDelete = () => {
    if (!drawing) return
    if (window.confirm(`确定要删除图纸「${drawing.name}」吗？`)) {
      deleteDrawing(drawing.id)
      navigate('/drawings')
    }
  }

  if (!drawing) {
    return (
      <div className="min-h-screen bg-steel-900 p-6 font-body flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-steel-500 mb-4" />
        <h2 className="text-xl text-white font-display mb-2">图纸不存在</h2>
        <p className="text-steel-400 mb-6">未找到 ID 为 {id} 的图纸</p>
        <Link to="/drawings" className="px-4 py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg transition-colors">
          返回图纸列表
        </Link>
      </div>
    )
  }

  const status = statusConfig[drawing.status]
  const format = formatConfig[drawing.format]

  const fileSizeKB = (drawing.fileSize / 1024).toFixed(1)
  const fileSizeMB = (drawing.fileSize / 1024 / 1024).toFixed(2)

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/drawings" className="text-steel-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <FileText className="w-6 h-6 text-industrial-orange" />
        <h1 className="text-2xl font-bold text-white font-display">图纸详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-steel-800 rounded-lg industrial-border p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">{drawing.name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-body px-3 py-1 rounded-full ${format.className}`}>{format.label}</span>
                  <span className={`text-xs font-body px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-industrial-red hover:text-industrial-red/80 hover:bg-industrial-red/10 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>

            <div className="bg-steel-900/50 rounded-lg border border-dashed border-steel-600 aspect-video flex flex-col items-center justify-center mb-6">
              <FileText className="w-16 h-16 text-steel-500 mb-3" />
              <p className="text-steel-400 text-sm mb-1">图纸预览</p>
              <p className="text-steel-500 text-xs">{format.label} 格式图纸</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-steel-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-steel-400 text-sm mb-2">
                  <User className="w-4 h-4" />
                  <span>客户名称</span>
                </div>
                <p className="text-white font-display text-lg">{drawing.customer}</p>
              </div>
              <div className="bg-steel-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-steel-400 text-sm mb-2">
                  <FileType className="w-4 h-4" />
                  <span>文件格式</span>
                </div>
                <p className="text-white font-display text-lg">{format.label}</p>
              </div>
              <div className="bg-steel-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-steel-400 text-sm mb-2">
                  <Layers className="w-4 h-4" />
                  <span>零件数量</span>
                </div>
                <p className="text-white font-display text-lg">{drawing.partCount} 个</p>
              </div>
              <div className="bg-steel-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-steel-400 text-sm mb-2">
                  <FileText className="w-4 h-4" />
                  <span>文件大小</span>
                </div>
                <p className="text-white font-display text-lg">{Number(fileSizeKB) > 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`}</p>
              </div>
              <div className="bg-steel-700/50 rounded-lg p-4 col-span-2">
                <div className="flex items-center gap-2 text-steel-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>上传时间</span>
                </div>
                <p className="text-white font-display text-lg">{drawing.uploadTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-steel-800 rounded-lg industrial-border p-5 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <RefreshCw className="w-5 h-5 text-industrial-orange" />
              <h3 className="text-white font-display font-semibold">状态变更</h3>
            </div>
            <div className="space-y-2">
              {statusOptions.map((opt) => {
                const isActive = drawing.status === opt.value
                const optStatus = statusConfig[opt.value]
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? `${optStatus.className} border border-current`
                        : 'bg-steel-700/30 text-steel-300 hover:bg-steel-700 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && <span className="w-2 h-2 rounded-full bg-current" />}
                      {opt.label}
                    </span>
                    {isActive && <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-steel-800 rounded-lg industrial-border p-5">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-industrial-orange" />
              <h3 className="text-white font-display font-semibold">快速操作</h3>
            </div>
            <div className="space-y-3">
              <Link
                to="/nesting"
                className="block w-full text-center px-4 py-2.5 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg text-sm font-display font-semibold transition-colors"
              >
                开始套料排版
              </Link>
              <Link
                to="/drawings"
                className="block w-full text-center px-4 py-2.5 bg-steel-700 hover:bg-steel-600 text-white rounded-lg text-sm transition-colors"
              >
                返回图纸列表
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
