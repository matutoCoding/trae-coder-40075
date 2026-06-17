import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Grid3X3,
  Layers,
  Zap,
  PackageSearch,
  ShieldCheck,
  Calculator,
  ChevronLeft,
  ChevronDown,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: React.ElementType
  to: string
  children?: { label: string; to: string }[]
}

const navGroups: NavItem[] = [
  { label: '工作台', icon: LayoutDashboard, to: '/' },
  { label: '图纸接收', icon: FileText, to: '/drawings', children: [{ label: '图纸上传', to: '/drawings/upload' }] },
  { label: '套料排版', icon: Grid3X3, to: '/nesting' },
  { label: '板材领用', icon: Layers, to: '/sheets', children: [{ label: '余料管理', to: '/sheets/remnants' }, { label: '领料申请', to: '/sheets/requisition' }] },
  { label: '激光切割', icon: Zap, to: '/cutting', children: [{ label: '切割参数', to: '/cutting/params' }, { label: '切割记录', to: '/cutting/records' }] },
  { label: '零件分拣', icon: PackageSearch, to: '/sorting', children: [{ label: '分拣进度', to: '/sorting/progress' }] },
  { label: '毛刺处理', icon: ShieldCheck, to: '/deburring', children: [{ label: '质检登记', to: '/deburring/inspection' }] },
  { label: '计件结算', icon: Calculator, to: '/billing', children: [{ label: '结算管理', to: '/billing/settlement' }] },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const location = useLocation()

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isParentActive = (item: NavItem) => {
    if (item.to === '/') return location.pathname === '/'
    return location.pathname === item.to || (item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false)
  }

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-steel-700 bg-steel-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className={cn('flex h-14 shrink-0 items-center border-b border-steel-700 px-4', collapsed && 'justify-center')}>
        <Flame className="h-6 w-6 shrink-0 text-industrial-orange" />
        {!collapsed && (
          <span className="ml-2 font-display text-xl font-bold tracking-wide text-white">
            LaserCut Pro
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((item) => {
          const Icon = item.icon
          const active = isParentActive(item)
          const open = openGroups[item.label]
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.label}>
              {hasChildren ? (
                <div className="relative">
                  <NavLink
                    to={item.to}
                    end={false}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      active
                        ? 'border-l-2 border-industrial-orange bg-steel-700 text-industrial-orange'
                        : 'border-l-2 border-transparent text-steel-300 hover:bg-steel-700 hover:text-white',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                  {!collapsed && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleGroup(item.label)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-steel-400 hover:text-white rounded hover:bg-steel-600 transition-colors"
                    >
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform',
                          open && 'rotate-180',
                        )}
                      />
                    </button>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    active
                      ? 'border-l-2 border-industrial-orange bg-steel-700 text-industrial-orange'
                      : 'border-l-2 border-transparent text-steel-300 hover:bg-steel-700 hover:text-white',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )}

              {hasChildren && !collapsed && (
                <div
                  className={cn(
                    'overflow-hidden transition-all',
                    open ? 'max-h-40' : 'max-h-0',
                  )}
                >
                  {item.children!.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center py-2 pl-12 pr-4 text-sm transition-colors',
                          isActive
                            ? 'text-industrial-orange'
                            : 'text-steel-400 hover:text-white',
                        )
                      }
                    >
                      <span className="mr-2 h-1 w-1 rounded-full bg-steel-500" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-steel-700 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded py-2 text-steel-400 transition-colors hover:bg-steel-700 hover:text-white"
        >
          {collapsed ? (
            <ChevronLeft className="h-5 w-5 rotate-180" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  )
}
