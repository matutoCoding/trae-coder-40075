import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Clock, User, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

export default function Layout() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false })
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

  return (
    <div className="flex h-screen bg-steel-900 font-body text-steel-300">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-steel-700 bg-steel-800 px-6">
          <div className="flex items-center gap-2 text-sm text-steel-400">
            <ChevronRight className="h-4 w-4" />
            <span>首页</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-industrial-orange" />
              <span className="text-steel-300">{dateStr}</span>
              <span className="font-mono text-industrial-orange">{timeStr}</span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-steel-700">
              <User className="h-4 w-4 text-steel-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
