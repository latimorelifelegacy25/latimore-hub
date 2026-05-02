'use client'

import { useState, useRef } from 'react'
import PageHeader from '../_components/PageHeader'

interface CarrierAsset {
  id: string
  name: string
  carrier: string
  type: string
  uploadDate: string
  fileData?: string
  mimeType?: string
}

interface ContentIdea {
  title: string
  draft: string
  platform: string
}

const MOCK_ASSETS: CarrierAsset[] = [
  { id: '1', name: 'Builder Plus 4 IUL Brochure', carrier: 'North American', type: 'IUL', uploadDate: '2024-05-12' },
  { id: '2', name: 'Safe Income Advantage Rider', carrier: 'F&G', type: 'Annuity', uploadDate: '2024-05-10' },
  { id: '3', name: 'Ethos Term Life Spec Sheet', carrier: 'Ethos', type: 'Term', uploadDate: '2024-05-15' },
]

async function generateContentFromAsset(fileData: string, mimeType: string, platform: string): Promise<ContentIdea[]> {
  try {
    const res = await fetch('/api/admin/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: `Educational content from carrier asset for ${platform}`, platform: platform.toLowerCase(), count: 3, fileData, mimeType }),
    })
    const data = await res.json()
    return (data.posts || []).map((p: any) => ({ title: p.title, draft: p.draft, platform }))
  } catch { return [] }
}

export default function AssetVaultPage() {
  const [assets, setAssets] = useState<CarrierAsset[]>(MOCK_ASSETS)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null)
  const [platform, setPlatform] = useState('LinkedIn')
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Data = event.target?.result?.toString().split(',')[1]
      const newAsset: CarrierAsset = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        carrier: 'Manual Upload',
        type: file.type.includes('pdf') ? 'PDF Document' : 'Product Image',
        uploadDate: new Date().toISOString().split('T')[0],
        fileData: base64Data,
        mimeType: file.type,
      }
      setAssets((prev) => [newAsset, ...prev])
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async (asset: CarrierAsset) => {
    if (!asset.fileData || !asset.mimeType) {
      alert('This mock asset has no file data. Upload a fresh file to test AI analysis.')
      return
    }
    setIsAnalyzing(asset.id)
    const ideas = await generateContentFromAsset(asset.fileData, asset.mimeType, platform)
    setIsAnalyzing(null)
    if (ideas.length > 0) setGeneratedIdeas(ideas)
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <PageHeader
        eyebrow="Media Library"
        title="Asset Vault"
        description="Upload carrier products and brochures — AI extracts educational post ideas instantly."
      />

      <div className="flex justify-end">
        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#C49A6C] hover:bg-[#b8893a] text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : '↑ Upload Carrier Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:bg-white/10 transition">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#C49A6C] text-xl">
                  {asset.type.includes('PDF') ? '📄' : '🖼️'}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest block">Uploaded</span>
                  <span className="text-xs font-bold text-white">{asset.uploadDate}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-tight">{asset.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-slate-400 px-3 py-1 rounded-full">{asset.carrier}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#C49A6C]/20 text-[#C49A6C] px-3 py-1 rounded-full">{asset.type}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex gap-3">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:ring-2 focus:ring-[#C49A6C]"
              >
                <option>LinkedIn</option>
                <option>Facebook</option>
                <option>Instagram</option>
              </select>
              <button
                onClick={() => handleAnalyze(asset)}
                disabled={!!isAnalyzing}
                className="flex-1 py-2 bg-[#C49A6C] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#b8893a] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing === asset.id ? 'Analyzing...' : '✨ Generate Posts'}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:border-[#C49A6C] transition-all"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/40 text-2xl">+</div>
          <p className="text-sm font-bold text-white uppercase tracking-widest">Add New Knowledge</p>
          <p className="text-[11px] text-slate-400 italic">Upload a brochure to train the AI on new carrier benefits.</p>
        </button>
      </div>

      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white">Generated Content Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedIdeas.map((idea, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C49A6C]">{idea.platform}</span>
                <p className="text-sm font-bold text-white">{idea.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">{idea.draft}</p>
                <a
                  href={`/admin/content/creator?topic=${encodeURIComponent(idea.title)}`}
                  className="block text-center py-2 bg-[#C49A6C]/20 text-[#C49A6C] rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#C49A6C]/30 transition"
                >
                  Open in Creator →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
