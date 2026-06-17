import { useState } from 'react'
import { useStore } from '@/store'
import { FileText, Send } from 'lucide-react'

interface RequisitionRecord {
  id: string
  sheetSpec: string
  quantity: number
  purpose: string
  applicant: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const initialRecords: RequisitionRecord[] = [
  { id: 'rq-001', sheetSpec: 'Q235B-6mm', quantity: 5, purpose: '方案A-支架组件', applicant: '张工', createdAt: '2024-03-15', status: 'approved' },
  { id: 'rq-002', sheetSpec: 'SUS304-3mm', quantity: 3, purpose: '方案B-外壳面板', applicant: '李工', createdAt: '2024-03-16', status: 'pending' },
  { id: 'rq-003', sheetSpec: 'Q345R-10mm', quantity: 2, purpose: '方案C-法兰盘组', applicant: '王工', createdAt: '2024-03-14', status: 'approved' },
  { id: 'rq-004', sheetSpec: 'Q235B-8mm', quantity: 4, purpose: '日常备料', applicant: '赵工', createdAt: '2024-03-13', status: 'rejected' },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '待审批', color: 'text-industrial-yellow' },
  approved: { label: '已通过', color: 'text-industrial-green' },
  rejected: { label: '已驳回', color: 'text-industrial-red' },
}

export default function Requisition() {
  const { sheetMaterials, updateSheetStock } = useStore()
  const sheets = sheetMaterials.filter(m => !m.isRemnant)

  const [sheetId, setSheetId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purpose, setPurpose] = useState('')
  const [applicant] = useState('当前用户')
  const [records, setRecords] = useState<RequisitionRecord[]>(initialRecords)

  const handleSubmit = () => {
    const num = Number(quantity)
    if (!sheetId || !num || num <= 0) return

    const sheet = sheets.find(s => s.id === sheetId)
    if (!sheet) return

    updateSheetStock(sheetId, Math.max(0, sheet.stock - num))
    const newRecord: RequisitionRecord = {
      id: `rq-${Date.now()}`,
      sheetSpec: sheet.spec,
      quantity: num,
      purpose,
      applicant,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    setRecords(prev => [newRecord, ...prev])
    setSheetId('')
    setQuantity('')
    setPurpose('')
  }

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <h1 className="mb-6 text-2xl font-bold text-white">领用申请</h1>

      <div className="mb-6 rounded-lg bg-steel-800 p-6 industrial-border">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-medium text-white">
          <FileText size={20} className="text-industrial-orange" />
          新建领用
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-sm text-steel-400">板材选择</label>
            <select
              value={sheetId}
              onChange={e => setSheetId(e.target.value)}
              className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange"
            >
              <option value="">请选择板材</option>
              {sheets.map(s => (
                <option key={s.id} value={s.id}>
                  {s.spec} ({s.size.width}×{s.size.height}) - 库存: {s.stock}{s.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-steel-400">领用数量</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="请输入数量"
              className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-steel-400">用途 / 关联排版方案</label>
            <input
              type="text"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="请输入用途"
              className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-steel-400">申请人</label>
            <input
              type="text"
              value={applicant}
              readOnly
              className="w-full rounded-lg border border-steel-600 bg-steel-600 px-3 py-2.5 text-sm text-steel-300"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-industrial-orange px-6 py-2.5 text-white hover:bg-industrial-orange-light"
          >
            <Send size={16} />
            提交申请
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <h3 className="mb-4 text-lg font-bold text-white">领用记录</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-600 text-steel-400">
              <th className="pb-3 text-left font-normal">板材规格</th>
              <th className="pb-3 text-left font-normal">数量</th>
              <th className="pb-3 text-left font-normal">用途</th>
              <th className="pb-3 text-left font-normal">申请人</th>
              <th className="pb-3 text-left font-normal">日期</th>
              <th className="pb-3 text-left font-normal">状态</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} className="border-b border-steel-700/50 transition-colors hover:bg-steel-700/30">
                <td className="py-3 text-steel-200">{record.sheetSpec}</td>
                <td className="py-3 font-display text-steel-200">{record.quantity}</td>
                <td className="py-3 text-steel-300">{record.purpose}</td>
                <td className="py-3 text-steel-300">{record.applicant}</td>
                <td className="py-3 font-display text-steel-400">{record.createdAt}</td>
                <td className={`py-3 ${statusLabels[record.status].color}`}>
                  {statusLabels[record.status].label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
