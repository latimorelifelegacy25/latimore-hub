export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

async function getNewInquiries() {
  return prisma.inquiry.findMany({
    where: { stage: 'New' },
    orderBy: { createdAt: 'desc' },
    include: { contact: true },
  })
}

export default async function AdminInbox() {
  const items = await getNewInquiries()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F7F7F5]">Inbox</h1>
        <p className="text-[#A9B1BE] text-sm mt-1">{items.length} new {items.length === 1 ? 'lead' : 'leads'}</p>
      </div>

      {items.length === 0 ? (
        <div className="border border-[#F7F7F5]/8 rounded-xl p-12 text-center text-[#A9B1BE]">
          <p className="text-lg">No new leads yet.</p>
          <p className="text-sm mt-2">Unified leads from forms, cards, and landing pages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1a2535] border border-[#F7F7F5]/6 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#F7F7F5]">
                    {item.contact.firstName} {item.contact.lastName}
                    {!item.contact.firstName && !item.contact.lastName && <span className="text-[#A9B1BE]">Anonymous</span>}
                  </p>
                  <p className="text-[#A9B1BE] text-sm mt-0.5">{item.contact.email ?? item.contact.phone ?? 'No direct contact info'}</p>
                  {item.contact.phone && item.contact.email && <p className="text-[#A9B1BE] text-sm">{item.contact.phone}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-[#C9A25F]/15 text-[#C9A25F] text-xs font-bold rounded-full">
                    {item.productInterest}
                  </span>
                  {item.county && (
                    <span className="px-3 py-1 bg-[#F7F7F5]/8 text-[#A9B1BE] text-xs rounded-full">
                      {item.county}
                    </span>
                  )}
                </div>
              </div>
              {item.source && (
                <p className="text-[#A9B1BE]/70 text-xs mt-3">
                  {item.source}
                  {item.campaign ? ` · ${item.campaign}` : ''}
                </p>
              )}
              <p className="text-[#A9B1BE]/60 text-xs mt-1">
                {new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
