import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import type { RequisitionRecord } from '@/store'
import { FileText, Send, Check, X, RotateCcw, AlertCircle } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待审批', color: 'text-industrial-yellow', bgColor: 'bg-industrial-yellow/10' },
  approved: { label: '已通过', color: 'text-industrial-green', bgColor: 'bg-industrial-green/10' },
  rejected: { label: '已驳回', color: 'text-industrial-red', bgColor: 'bg-industrial-red/10' },
  withdrawn: { label: '已撤回', color: 'text-steel-400', bgColor: 'bg-steel-700' },
}

export default function Requisition() {
  const { sheetMaterials, requisitionRecords, addRequisitionRecord, approveRequisition, rejectRequisition, withdrawRequisition } = useStore()
  const sheets = sheetMaterials.filter(m => !m.isRemnant)

  const [sheetId, setSheetId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purpose, setPurpose] = useState('')
  const [applicant] = useState('当前用户')

  const selectedSheet = useMemo(() => sheets.find(s => s.id === sheetId), [sheets, sheetId])
  const numQty = Number(quantity) || 0
  const overStock = selectedSheet && numQty > selectedSheet.stock

  const canSubmit = !!sheetId && numQty > 0 && !overStock && !!purpose.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    const sheet = selectedSheet!
    const newRecord: RequisitionRecord = {
      id: `rq-${Date.now()}`,
      sheetId: sheet.id,
      sheetSpec: sheet.spec,
      quantity: numQty,
      purpose: purpose.trim(),
      applicant,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    addRequisitionRecord(newRecord)
    setSheetId('')
    setQuantity('')
    setPurpose('')
  }

  const sortedRecords = [...requisitionRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="space-y-5 animate-slide-up">
      <h1 className="text-xl font-body text-white">领用申请</h1>

      <div className="rounded-lg bg-steel-800 p-6 industrial-border">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-medium text-white">
          <FileText size={20} className="text-industrial-orange" />
          新建领用
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <label className="mb-1.5 block text-sm text-steel-400">板材选择</label>
            <select
              value={sheetId}
              onChange={e => setSheetId(e.target.value)}
              className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors"
            >
              <option value="">请选择板材</option>
              {sheets.map(s => (
                <option key={s.id} value={s.id}>
                  {s.spec} ({s.size.width}×{s.size.height}) - 库存: {s.stock}{s.unit}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="mb-1.5 block text-sm text-steel-400">领用数量</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="请输入数量"
                className={`w-full rounded-lg border bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none transition-colors placeholder:text-steel-500 ${
                  overStock ? 'border-industrial-red focus:border-industrial-red' : 'border-steel-600 focus:border-industrial-orange'
                }`}
              />
              {selectedSheet && (
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body ${
                  overStock ? 'text-industrial-red' : 'text-steel-400'
                }`}>
                  最多可领 {selectedSheet.stock} {selectedSheet.unit}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-steel-400">用途 / 关联排版方案</label>
            <input
              type="text"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="请输入用途"
              className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors placeholder:text-steel-500"
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

        {overStock && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-industrial-red/10 px-4 py-2.5">
            <AlertCircle size={16} className="text-industrial-red flex-shrink-0" />
            <span className="text-sm text-industrial-red">
              领用数量超出当前库存（{selectedSheet?.stock} {selectedSheet?.unit}），请调整数量
            </span>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-white transition-colors ${
              canSubmit
                ? 'bg-industrial-orange hover:bg-industrial-orange-light'
                : 'bg-steel-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Send size={16} />
            提交申请
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <h3 className="mb-4 text-lg font-bold text-white">领用记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel-700 text-steel-400">
                <th className="pb-3 text-left font-body text-xs font-normal">板材规格</th>
                <th className="pb-3 text-left font-body text-xs font-normal">数量</th>
                <th className="pb-3 text-left font-body text-xs font-normal">用途</th>
                <th className="pb-3 text-left font-body text-xs font-normal">申请人</th>
                <th className="pb-3 text-left font-body text-xs font-normal">日期</th>
                <th className="pb-3 text-left font-body text-xs font-normal">状态</th>
                <th className="pb-3 text-right font-body text-xs font-normal">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map(record => (
                <tr key={record.id} className="border-b border-steel-700/50 transition-colors hover:bg-steel-700/30">
                  <td className="py-3 text-steel-200">{record.sheetSpec}</td>
                  <td className="py-3 font-display text-steel-200">{record.quantity}</td>
                  <td className="py-3 text-steel-300">{record.purpose}</td>
                  <td className="py-3 text-steel-300">{record.applicant}</td>
                  <td className="py-3 font-display text-steel-400">{record.createdAt}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-body ${statusLabels[record.status].bgColor} ${statusLabels[record.status].color}`}>
                      {statusLabels[record.status].label}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {record.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveRequisition(record.id)}
                            className="flex items-center gap-1 rounded bg-industrial-green/10 px-2.5 py-1 text-xs text-industrial-green hover:bg-industrial-green/20 transition-colors"
                            title="通过"
                          >
                            <Check size={12} />
                            通过
                          </button>
                          <button
                            onClick={() => rejectRequisition(record.id)}
                            className="flex items-center gap-1 rounded bg-industrial-red/10 px-2.5 py-1 text-xs text-industrial-red hover:bg-industrial-red/20 transition-colors"
                            title="驳回"
                          >
                            <X size={12} />
                            驳回
                          </button>
                        </>
                      )}
                      {(record.status === 'pending' || record.status === 'approved') && (
                        <button
                          onClick={() => withdrawRequisition(record.id)}
                          className="flex items-center gap-1 rounded bg-steel-700 px-2.5 py-1 text-xs text-steel-300 hover:bg-steel-600 transition-colors"
                          title="撤回"
                        >
                          <RotateCcw size={12} />
                          撤回
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
