'use client'

import { useState } from 'react'
import PageHeader from '../_components/PageHeader'

async function callAI(prompt: string): Promise<string> {
  try {
    const res = await fetch('/api/admin/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: prompt, platform: 'general', count: 1 }),
    })
    const data = await res.json()
    return data.posts?.[0]?.draft || 'No response generated.'
  } catch { return 'Error generating content.' }
}

async function generateBulkCampaign(goal: string, persona: string) {
  const res = await fetch('/api/admin/ai/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: `4-week campaign for "${goal}" targeting ${persona}`, platform: 'facebook', count: 4 }),
  })
  const data = await res.json()
  return (data.posts || []).map((p: any, i: number) => ({
    title: p.title,
    draft: p.draft,
    platform: ['Facebook', 'LinkedIn', 'Instagram', 'Facebook'][i] || 'Facebook',
    sequenceDay: [1, 7, 14, 21][i] || (i + 1) * 7,
  }))
}

async function copyToClipboard(text: string) {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

type Tool = 'Canva' | 'Automation' | 'AutoPilot'

function CanvaSpecGenerator() {
  const [goal, setGoal] = useState('')
  const [spec, setSpec] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!goal.trim()) return
    setLoading(true)
    const res = await callAI(`Generate a Canva Creative Spec (copy/paste ready) for: "${goal}". Focus on visual hierarchy and high-impact educational copy for Central PA families.`)
    setSpec(res)
    setLoading(false)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#C49A6C]/20 rounded-2xl flex items-center justify-center text-[#C49A6C] text-lg">✨</div>
        <h2 className="text-xl font-black text-white">Canva Creative Architect</h2>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">Turn your strategic goals into precise creative instructions for your design team.</p>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Campaign Objective</label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Facebook post to announce 10-minute term life protection for Schuylkill county parents"
          className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#C49A6C] outline-none h-28 resize-none"
        />
      </div>
      <button onClick={generate} disabled={loading || !goal.trim()} className="w-full bg-[#C49A6C] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#b8893a] transition flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? 'Architecting...' : '🎨 Build Creative Spec'}
      </button>
      {spec && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-500">Blueprint</span>
            <button onClick={async () => { const ok = await copyToClipboard(spec); setCopied(ok); setTimeout(() => setCopied(false), 2000) }} className="text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:underline">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">{spec}</div>
        </div>
      )}
    </div>
  )
}

function AutomationPackGenerator() {
  const [objective, setObjective] = useState('')
  const [pack, setPack] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!objective.trim()) return
    setLoading(true)
    const res = await callAI(`Generate a complete Automation Asset Pack for: "${objective}". Include form fields, tagging strategy, and email nurture series copy that sounds like a helpful neighbor, not a robot.`)
    setPack(res)
    setLoading(false)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#C49A6C]/20 rounded-2xl flex items-center justify-center text-[#C49A6C] text-lg">🔗</div>
        <h2 className="text-xl font-black text-white">Automation Flow Architect</h2>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">Generate forms, tags, and email nurture series to convert visitors into protected families.</p>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Workflow Goal</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="e.g., Legacy checklist download leading to a booked FIA review"
          className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#C49A6C] outline-none h-28 resize-none"
        />
      </div>
      <button onClick={generate} disabled={loading || !objective.trim()} className="w-full bg-[#C49A6C] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#b8893a] transition flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? 'Mapping Logic...' : '⚙️ Generate Asset Pack'}
      </button>
      {pack && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-500">Blueprint</span>
            <button onClick={async () => { const ok = await copyToClipboard(pack); setCopied(ok); setTimeout(() => setCopied(false), 2000) }} className="text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:underline">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">{pack}</div>
        </div>
      )}
    </div>
  )
}

