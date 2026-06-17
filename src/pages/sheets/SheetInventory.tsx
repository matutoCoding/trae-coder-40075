import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import {
  Package, TrendingDown, Layers, AlertTriangle, ArrowDownToLine, ArrowUpFromLine,
  X, Send, History, Filter, ArrowUpRight, ArrowDownLeft
} from 'lucide-react'

export default function SheetInventory() {
  const { sheetMaterials, stockFlows, stockIn } = useStore()
  const [materialFilter, setMaterialFilter] = useState('')
  const [thicknessFilter, setThicknessFilter] = useState('')
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null)
  const [showInboundModal, setShowInboundModal] = useState(false)
  const [inboundSheetId, setInboundSheetId] = useState('')
  const [inboundQty, setInboundQty] = useState('')
  const [inboundSource, setInboundSource] = useState('采购入库')
  const [inboundRemark, setInboundRemark] = useState('')
  const [inboundOperator] = useState('当前用户')

  const sheets = sheetMaterials.filter(m => !m.isRemnant)
  const materials = [...new Set(sheets.map(s => s.material))]
  const thicknesses = [...new Set(sheets.map(s => s.thickness))].sort((a, b) => a - b)

  const filtered = sheets.filter(s => {
    if (materialFilter && s.material !== materialFilter) return false
    if (thicknessFilter && s.thickness !== Number(thicknessFilter)) return false
    return true
  })

  const totalStock = sheets.reduce((sum, s) => sum + s.stock, 0)
  const remnants = sheetMaterials.filter(m => m.isRemnant).length
  const warnings = sheets.filter(s => s.stock < 5).length

  const totalOutToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return stockFlows
      .filter(f => f.type === 'out' && f.time.startsWith(today.replace(/-/g, '-')))
      .reduce((sum, f) => sum + f.quantity, 0)
  }, [stockFlows])

  const displayedFlows = useMemo(() => {
    const flows = selectedSheetId
      ? stockFlows.filter(f => f.sheetId === selectedSheetId)
      : stockFlows
    return [...flows].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 50)
  }, [stockFlows, selectedSheetId])

  const selectedSheet = useMemo(
    () => sheets.find(s => s.id === selectedSheetId),
    [sheets, selectedSheetId]
  )

  const handleOpenInbound = (sheetId?: string) => {
    if (sheetId) {
      setInboundSheetId(sheetId)
    } else {
      setInboundSheetId(sheets[0]?.id || '')
    }
    setInboundQty('')
    setInboundSource('采购入库')
    setInboundRemark('')
    setShowInboundModal(true)
  }

  const handleInboundSubmit = () => {
    const qty = Number(inboundQty)
    if (!inboundSheetId || !qty || qty <= 0) return
    stockIn(inboundSheetId, qty, inboundSource, inboundRemark, inboundOperator)
    setShowInboundModal(false)
  }

  const summaryCards = [
    { label: '总库存量', value: totalStock, icon: Package, unit: '张' },
    { label: '今日出库', value: totalOutToday, icon: TrendingDown, unit: '张' },
    { label: '余料数量', value: remnants, icon: Layers, unit: '块' },
    { label: '库存预警', value: warnings, icon: AlertTriangle, unit: '项', accent: true },
  ]

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-body text-white">板材库存</h1>
        <button
          onClick={() => handleOpenInbound()}
          className="flex items-center gap-2 rounded-lg bg-industrial-green/20 px-4 py-2 text-sm text-industrial-green hover:bg-industrial-green/30 transition-colors"
        >
          <ArrowDownToLine size={16} />
          新增入库
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-lg bg-steel-800 p-4 industrial-border card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel-400">{card.label}</p>
                <p className={`mt-1 font-display text-2xl ${card.accent && card.value > 0 ? 'text-industrial-red' : 'text-white'}`}>
                  {card.value}
                  <span className="ml-1 text-sm text-steel-400">{card.unit}</span>
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${card.accent && card.value > 0 ? 'bg-industrial-red/10' : 'bg-steel-700'}`}>
                <card.icon size={22} className={card.accent && card.value > 0 ? 'text-industrial-red' : 'text-steel-400'} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <select
          value={materialFilter}
          onChange={e => setMaterialFilter(e.target.value)}
          className="rounded-lg border border-steel-600 bg-steel-800 px-3 py-2 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors"
        >
          <option value="">全部材质</option>
          {materials.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={thicknessFilter}
          onChange={e => setThicknessFilter(e.target.value)}
          className="rounded-lg border border-steel-600 bg-steel-800 px-3 py-2 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors"
        >
          <option value="">全部厚度</option>
          {thicknesses.map(t => (
            <option key={t} value={t}>{t}mm</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-body font-medium text-white">库存列表</h3>
          <div className="text-xs text-steel-400">
            {selectedSheet ? `当前筛选：${selectedSheet.spec}` : '点击板材行查看对应流水'}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel-700 text-steel-400">
                <th className="pb-3 text-left font-body text-xs font-normal">规格</th>
                <th className="pb-3 text-left font-body text-xs font-normal">材质</th>
                <th className="pb-3 text-left font-body text-xs font-normal">厚度</th>
                <th className="pb-3 text-left font-body text-xs font-normal">尺寸</th>
                <th className="pb-3 text-left font-body text-xs font-normal">库存</th>
                <th className="pb-3 text-left font-body text-xs font-normal">单位</th>
                <th className="pb-3 text-right font-body text-xs font-normal">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sheet => (
                <tr
                  key={sheet.id}
                  className={`border-b border-steel-700/50 transition-colors cursor-pointer ${
                    selectedSheetId === sheet.id ? 'bg-industrial-orange/10' : 'hover:bg-steel-700/30'
                  }`}
                  onClick={() => setSelectedSheetId(selectedSheetId === sheet.id ? null : sheet.id)}
                >
                  <td className="py-3 text-steel-200">{sheet.spec}</td>
                  <td className="py-3 text-steel-300">{sheet.material}</td>
                  <td className="py-3 font-display text-steel-300">{sheet.thickness}mm</td>
                  <td className="py-3 font-display text-steel-300">
                    {sheet.size.width}×{sheet.size.height}
                  </td>
                  <td className={`py-3 font-display ${sheet.stock < 5 ? 'text-industrial-red' : 'text-steel-200'}`}>
                    {sheet.stock}
                  </td>
                  <td className="py-3 text-steel-400">{sheet.unit}</td>
                  <td className="py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenInbound(sheet.id)}
                        className="flex items-center gap-1 rounded bg-industrial-green/10 px-2.5 py-1 text-xs text-industrial-green hover:bg-industrial-green/20 transition-colors"
                      >
                        <ArrowDownToLine size={12} />
                        入库
                      </button>
                      <Link
                        to="/sheets/requisition"
                        className="flex items-center gap-1 rounded bg-industrial-orange/10 px-2.5 py-1 text-xs text-industrial-orange hover:bg-industrial-orange/20 transition-colors"
                      >
                        <ArrowUpFromLine size={12} />
                        领用
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-industrial-orange" />
            <h3 className="font-body font-medium text-white">
              库存变动流水
              {selectedSheet && <span className="ml-2 text-xs font-normal text-steel-400">（仅显示 {selectedSheet.spec}）</span>}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {selectedSheetId && (
              <button
                onClick={() => setSelectedSheetId(null)}
                className="flex items-center gap-1 rounded bg-steel-700 px-2.5 py-1 text-xs text-steel-300 hover:bg-steel-600 transition-colors"
              >
                <Filter size={12} />
                清除筛选
              </button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-steel-800">
              <tr className="border-b border-steel-700 text-steel-400">
                <th className="pb-2 text-left font-body text-xs font-normal">时间</th>
                <th className="pb-2 text-left font-body text-xs font-normal">类型</th>
                <th className="pb-2 text-left font-body text-xs font-normal">来源</th>
                <th className="pb-2 text-left font-body text-xs font-normal">板材</th>
                <th className="pb-2 text-right font-body text-xs font-normal">数量</th>
                <th className="pb-2 text-left font-body text-xs font-normal">经办人</th>
                <th className="pb-2 text-left font-body text-xs font-normal">备注</th>
              </tr>
            </thead>
            <tbody>
              {displayedFlows.map(flow => (
                <tr key={flow.id} className="border-b border-steel-700/50 transition-colors hover:bg-steel-700/30">
                  <td className="py-2.5 font-display text-xs text-steel-400">{flow.time}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-body ${
                      flow.type === 'in'
                        ? 'bg-industrial-green/10 text-industrial-green'
                        : 'bg-industrial-red/10 text-industrial-red'
                    }`}>
                      {flow.type === 'in' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      {flow.type === 'in' ? '入库' : '出库'}
                    </span>
                  </td>
                  <td className="py-2.5 text-steel-300 text-xs">{flow.source}</td>
                  <td className="py-2.5 text-steel-200 text-xs">{flow.sheetSpec}</td>
                  <td className={`py-2.5 text-right font-display text-sm ${
                    flow.type === 'in' ? 'text-industrial-green' : 'text-industrial-red'
                  }`}>
                    {flow.type === 'in' ? '+' : '-'}{flow.quantity}
                  </td>
                  <td className="py-2.5 text-steel-400 text-xs">{flow.operator}</td>
                  <td className="py-2.5 text-steel-500 text-xs">{flow.remark || '—'}</td>
                </tr>
              ))}
              {displayedFlows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-steel-500 text-sm">暂无流水记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showInboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-lg bg-steel-800 p-6 industrial-border animate-slide-up">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">板材入库</h3>
              <button
                onClick={() => setShowInboundModal(false)}
                className="text-steel-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-steel-400">板材选择</label>
                <select
                  value={inboundSheetId}
                  onChange={e => setInboundSheetId(e.target.value)}
                  className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors"
                >
                  <option value="">请选择板材</option>
                  {sheets.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.spec} (当前库存: {s.stock}{s.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-steel-400">入库数量</label>
                <input
                  type="number"
                  min={1}
                  value={inboundQty}
                  onChange={e => setInboundQty(e.target.value)}
                  placeholder="请输入数量"
                  className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors placeholder:text-steel-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-steel-400">入库来源</label>
                <select
                  value={inboundSource}
                  onChange={e => setInboundSource(e.target.value)}
                  className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors"
                >
                  <option value="采购入库">采购入库</option>
                  <option value="余料回收">余料回收</option>
                  <option value="调拨入库">调拨入库</option>
                  <option value="退货入库">退货入库</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-steel-400">备注</label>
                <input
                  type="text"
                  value={inboundRemark}
                  onChange={e => setInboundRemark(e.target.value)}
                  placeholder="请输入备注（可选）"
                  className="w-full rounded-lg border border-steel-600 bg-steel-700 px-3 py-2.5 text-sm text-steel-200 outline-none focus:border-industrial-orange transition-colors placeholder:text-steel-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-steel-400">经办人</label>
                <input
                  type="text"
                  value={inboundOperator}
                  readOnly
                  className="w-full rounded-lg border border-steel-600 bg-steel-600 px-3 py-2.5 text-sm text-steel-300"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowInboundModal(false)}
                className="rounded-lg border border-steel-600 px-5 py-2 text-sm text-steel-300 hover:bg-steel-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleInboundSubmit}
                disabled={!inboundSheetId || !inboundQty || Number(inboundQty) <= 0}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm text-white transition-colors ${
                  inboundSheetId && inboundQty && Number(inboundQty) > 0
                    ? 'bg-industrial-green hover:bg-industrial-green/80'
                    : 'bg-steel-600 cursor-not-allowed opacity-60'
                }`}
              >
                <Send size={14} />
                确认入库
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
