'use client'
export default function DashboardClient({ data }: { data: any }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F7F7F5]">Dashboard</h1>
        <p className="text-[#A9B1BE] text-sm mt-1">Pipeline overview</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Inquiries', value: data.totalInquiries },
          { label: 'Conversion Rate', value: data.conversionRate + '%' },
          { label: 'New (7 days)', value: data.recentActivity?.newLast7 },
          { label: 'Sold (7 days)', value: data.recentActivity?.soldLast7 },
        ].map((s) => (
          <div key={s.label} className="bg-[#1a2535] border border-[#F7F7F5]/8 rounded-xl p-4">
            <p className="text-xs text-[#A9B1BE] uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-black text-[#F7F7F5]">{s.value ?? 0}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#1a2535] border border-[#F7F7F5]/8 rounded-xl p-4">
        <p className="text-sm font-bold text-[#F7F7F5] mb-3">Recent Leads</p>
        {data.recentLeads?.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#F7F7F5]/5 last:border-0">
            <p className="text-sm text-[#F7F7F5]">{[c.firstName, c.lastName].filter(Boolean).join(' ') || c.email || 'Unknown'}</p>
            <p className="text-xs text-[#A9B1BE]">{c.county ?? ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
