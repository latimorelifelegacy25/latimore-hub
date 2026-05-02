'use client'

import { useState } from 'react'
import PageHeader from '../_components/PageHeader'
import { LIBRARY_TEMPLATES } from '../_lib/templates'

const CATEGORIES = ['All', 'Life Insurance', 'Annuities', 'Legacy & Estate', 'Business Protection'] as const

export default function StrategyLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = LIBRARY_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (template: (typeof LIBRARY_TEMPLATES)[0]) => {
    const url = `/admin/content/creator?topic=${encodeURIComponent(template.title)}&structure=${encodeURIComponent(template.structure)}`
    window.open(url, '_self')
  }

  const handleCopy = async (template: (typeof LIBRARY_TEMPLATES)[0]) => {
    await navigator.clipboard.writeText(`${template.title}\n\n${template.structure}\n\n${template.hashtags.join(' ')}`)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <PageHeader
        eyebrow="Content Strategy"
        title="Strategy Library"
        description={`${LIBRARY_TEMPLATES.length} proven messaging frameworks for Life Insurance & Annuity positioning.`}
      />

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by product, benefit, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#C49A6C] outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-[#C49A6C] text-white' : 'bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:bg-white/10 transition group">
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase text-[#C49A6C] bg-[#C49A6C]/10 px-3 py-1.5 rounded-full">{t.subCategory}</span>
                <span className="text-slate-500 group-hover:text-[#C49A6C] transition text-lg">
                  {t.category === 'Life Insurance' ? '🛡' : t.category === 'Annuities' ? '📈' : '🏦'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white group-hover:text-[#C49A6C] transition leading-tight">{t.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{t.description}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Logic Structure</p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{t.structure}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.hashtags.map((tag) => (
                  <span key={tag} className="text-[9px] font-bold text-slate-500">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex border-t border-white/10">
              <button
                onClick={() => handleCopy(t)}
                className="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition hover:bg-white/5"
              >
                {copiedId === t.id ? '✓ Copied' : 'Copy'}
              </button>
              <div className="w-px bg-white/10" />
              <button
                onClick={() => handleUseTemplate(t)}
                className="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#C49A6C] hover:bg-[#C49A6C]/10 transition"
              >
                Use Template →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center gap-4">
          <div className="text-5xl">📭</div>
          <h3 className="text-lg font-black text-white">No results found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}
