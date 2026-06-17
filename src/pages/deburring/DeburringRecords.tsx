import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, FileCheck } from 'lucide-react'
import { useStore } from '@/store'

interface DeburringRecord {
  id: string
  partName: string
  method: string
  duration: number
  operator: string
  time: string
}

const initialRecords: DeburringRecord[] = [
  { id: '1', partName: '法兰盘-A3', method: '机械打磨', duration: 25, operator: '王建国', time: '2026-06-17 08:30' },
  { id: '2', partName: '支撑架-B7', method: '手动打磨', duration: 40, operator: '李明辉', time: '2026-06-17 09:15' },
  { id: '3', partName: '连接板-C2', method: '化学处理', duration: 60, operator: '张伟', time: '2026-06-17 10:00' },
  { id: '4', partName: '底座-D5', method: '机械打磨', duration: 30, operator: '陈志强', time: '2026-06-17 13:20' },
  { id: '5', partName: '挡板-E1', method: '手动打磨', duration: 50, operator: '赵磊', time: '2026-06-17 14:45' },
]

const partOptions = ['法兰盘-A3', '支撑架-B7', '连接板-C2', '底座-D5', '挡板-E1', '支架-F4']
const methodOptions = ['手动打磨', '机械打磨', '化学处理']

export default function DeburringRecords() {
  const [records, setRecords] = useState<DeburringRecord[]>(initialRecords)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ partName: '', method: '', duration: '', operator: '' })

  const handleSave = () => {
    if (!form.partName || !form.method || !form.duration || !form.operator) return
    const newRecord: DeburringRecord = {
      id: String(Date.now()),
      partName: form.partName,
      method: form.method,
      duration: Number(form.duration),
      operator: form.operator,
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }).replace(/\//g, '-'),
    }
    setRecords([newRecord, ...records])
    setForm({ partName: '', method: '', duration: '', operator: '' })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-steel-900 font-body text-steel-300 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-white">毛刺处理记录</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg font-body transition-colors"
          >
            <Plus size={18} />
            新增处理记录
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-steel-800 rounded-xl p-6 w-full max-w-md border border-steel-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-white">新增处理记录</h2>
                <button onClick={() => setShowModal(false)} className="text-steel-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
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
                  <label className="block text-sm text-steel-400 mb-1">处理方式</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                    className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
                  >
                    <option value="">请选择方式</option>
                    {methodOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-steel-400 mb-1">处理耗时（分钟）</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="请输入耗时"
                    className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm text-steel-400 mb-1">处理人</label>
                  <input
                    type="text"
                    value={form.operator}
                    onChange={(e) => setForm({ ...form, operator: e.target.value })}
                    placeholder="请输入处理人姓名"
                    className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg font-body transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-steel-800 rounded-xl border border-steel-600 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-600">
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">零件名称</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">处理方式</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">处理耗时</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">处理人</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">处理时间</th>
                <th className="text-left px-4 py-3 text-steel-400 font-body text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-steel-700 hover:bg-steel-700/50 transition-colors">
                  <td className="px-4 py-3 text-white font-display">{r.partName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-steel-700 text-steel-300 rounded text-xs font-body">
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-display text-white">{r.duration} 分钟</td>
                  <td className="px-4 py-3 text-white font-body">{r.operator}</td>
                  <td className="px-4 py-3 text-steel-400 font-body text-sm">{r.time}</td>
                  <td className="px-4 py-3">
                    <Link
                      to="/deburring/inspection"
                      className="flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-light text-sm font-body transition-colors"
                    >
                      <FileCheck size={14} />
                      断面检查
                    </Link>
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
