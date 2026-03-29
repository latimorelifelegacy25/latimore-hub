'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = { asset:{ id:string; status:string; scheduledFor:string|null } }

export default function ContentActions({ asset }:Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [scheduleDate, setScheduleDate] = useState(asset.scheduledFor ? asset.scheduledFor.slice(0,16) : '')
  const [error, setError] = useState('')

  async function patch(body:object) {
    setError('')
    const res = await fetch('/api/content/actions',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ assetId:asset.id, ...body }),
    })
    if (!res.ok) {
      const d = await res.json().catch(()=>({}))
      setError(d.error ?? 'Something went wrong')
    } else {
      startTransition(()=>router.refresh())
    }
  }

  if (asset.status==='published' || asset.status==='archived') return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {asset.status==='draft' && (
        <button onClick={()=>patch({action:'approve'})} disabled={isPending}
          className="rounded-lg border border-[#C9A25F]/40 bg-[#C9A25F]/10 px-4 py-1.5 text-xs font-semibold text-[#C9A25F] transition hover:bg-[#C9A25F]/20 disabled:opacity-50">
          Approve
        </button>
      )}
      {(asset.status==='draft'||asset.status==='approved') && (
        <div className="flex items-center gap-2">
          <input type="datetime-local" value={scheduleDate} onChange={e=>setScheduleDate(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-[#C9A25F]/40" />
          <button onClick={()=>{ if(!scheduleDate){setError('Pick a date first');return} patch({action:'schedule',scheduledFor:new Date(scheduleDate).toISOString()}) }}
            disabled={isPending}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-50">
            Schedule
          </button>
        </div>
      )}
      <button onClick={()=>patch({action:'archive'})} disabled={isPending}
        className="rounded-lg border border-white/6 px-3 py-1.5 text-xs text-[#8F98A8] transition hover:text-white disabled:opacity-50">
        Archive
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
