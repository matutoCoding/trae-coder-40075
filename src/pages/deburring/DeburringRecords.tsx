import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, FileCheck } from 'lucide-react'
import { useStore } from '@/store'

const partOptions = ['L型支架', 'U型卡扣', '连接板主件', '底座零件', '加强筋片', '定位块', '护罩侧板', '转接板', '法兰盘本体']
const methodOptions = ['手动打磨', '机械打磨', '化学处理']

export default function DeburringRecords() {
  const { deburringRecords, addDeburringRecord } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ partName: '', method: '', duration: '', operator: '' })

  const handleSave = () => {
    if (!form.partName || !form.method || !form.duration || !form.operator) return
    const newRecord = {
      id: `DR${Date.now()}`,
      partName: form.partName,
      method: form.method,
      duration: Number(form.duration),
      operator: form.operator,
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }).replace(/\//g, '-'),
    }
    addDeburringRecord(newRecord)
    setForm({ partName: '', method: '', duration: '', operator: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-body text-white">毛刺处理记录</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white rounded-lg font-body transition-colors"
        >
          <Plus size={18} />
          新增处理记录
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="bg-steel-800 rounded-xl p-6 w-full max-w-md border border-steel-600 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-white">新增处理记录</h2>
              <button onClick={() => setShowModal(false)} className="text-steel-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-steel-400 mb-1">零件选择</label>
                <select
                  value={form.partName}
                  onChange={(e) => setForm({ ...form, partName: e.target.value })}
                  className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange transition-colors"
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
                  className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange transition-colors"
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
                  className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange transition-colors placeholder:text-steel-500"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-400 mb-1">处理人</label>
                <input
                  type="text"
                  value={form.operator}
                  onChange={(e) => setForm({ ...form, operator: e.target.value })}
                  placeholder="请输入处理人姓名"
                  className="w-full bg-steel-700 text-white border border-steel-600 rounded-lg px-3 py-2 font-body focus:outline-none focus:border-industrial-orange transition-colors placeholder:text-steel-500"
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

      <div className="bg-steel-800 rounded-lg industrial-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-steel-700">
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">零件名称</th>
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">处理方式</th>
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">处理耗时</th>
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">处理人</th>
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">处理时间</th>
              <th className="text-left px-5 py-3 text-steel-400 font-body text-xs">操作</th>
            </tr>
          </thead>
          <tbody>
            {deburringRecords.map((r) => (
              <tr key={r.id} className="border-b border-steel-700/50 hover:bg-steel-700 transition-colors">
                <td className="px-5 py-3 text-white font-display">{r.partName}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-steel-700 text-steel-300 rounded text-xs font-body">
                    {r.method}
                  </span>
                </td>
                <td className="px-5 py-3 font-display text-white">{r.duration} 分钟</td>
                <td className="px-5 py-3 text-white font-body">{r.operator}</td>
                <td className="px-5 py-3 text-steel-400 font-body text-sm">{r.time}</td>
                <td className="px-5 py-3">
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
  )
}
