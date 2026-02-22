import Link from 'next/link'
import { LayoutDashboard, KanbanSquare, CheckSquare, BarChart2, ArrowLeft, Smartphone } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-[#F7F7F5]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#F7F7F5]/6 flex flex-col p-4 gap-1 shrink-0">
        <div className="mb-6 px-2 pt-2">
          <p className="text-[#C9A25F] font-black text-sm tracking-widest">LATIMORE</p>
          <p className="text-[#A9B1BE] text-xs mt-0.5">Hub Admin</p>
        </div>
        {[
          { href: '/admin', label: 'Inbox', icon: <LayoutDashboard size={16} /> },
          { href: '/admin/pipeline', label: 'Pipeline', icon: <KanbanSquare size={16} /> },
          { href: '/admin/tasks', label: 'Tasks', icon: <CheckSquare size={16} /> },
          { href: '/admin/reports', label: 'Reports', icon: <BarChart2 size={16} /> },
          { href: '/admin/card-analytics', label: 'Card Analytics', icon: <Smartphone size={16} /> },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A9B1BE] hover:text-[#F7F7F5] hover:bg-[#F7F7F5]/5 transition-all">
            <span className="text-[#C9A25F]">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-[#F7F7F5]/6">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#A9B1BE] hover:text-[#F7F7F5] transition-all">
            <ArrowLeft size={14} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
