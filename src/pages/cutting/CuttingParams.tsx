import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Settings, Plus, Edit3, Play, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store'

const materialOptions = ['碳钢', '不锈钢', '铝合金', '铜合金']

export default function CuttingParams() {
  const navigate = useNavigate()
  const { cuttingParams, addCuttingParam, updateCuttingParam } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string | number>>({})
  const [form, setForm] = useState({
    materialType: '碳钢',
    thickness: '',
    gasPressure: '',
    focusPosition: '',
    speed: '',
    power: '',
  })

  const handleEdit = (id: string) => {
    const param = cuttingParams.find((p) => p.id === id)
    if (!param) return
    setEditingId(id)
    setEditData({ ...param })
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    updateCuttingParam(editingId, {
      materialType: String(editData.materialType),
      thickness: Number(editData.thickness),
      gasPressure: Number(editData.gasPressure),
      focusPosition: Number(editData.focusPosition),
      speed: Number(editData.speed),
      power: Number(editData.power),
    })
    setEditingId(null)
    setEditData({})
  }

  const handleApply = (id: string) => {
    navigate('/cutting')
  }

  const handleAddTemplate = () => {
    if (!form.thickness || !form.gasPressure || !form.focusPosition || !form.speed || !form.power) return
    addCuttingParam({
      id: `p${Date.now()}`,
      materialType: form.materialType,
      thickness: Number(form.thickness),
      gasPressure: Number(form.gasPressure),
      focusPosition: Number(form.focusPosition),
      speed: Number(form.speed),
      power: Number(form.power),
    })
    setForm({ materialType: '碳钢', thickness: '', gasPressure: '', focusPosition: '', speed: '', power: '' })
  }

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cutting" className="text-steel-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Settings className="w-6 h-6 text-industrial-orange" />
        <h1 className="text-2xl font-bold text-white font-display">参数设置</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-steel-800 rounded-lg industrial-border">
            <div className="px-5 py-3 border-b border-steel-700">
              <h2 className="text-white font-display font-semibold">参数模板</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-steel-400 border-b border-steel-700">
                    <th className="text-left px-5 py-3 font-body">材料类型</th>
                    <th className="text-left px-5 py-3 font-body">厚度(mm)</th>
                    <th className="text-left px-5 py-3 font-body">气体压力(MPa)</th>
                    <th className="text-left px-5 py-3 font-body">焦点位置(mm)</th>
                    <th className="text-left px-5 py-3 font-body">切割速度(mm/min)</th>
                    <th className="text-left px-5 py-3 font-body">激光功率(W)</th>
                    <th className="text-left px-5 py-3 font-body">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cuttingParams.map((param) => (
                    <tr key={param.id} className="border-b border-steel-700/50 hover:bg-steel-700/30 transition-colors">
                      {editingId === param.id ? (
                        <>
                          <td className="px-3 py-2">
                            <select value={editData.materialType} onChange={(e) => setEditData({ ...editData, materialType: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-full">
                              {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={editData.thickness} onChange={(e) => setEditData({ ...editData, thickness: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-20" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" step="0.1" value={editData.gasPressure} onChange={(e) => setEditData({ ...editData, gasPressure: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-20" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" step="0.5" value={editData.focusPosition} onChange={(e) => setEditData({ ...editData, focusPosition: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-20" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={editData.speed} onChange={(e) => setEditData({ ...editData, speed: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-24" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={editData.power} onChange={(e) => setEditData({ ...editData, power: e.target.value })}
                              className="bg-steel-700 text-white text-sm rounded px-2 py-1 border border-steel-600 w-20" />
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={handleSaveEdit} className="text-industrial-green hover:text-industrial-green/80 text-xs px-2 py-1 bg-industrial-green/10 rounded">
                              保存
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-3 text-white">{param.materialType}</td>
                          <td className="px-5 py-3 text-white font-display">{param.thickness}</td>
                          <td className="px-5 py-3 text-white font-display">{param.gasPressure}</td>
                          <td className="px-5 py-3 text-white font-display">{param.focusPosition}</td>
                          <td className="px-5 py-3 text-white font-display">{param.speed}</td>
                          <td className="px-5 py-3 text-white font-display">{param.power}</td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(param.id)}
                                className="flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-light text-xs px-2 py-1 bg-industrial-orange/10 rounded transition-colors">
                                <Edit3 className="w-3 h-3" /> 编辑
                              </button>
                              <button onClick={() => handleApply(param.id)}
                                className="flex items-center gap-1 text-industrial-cyan hover:text-industrial-cyan/80 text-xs px-2 py-1 bg-industrial-cyan/10 rounded transition-colors">
                                <Play className="w-3 h-3" /> 应用
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-steel-800 rounded-lg industrial-border p-5">
            <div className="flex items-center gap-2 mb-5">
              <Plus className="w-5 h-5 text-industrial-orange" />
              <h2 className="text-white font-display font-semibold">新建参数模板</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">材料类型</label>
                <select value={form.materialType} onChange={(e) => setForm({ ...form, materialType: e.target.value })}
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors">
                  {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">板材厚度 (mm)</label>
                <input type="number" value={form.thickness} onChange={(e) => setForm({ ...form, thickness: e.target.value })} placeholder="如: 6"
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500" />
              </div>
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">气体压力 (MPa)</label>
                <input type="number" step="0.1" value={form.gasPressure} onChange={(e) => setForm({ ...form, gasPressure: e.target.value })} placeholder="如: 0.8"
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500" />
              </div>
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">焦点位置 (mm)</label>
                <input type="number" step="0.5" value={form.focusPosition} onChange={(e) => setForm({ ...form, focusPosition: e.target.value })} placeholder="如: -2.5"
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500" />
              </div>
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">切割速度 (mm/min)</label>
                <input type="number" value={form.speed} onChange={(e) => setForm({ ...form, speed: e.target.value })} placeholder="如: 3200"
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500" />
              </div>
              <div>
                <label className="block text-steel-400 text-xs mb-1.5">激光功率 (W)</label>
                <input type="number" value={form.power} onChange={(e) => setForm({ ...form, power: e.target.value })} placeholder="如: 4000"
                  className="w-full bg-steel-700 text-white text-sm rounded px-3 py-2 border border-steel-600 focus:border-industrial-orange focus:outline-none transition-colors placeholder:text-steel-500" />
              </div>
              <button onClick={handleAddTemplate}
                className="w-full bg-industrial-orange hover:bg-industrial-orange-light text-white font-display font-semibold py-2.5 rounded transition-colors">
                保存模板
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