function CampaignAutoPilot() {
  const [goal, setGoal] = useState('Life Insurance Awareness')
  const [persona, setPersona] = useState('Young Families')
  const [campaignPosts, setCampaignPosts] = useState<any[]>([
    { title: "The 'Why' for Young Parents", draft: "Legacy isn't just for the elderly. It's for the 30-somethings in Pottsville making sure their kids have every opportunity, no matter what. #TheBeatGoesOn", sequenceDay: 1, platform: 'Facebook' },
    { title: 'Velocity Term Explainer', draft: "10 minutes. That's all it takes to secure your family's home for the next 30 years. #SchuylkillCounty", sequenceDay: 7, platform: 'LinkedIn' },
    { title: 'The Local Impact', draft: "We're not some remote call center. We're your neighbors in Central PA. Let's build your legacy.", sequenceDay: 14, platform: 'Instagram' },
    { title: 'The Invitation', draft: 'Book your legacy discovery call today. Protecting Today. Securing Tomorrow. #LegacyPlanning', sequenceDay: 21, platform: 'Facebook' },
  ])
  const [loading, setLoading] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  const generate = async () => {
    if (!goal.trim()) return
    setLoading(true)
    setScheduled(false)
    const results = await generateBulkCampaign(goal, persona)
    if (results.length > 0) setCampaignPosts(results)
    setLoading(false)
  }

  const commitToCalendar = async () => {
    const posts = campaignPosts.map((p) => {
      const scheduledFor = new Date()
      scheduledFor.setDate(scheduledFor.getDate() + p.sequenceDay)
      scheduledFor.setHours(10, 0, 0, 0)
      return { title: p.title, bodyText: p.draft, channel: p.platform.toLowerCase(), status: 'scheduled', scheduledFor: scheduledFor.toISOString() }
    })
    try { await fetch('/api/content/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ posts }) }) } catch {}
    setScheduled(true)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#C49A6C]/20 rounded-2xl flex items-center justify-center text-[#C49A6C] text-lg">⚡</div>
        <h2 className="text-xl font-black text-white">Campaign Auto-Pilot</h2>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">Architect a multi-week social campaign tailored to your business goals.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Campaign Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-[#C49A6C] outline-none">
            <option value="Life Insurance Awareness">Life Insurance Awareness</option>
            <option value="Mortgage Protection Awareness">Mortgage Protection</option>
            <option value="Tax-Free Retirement (IUL)">Tax-Free Retirement</option>
            <option value="Key Person for Schools">School District Outreach</option>
            <option value="Velocity Term Life (Ethos)">Quick Protection</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target Persona</label>
          <select value={persona} onChange={(e) => setPersona(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-[#C49A6C] outline-none">
            <option>Young Families</option>
            <option>Pre-Retirees</option>
            <option>School Administrators</option>
            <option>SME Owners</option>
          </select>
        </div>
      </div>
      <button onClick={generate} disabled={loading || !goal} className="w-full bg-[#C49A6C] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#b8893a] transition flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? 'Architecting 4-Week Flow...' : '🚀 Launch Auto-Pilot'}
      </button>
      {campaignPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Planned Sequence</span>
            {!scheduled ? (
              <button onClick={commitToCalendar} className="text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:underline">📅 Commit to Calendar</button>
            ) : (
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Sequence Scheduled</span>
            )}
          </div>
          <div className="space-y-3">
            {campaignPosts.map((post, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-4 items-start">
                <div className="w-9 h-9 bg-[#C49A6C]/20 rounded-xl flex items-center justify-center text-[10px] font-black text-[#C49A6C] flex-shrink-0">{post.sequenceDay}d</div>
                <div>
                  <p className="text-xs font-black text-white mb-1">{post.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic">"{post.draft}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketingToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>('Canva')

  return (
    <div className="p-6 md:p-8 space-y-6">
      <PageHeader eyebrow="Marketing" title="Marketing Tools" description="Canva creative specs, automation asset packs, and AI campaign auto-pilot." />
      <div className="flex gap-6">
        <div className="flex-1">
          {activeTool === 'Canva' && <CanvaSpecGenerator />}
          {activeTool === 'Automation' && <AutomationPackGenerator />}
          {activeTool === 'AutoPilot' && <CampaignAutoPilot />}
        </div>
        <div className="w-60 space-y-4 hidden lg:block flex-shrink-0">
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-[#C49A6C] tracking-widest mb-4">Tool Navigator</p>
            <div className="space-y-2">
              {(['Canva', 'Automation', 'AutoPilot'] as Tool[]).map((t) => (
                <button key={t} onClick={() => setActiveTool(t)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTool === t ? 'bg-[#C49A6C] text-slate-900' : 'hover:bg-white/10 text-slate-400'}`}>
                  {t === 'Canva' ? 'Canva Creative Specs' : t === 'Automation' ? 'Automation Packs' : '⚡ Auto-Pilot'}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Brand Lock</p>
            <ul className="text-[10px] text-slate-400 space-y-2 font-bold">
              <li>✓ No Gradients</li>
              <li>✓ Flat Design Lock</li>
              <li>✓ Local PA Dialect</li>
              <li>✓ Navy + Gold Only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
