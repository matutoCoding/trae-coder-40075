import { useState } from 'react'
import { ClipboardCheck, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { useStore } from '@/store'
import type { BurrInspection } from '@/store'

const partOptions = ['法兰盘-A3', '支撑架-B7', '连接板-C2', '底座-D5', '挡板-E1', '支架-F4']

const burrLevelLabels: Record<BurrInspection['burrLevel'], string> = {
  none: '无',
  slight: '轻微',
  moderate: '中等',
  severe: '严重',
}

const burrLevelColors: Record<BurrInspection['burrLevel'], string> = {
  none: 'bg-industrial-green/20 text-industrial-green',
  slight: 'bg-industrial-yellow/20 text-industrial-yellow',
  moderate: 'bg-industrial-orange/20 text-industrial-orange',
  severe: 'bg-industrial-red/20 text-industrial-red',
}

const qualityLabels: Record<BurrInspection['sectionQuality'], string> = {
  excellent: '优秀',
  good: '良好',
  acceptable: '合格',
  poor: '较差',
}

export default function Inspection() {
  const { burrInspections, addBurrInspection } = useStore()

  const [form, setForm] = useState({
    partName: '',
    burrLevel: '' as BurrInspection['burrLevel'] | '',
    sectionQuality: '' as BurrInspection['sectionQuality'] | '',
    result: '' as 'pass' | 'fail' | '',
    remark: '',
  })

  const total = burrInspections.length
  const passCount = burrInspections.filter((i) => i.result === 'pass').length
  const failCount = burrInspections.filter((i) => i.result === 'fail').length
  const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : '0.0'

  const handleSubmit = () => {
    if (!form.partName || !form.burrLevel || !form.sectionQuality || !form.result) return
    addBurrInspection({
      partName: form.partName,
      inspector: '当前用户',
      burrLevel: form.burrLevel,
      sectionQuality: form.sectionQuality,
      result: form.result,
      remark: form.remark,
    })
    setForm({ partName: '', burrLevel: '', sectionQuality: '', result: '', remark: '' })
  }

  return (
    <div className="min-h-screen bg-steel-900 font-body text-steel-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-white mb-6">切割断面检查</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1">总检查数</div>
            <div className="text-2xl font-display font-bold text-white">{total}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <CheckCircle size={14} className="text-industrial-green" />
              合格数
            </div>
            <div className="text-2xl font-display font-bold text-industrial-green">{passCount}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <XCircle size={14} className="text-industrial-red" />
              不合格数
            </div>
            <div className="text-2xl font-display font-bold text-industrial-red">{failCount}</div>
          </div>
          <div className="bg-steel-800 border border-steel-600 rounded-xl p-4">
            <div className="text-steel-400 text-sm mb-1 flex items-center gap-1">
              <TrendingUp size={14} className="text-industrial-cyan" />
              合格率
            </div>
            <div className="text-2xl font-display font-bold text-industrial-cyan">{passRate}%</div>
          </div>
        </div>

        <div className="bg-steel-800 border border-steel-600 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <ClipboardCheck size={20} className="text-industrial-orange" />
            新增检查
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-steel-400 mb-1">零件选择</label>
              <select
                value={form.partName}
                onChange={(e) => setForm({ ...form, partName: e.target.value })}
                className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
              >
                <option value="">请选择零件</option>
                {partOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-steel-400 mb-2">毛刺等级</label>
              <div className="flex gap-3">
                {(['none', 'slight', 'moderate', 'severe'] as const).map((level) => (
                  <label
                    key={level}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                      form.burrLevel === level
                        ? 'border-industrial-orange bg-industrial-orange/10 text-white'
                        : 'border-steel-600 text-steel-400 hover:border-steel-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="burrLevel"
                      value={level}
                      checked={form.burrLevel === level}
                      onChange={() => setForm({ ...form, burrLevel: level })}
                      className="hidden"
                    />
                    {burrLevelLabels[level]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-steel-400 mb-2">断面质量</label>
              <div className="flex gap-3">
                {(['excellent', 'good', 'acceptable', 'poor'] as const).map((q) => (
                  <label
                    key={q}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                      form.sectionQuality === q
                        ? 'border-industrial-orange bg-industrial-orange/10 text-white'
                        : 'border-steel-600 text-steel-400 hover:border-steel-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sectionQuality"
                      value={q}
                      checked={form.sectionQuality === q}
                      onChange={() => setForm({ ...form, sectionQuality: q })}
                      className="hidden"
                    />
                    {qualityLabels[q]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-steel-400 mb-2">检查结果</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, result: 'pass' })}
                  className={`px-6 py-2 rounded-lg font-body transition-colors ${
                    form.result === 'pass'
                      ? 'bg-industrial-green text-white'
                      : 'bg-steel-700 text-steel-400 hover:bg-steel-600'
                  }`}
                >
                  合格
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, result: 'fail' })}
                  className={`px-6 py-2 rounded-lg font-body transition-colors ${
                    form.result === 'fail'
                      ? 'bg-industrial-red text-white'
                      : 'bg-steel-700 text-steel-400 hover:bg-steel-600'
                  }`}
                >
                  不合格
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-steel-400 mb-1">备注</label>
              <textarea
                value={form.remark}
                onChange={(e) => setForm({ ...form, remark: e.target.value })}
                rows={3}
                placeholder="请输入备注信息"
                className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg font-body transition-colors"
            >
              提交检查
            </button>
          </div>
        </div>

        <div className="bg-steel-800 border border-steel-600 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-steel-600">
            <h2 className="text-lg font-display font-bold text-white">近期检查记录</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-600">
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">零件名称</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">检验员</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">毛刺等级</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">断面质量</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">结果</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">时间</th>
              </tr>
            </thead>
            <tbody>
              {burrInspections.map((insp) => (
                <tr key={insp.id} className="border-b border-steel-700 hover:bg-steel-700/50 transition-colors">
                  <td className="px-4 py-3 text-white font-display">{insp.partName}</td>
                  <td className="px-4 py-3 text-white font-body">{insp.inspector}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-body ${burrLevelColors[insp.burrLevel]}`}>
                      {burrLevelLabels[insp.burrLevel]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel-300 font-body">{qualityLabels[insp.sectionQuality]}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-body ${
                      insp.result === 'pass'
                        ? 'bg-industrial-green/20 text-industrial-green'
                        : 'bg-industrial-red/20 text-industrial-red'
                    }`}>
                      {insp.result === 'pass' ? '合格' : '不合格'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel-400 font-body text-sm">{insp.inspectTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
