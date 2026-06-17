import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { useStore } from '@/store'

export default function UploadDrawing() {
  const navigate = useNavigate()
  const { addDrawing } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [customer, setCustomer] = useState('')
  const [drawingName, setDrawingName] = useState('')
  const [remark, setRemark] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      if (!drawingName) {
        setDrawingName(droppedFile.name.replace(/\.[^.]+$/, ''))
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      if (!drawingName) {
        setDrawingName(selected.name.replace(/\.[^.]+$/, ''))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !customer || !drawingName) return

    const ext = file.name.split('.').pop()?.toUpperCase()
    addDrawing({
      id: `DW${Date.now()}`,
      name: drawingName,
      customer,
      format: (ext === 'DWG' || ext === 'PDF' ? ext : 'DXF') as 'DXF' | 'DWG' | 'PDF',
      status: 'pending',
      uploadTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      fileSize: file.size,
      partCount: 0,
      thumbnailUrl: '',
    })
    navigate('/drawings')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <h1 className="text-xl font-body text-white">上传图纸</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className={`bg-steel-800 rounded-lg p-12 industrial-border border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragOver ? 'border-industrial-orange bg-steel-700' : 'border-steel-500'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`w-10 h-10 mb-3 ${dragOver ? 'text-industrial-orange' : 'text-steel-400'}`} />
          <p className="text-white font-body text-sm">{file ? file.name : '拖拽文件到此处或点击上传'}</p>
          <p className="text-steel-500 font-body text-xs mt-1">支持 DXF / DWG / PDF 格式</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".dxf,.dwg,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-steel-400 font-body text-sm mb-1.5">客户名称</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="请输入客户名称"
              className="w-full bg-steel-800 border border-steel-600 rounded-lg px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors"
            />
          </div>

          <div>
            <label className="block text-steel-400 font-body text-sm mb-1.5">图纸名称</label>
            <input
              type="text"
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              placeholder="请输入图纸名称"
              className="w-full bg-steel-800 border border-steel-600 rounded-lg px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors"
            />
          </div>

          <div>
            <label className="block text-steel-400 font-body text-sm mb-1.5">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="可选：添加备注信息"
              rows={3}
              className="w-full bg-steel-800 border border-steel-600 rounded-lg px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-industrial-orange transition-colors resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || !customer || !drawingName}
          className="w-full py-3 bg-industrial-orange hover:bg-industrial-orange-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-body text-sm transition-colors"
        >
          提交图纸
        </button>
      </form>
    </div>
  )
}
