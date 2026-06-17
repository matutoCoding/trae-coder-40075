import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { Package, TrendingDown, Layers, AlertTriangle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

export default function SheetInventory() {
  const { sheetMaterials, updateSheetStock } = useStore()
  const [materialFilter, setMaterialFilter] = useState('')
  const [thicknessFilter, setThicknessFilter] = useState('')

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

  const summaryCards = [
    { label: '总库存量', value: totalStock, icon: Package, unit: '张' },
    { label: '本月领用', value: 28, icon: TrendingDown, unit: '张' },
    { label: '余料数量', value: remnants, icon: Layers, unit: '块' },
    { label: '库存预警', value: warnings, icon: AlertTriangle, unit: '项', accent: true },
  ]

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <h1 className="mb-6 text-2xl font-bold text-white">板材库存</h1>

      <div className="mb-6 grid grid-cols-4 gap-4">
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

      <div className="mb-4 flex gap-3">
        <select
          value={materialFilter}
          onChange={e => setMaterialFilter(e.target.value)}
          className="rounded-lg border border-steel-600 bg-steel-800 px-3 py-2 text-sm text-steel-200 outline-none focus:border-industrial-orange"
        >
          <option value="">全部材质</option>
          {materials.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={thicknessFilter}
          onChange={e => setThicknessFilter(e.target.value)}
          className="rounded-lg border border-steel-600 bg-steel-800 px-3 py-2 text-sm text-steel-200 outline-none focus:border-industrial-orange"
        >
          <option value="">全部厚度</option>
          {thicknesses.map(t => (
            <option key={t} value={t}>{t}mm</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-steel-800 p-5 industrial-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-600 text-steel-400">
              <th className="pb-3 text-left font-normal">规格</th>
              <th className="pb-3 text-left font-normal">材质</th>
              <th className="pb-3 text-left font-normal">厚度</th>
              <th className="pb-3 text-left font-normal">尺寸</th>
              <th className="pb-3 text-left font-normal">库存</th>
              <th className="pb-3 text-left font-normal">单位</th>
              <th className="pb-3 text-left font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sheet => (
              <tr key={sheet.id} className="border-b border-steel-700/50 transition-colors hover:bg-steel-700/30">
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
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 rounded bg-industrial-green/10 px-2.5 py-1 text-xs text-industrial-green hover:bg-industrial-green/20">
                      <ArrowDownToLine size={12} />
                      入库
                    </button>
                    <Link
                      to="/sheets/requisition"
                      className="flex items-center gap-1 rounded bg-industrial-orange/10 px-2.5 py-1 text-xs text-industrial-orange hover:bg-industrial-orange/20"
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
  )
}
