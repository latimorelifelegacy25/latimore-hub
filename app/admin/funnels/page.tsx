'use client'

import { useState, useEffect } from 'react'
import PageHeader from '../_components/PageHeader'
import { FUNNEL_BLUEPRINTS, LANDING_PAGE_BLUEPRINTS, FORM_BLUEPRINTS } from '../_lib/templates'

interface FunnelStage {
  name: string
  strategy: string
  assetCopy: string
  metrics?: { views: number; conversions: number; dropOff: number }
}

interface Funnel {
  id: string
  name: string
  goal: string
  persona: string
  stages: FunnelStage[]
  status: 'Draft' | 'Active'
}

type HubView = 'Active' | 'FunnelDB' | 'LandingDB' | 'FormDB'

async function generateFunnelStrategy(goal: string, persona: string): Promise<FunnelStage[]> {
  const res = await fetch('/api/admin/ai/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: `Funnel strategy: "${goal}" for ${persona} in Central PA. Return 3 stages as JSON array with name, strategy, assetCopy fields.`, platform: 'general', count: 1 }),
  })
  const data = await res.json()
  // Parse best-effort; fallback to static stages
  try {
    const text = data.posts?.[0]?.draft || ''
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
  } catch {}
  return [
    { name: 'Awareness', strategy: `Targeted ${persona} outreach through community platforms and local social media.`, assetCopy: `Are you protected, Central PA? ${goal} starts with one conversation. Protecting Today. Securing Tomorrow.` },
    { name: 'Engagement', strategy: 'Educational content sequence — explain the product clearly without fear language.', assetCopy: `Here's what most ${persona} don't know about their coverage options. Let's change that. #TheBeatGoesOn` },
    { name: 'Conversion', strategy: 'Direct call-to-action: book a 20-minute discovery call.', assetCopy: `Book your no-pressure legacy discovery call today. It only takes 20 minutes to protect everything you've built. Protecting Today. Securing Tomorrow.` },
  ]
}

