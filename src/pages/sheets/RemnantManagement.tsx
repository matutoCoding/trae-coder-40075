import { useStore } from '@/store'
import { Recycle, Tag, Check } from 'lucide-react'

export default function RemnantManagement() {
  const { sheetMaterials } = useStore()
  const remnants = sheetMaterials.filter(m => m.isRemnant)

  const isReuseCandidate = (w: number, h: number) => w >= 400 && h >= 800

  return (
    <div className="min-h-screen bg-steel-900 p-6 font-body">
      <h1 className="mb-6 text-2xl font-bold text-white">余料管理</h1>

      <div className="grid grid-cols-4 gap-5">
        {remnants.map(remnant => {
          const reusable = isReuseCandidate(remnant.size.width, remnant.size.height)
          return (
            <div
              key={remnant.id}
              className="rounded-lg bg-steel-800 p-5 industrial-border card-hover"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-steel-200">{remnant.spec}</span>
                {reusable && (
                  <span className="flex items-center gap-1 rounded-full bg-industrial-green/15 px-2 py-0.5 text-xs text-industrial-green">
                    <Tag size={10} />
                    复用推荐
                  </span>
                )}
              </div>

              <div className="mb-4 flex items-center justify-center rounded-md bg-steel-900 p-6">
                <div className="relative">
                  <div
                    className="border border-steel-500/50 bg-steel-700/30"
                    style={{
                      width: `${Math.max(80, remnant.size.width / 5)}px`,
                      height: `${Math.max(50, remnant.size.height / 10)}px`,
                      maxWidth: '160px',
                      maxHeight: '120px',
                    }}
                  >
                    <div
                      className="absolute rounded-sm bg-industrial-orange/20 border border-industrial-orange/30"
                      style={{ top: '10%', left: '8%', width: '40%', height: '30%' }}
                    />
                    <div
                      className="absolute rounded-sm bg-industrial-blue/20 border border-industrial-blue/30"
                      style={{ bottom: '15%', right: '10%', width: '35%', height: '35%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-steel-400">规格</span>
                  <span className="text-steel-200 font-display">{remnant.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel-400">尺寸</span>
                  <span className="text-steel-200 font-display">
                    {remnant.size.width}×{remnant.size.height}mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel-400">厚度</span>
                  <span className="text-steel-200 font-display">{remnant.thickness}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel-400">来源板材</span>
                  <span className="text-steel-200 font-display">{remnant.sourceId}</span>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-steel-700 py-2 text-sm text-steel-300 transition-colors hover:bg-steel-600 hover:text-white">
                <Check size={14} />
                标记使用
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
