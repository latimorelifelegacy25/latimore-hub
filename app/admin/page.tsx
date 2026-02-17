import { prisma } from '@/lib/prisma'

async function getNewInquiries() {
  return prisma.inquiry.findMany({
    where: { status: 'New_Inquiry' },
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
        <p className="text-[#A9B1BE] text-sm mt-1">{items.length} new {items.length === 1 ? 'inquiry' : 'inquiries'}</p>
      </div>

      {items.length === 0 ? (
        <div className="border border-[#F7F7F5]/8 rounded-xl p-12 text-center text-[#A9B1BE]">
          <p className="text-lg">No new inquiries yet.</p>
          <p className="text-sm mt-2">Leads from your Fillout form will appear here.</p>
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
                  <p className="text-[#A9B1BE] text-sm mt-0.5">{item.contact.email}</p>
                  {item.contact.phone && <p className="text-[#A9B1BE] text-sm">{item.contact.phone}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-[#C9A25F]/15 text-[#C9A25F] text-xs font-bold rounded-full">
                    {item.interestType}
                  </span>
                  {item.contact.county && (
                    <span className="px-3 py-1 bg-[#F7F7F5]/8 text-[#A9B1BE] text-xs rounded-full">
                      {item.contact.county}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[#A9B1BE]/60 text-xs mt-3">
                {new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