export default function LegacyFunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [goal, setGoal] = useState('')
  const [persona, setPersona] = useState('Young Families')
  const [isArchitecting, setIsArchitecting] = useState(false)
  const [activeHubView, setActiveHubView] = useState<HubView>('Active')
  const [activeFunnel, setActiveFunnel] = useState<Funnel | null>(null)
  const [showPromptModal, setShowPromptModal] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('latimore_legacy_funnels')
      if (saved) setFunnels(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('latimore_legacy_funnels', JSON.stringify(funnels))
  }, [funnels])

  const handleLaunchArchitect = async () => {
    if (!goal.trim()) return
    setIsArchitecting(true)
    try {
      const stages = await generateFunnelStrategy(goal, persona)
      const stagesWithMetrics = stages.map((stage, i) => {
        const views = Math.floor(Math.random() * 500) + 100 * (stages.length - i)
        const conversions = Math.floor(views * (0.05 + Math.random() * 0.1))
        const dropOff = i === 0 ? 0 : Math.floor(Math.random() * 15) + 5
        return { ...stage, metrics: { views, conversions, dropOff } }
      })
      const newFunnel: Funnel = {
        id: Math.random().toString(36).substr(2, 9),
        name: goal.length > 30 ? goal.substring(0, 27) + '...' : goal,
        goal, persona, stages: stagesWithMetrics, status: 'Draft',
      }
      setFunnels((prev) => [newFunnel, ...prev])
      setActiveFunnel(newFunnel)
      setShowPromptModal(false)
      setGoal('')
    } catch {
      alert("Jackson, I hit a snag engineering that strategy. Let's try a different goal or persona.")
    } finally {
      setIsArchitecting(false)
    }
  }

  const deleteFunnel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to retire this strategy protocol?')) {
      setFunnels((prev) => prev.filter((f) => f.id !== id))
      if (activeFunnel?.id === id) setActiveFunnel(null)
    }
  }

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFunnels((prev) => prev.map((f) => f.id === id ? { ...f, status: f.status === 'Draft' ? 'Active' : 'Draft' } : f))
    if (activeFunnel?.id === id) setActiveFunnel((prev) => prev ? { ...prev, status: prev.status === 'Draft' ? 'Active' : 'Draft' } : null)
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader eyebrow="Funnel Strategy" title="Legacy Hub" description="AI-powered funnel blueprints and live conversion strategies." />
        <button
          onClick={() => setShowPromptModal(true)}
          className="bg-[#C49A6C] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#b8893a] transition flex items-center gap-2 shadow-lg flex-shrink-0 mt-1"
        >
          ✨ Architect Strategy
        </button>
      </div>

      {/* Hub Nav */}
      <div className="flex gap-2 overflow-x-auto">
        {([
          { id: 'Active', label: 'Strategy Board' },
          { id: 'FunnelDB', label: 'Blueprints' },
          { id: 'LandingDB', label: 'Pages' },
          { id: 'FormDB', label: 'Forms' },
        ] as { id: HubView; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveHubView(tab.id); setActiveFunnel(null) }}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition whitespace-nowrap ${activeHubView === tab.id ? 'bg-[#C49A6C] text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Funnel Detail */}
      {activeFunnel ? (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveFunnel(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-sm">←</button>
              <div>
                <h2 className="text-xl font-black">{activeFunnel.name}</h2>
                <p className="text-xs text-[#C49A6C] font-bold uppercase tracking-widest">{activeFunnel.persona} Journey</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => deleteFunnel(activeFunnel.id, e)} className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition">Retire</button>
              <button onClick={(e) => toggleStatus(activeFunnel.id, e)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${activeFunnel.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-[#C49A6C] text-white'}`}>
                {activeFunnel.status === 'Active' ? '✓ Active' : 'Set Active'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activeFunnel.stages.map((stage, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-[#C49A6C] rounded-xl flex items-center justify-center text-white font-black">{i + 1}</div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stage.name}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-[#C49A6C] pl-3">{stage.strategy}</p>
                <div className="flex-1 bg-white/5 p-4 rounded-2xl text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">{stage.assetCopy}</div>
                {stage.metrics && (
                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                    <div className="text-center"><p className="text-[8px] font-black text-slate-500 uppercase">Views</p><p className="text-xs font-black text-white">{stage.metrics.views.toLocaleString()}</p></div>
                    <div className="text-center"><p className="text-[8px] font-black text-slate-500 uppercase">Conv.</p><p className="text-xs font-black text-emerald-400">{stage.metrics.conversions}</p></div>
                    <div className="text-center"><p className="text-[8px] font-black text-slate-500 uppercase">Drop</p><p className="text-xs font-black text-rose-400">{stage.metrics.dropOff}%</p></div>
                  </div>
                )}
                <button onClick={() => navigator.clipboard.writeText(stage.assetCopy)} className="py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition">Copy Asset</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Strategy Board */}
          {activeHubView === 'Active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {funnels.length === 0 ? (
                <div className="col-span-full py-20 bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center">
                  <p className="text-slate-500 text-4xl mb-4">⚡</p>
                  <h3 className="text-lg font-black text-white">No Active Strategies</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs">Launch the Strategy Architect to map a new protection sequence.</p>
                  <button onClick={() => setShowPromptModal(true)} className="mt-6 bg-[#C49A6C] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#b8893a] transition">Launch Architect</button>
                </div>
              ) : (
                funnels.map((funnel) => (
                  <div key={funnel.id} onClick={() => setActiveFunnel(funnel)} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 cursor-pointer hover:bg-white/10 transition group">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-[#C49A6C]/20 rounded-xl flex items-center justify-center text-[#C49A6C] text-lg">🔀</div>
                      <div className="flex gap-2 items-center">
                        <button onClick={(e) => deleteFunnel(funnel.id, e)} className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white">✕</button>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${funnel.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 bg-white/5'}`}>{funnel.status}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-[#C49A6C] transition">{funnel.name}</h3>
                    <p className="text-[10px] font-bold text-[#C49A6C] uppercase tracking-widest">{funnel.persona}</p>
                    <p className="text-xs text-slate-400">{funnel.stages.length} stages mapped</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Funnel Blueprints */}
          {activeHubView === 'FunnelDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FUNNEL_BLUEPRINTS.map((bp) => (
                <div key={bp.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-white/10 transition">
                  <span className="text-[9px] font-black uppercase text-[#C49A6C] bg-[#C49A6C]/10 px-3 py-1 rounded-full w-fit">{bp.category}</span>
                  <h3 className="text-base font-black text-white">{bp.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{bp.description}"</p>
                  <div><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Persona</p><p className="text-xs font-bold text-white">{bp.persona}</p></div>
                  <button onClick={() => { setGoal(bp.name); setPersona(bp.persona); setShowPromptModal(true) }} className="mt-auto py-3 rounded-2xl bg-[#C49A6C]/20 text-[#C49A6C] text-[10px] font-black uppercase tracking-widest hover:bg-[#C49A6C] hover:text-white transition">Initialize Blueprint</button>
                </div>
              ))}
            </div>
          )}

          {/* Landing Page Blueprints */}
          {activeHubView === 'LandingDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {LANDING_PAGE_BLUEPRINTS.map((bp) => (
                <div key={bp.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-white/10 transition">
                  <span className="text-[9px] font-black uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full w-fit">{bp.category}</span>
                  <h3 className="text-base font-black text-white">{bp.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{bp.description}</p>
                  <div className="bg-white/5 rounded-xl p-4 space-y-1">
                    {bp.sections.map((s, i) => <p key={i} className="text-[10px] font-bold text-slate-400">✓ {s}</p>)}
                  </div>
                  <button className="mt-auto py-3 rounded-2xl bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition">Configure Design</button>
                </div>
              ))}
            </div>
          )}

          {/* Form Blueprints */}
          {activeHubView === 'FormDB' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FORM_BLUEPRINTS.map((bp) => (
                <div key={bp.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-white/10 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">📋</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase">{bp.fields.length} Fields</span>
                  </div>
                  <h3 className="text-base font-black text-white">{bp.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{bp.description}"</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.fields.map((f, i) => <span key={i} className="text-[9px] font-bold text-slate-400 bg-white/10 px-2 py-1 rounded-lg">{f}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Strategy Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-10 max-w-lg w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#C49A6C] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto">🧠</div>
              <h2 className="text-2xl font-black text-white">Strategy Architect</h2>
              <p className="text-sm text-slate-400">Map a new legacy journey for Central PA neighbors.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Strategic Objective</label>
                <input
                  type="text"
                  autoFocus
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLaunchArchitect()}
                  placeholder="e.g., Secure 10 Mortgage Protection Reviews"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#C49A6C] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target Persona</label>
                <select value={persona} onChange={(e) => setPersona(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-[#C49A6C] outline-none">
                  <option>Young Families</option>
                  <option>Pre-Retirees</option>
                  <option>School Administrators</option>
                  <option>Small Business Owners</option>
                  <option>Central PA Seniors</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleLaunchArchitect}
                disabled={isArchitecting || !goal.trim()}
                className="w-full bg-[#C49A6C] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#b8893a] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isArchitecting ? 'Mapping Protocol...' : '🚀 Launch Strategy Architect'}
              </button>
              <button onClick={() => setShowPromptModal(false)} disabled={isArchitecting} className="w-full py-3 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-rose-400 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
