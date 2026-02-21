'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

const COLUMNS = [
  { id: 'New_Inquiry', title: 'New', color: '#3b82f6' },
  { id: 'Qualified',   title: 'Qualified', color: '#a855f7' },
  { id: 'Booked',      title: 'Booked', color: '#C9A25F' },
  { id: 'Closed_Won',  title: 'Won ✓', color: '#22c55e' },
  { id: 'Closed_Lost', title: 'Lost', color: '#6b7280' },
]

type Inquiry = {
  id: string; interestType: string; createdAt: string; status: string
  contact: { firstName?: string | null; lastName?: string | null; email: string; phone?: string | null; county?: string | null }
}

export default function Pipeline() {
  const [data, setData] = useState<Record<string, Inquiry[]>>({})
  const [loading, setLoading] = useState(true)

  async function load() {
    const all: Record<string, Inquiry[]> = {}
    await Promise.all(COLUMNS.map(async col => {
      const res = await fetch(`/api/inquiries?status=${col.id}`, { cache: 'no-store' })
      const { items } = await res.json()
      all[col.id] = items
    }))
    setData(all); setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function onDragEnd(result: DropResult) {
    const { draggableId, destination, source } = result
    if (!destination || destination.droppableId === source.droppableId) return
    const from = source.droppableId; const to = destination.droppableId
    const item = data[from]?.find(x => x.id === draggableId)
    if (!item) return
    setData(s => ({ ...s, [from]: s[from].filter(x => x.id !== draggableId), [to]: [{ ...item, status: to }, ...(s[to] ?? [])] }))
    await fetch(`/api/inquiries/${draggableId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: to }) })
  }

  if (loading) return <div className="p-6 text-[#A9B1BE]">Loading pipeline…</div>

  const totalCount = Object.values(data).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F7F7F5]">Pipeline</h1>
        <p className="text-[#A9B1BE] text-sm mt-1">{totalCount} total inquiries · drag to update stage</p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-3 overflow-x-auto">
          {COLUMNS.map(col => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col min-h-[70vh]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: col.color }}>{col.title}</span>
                    <span className="text-xs text-[#A9B1BE] bg-[#F7F7F5]/8 px-2 py-0.5 rounded-full">{(data[col.id] ?? []).length}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    {(data[col.id] ?? []).map((x, idx) => (
                      <Draggable draggableId={x.id} index={idx} key={x.id}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                            className="bg-[#1a2535] border border-[#F7F7F5]/6 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-[#C9A25F]/30 transition-all">
                            <p className="text-sm font-semibold text-[#F7F7F5] truncate">
                              {x.contact.firstName} {x.contact.lastName} {!x.contact.firstName && !x.contact.lastName && <span className="text-[#A9B1BE] text-xs">{x.contact.email}</span>}
                            </p>
                            <p className="text-xs text-[#A9B1BE] truncate mt-0.5">{x.contact.email}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#C9A25F]/15 text-[#C9A25F] rounded font-semibold">{x.interestType}</span>
                              {x.contact.county && <span className="text-[10px] px-1.5 py-0.5 bg-[#F7F7F5]/8 text-[#A9B1BE] rounded">{x.contact.county}</span>}
                            </div>
                            <p className="text-[10px] text-[#A9B1BE]/50 mt-2">{new Date(x.createdAt).toLocaleDateString()}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
