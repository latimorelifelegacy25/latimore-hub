'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

const QUICK_PROMPTS = [
  { label: 'Follow Up Advice', prompt: 'How should I follow up with a lead in the "Discovery Complete" stage?' },
  { label: 'Explain IUL', prompt: 'Explain Indexed Universal Life insurance simply for a young family in Schuylkill County.' },
]

export default function LegacyChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Good day, Jackson. I am synchronized with the Latimore Life Hub. How can I assist your legacy mission today?' },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isOpen])

  const handleSend = async (customText?: string) => {
    const text = customText || input.trim()
    if (!text || isLoading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: text, platform: 'general', count: 1 }),
      })
      const data = await res.json()
      const reply = data.posts?.[0]?.draft || "I encountered an issue analyzing that request. Let's try again."
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: "Jackson, I hit a snag. Check your connection and try again." }])
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-[28rem] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl mb-4 flex flex-col overflow-hidden max-h-[80vh]">
          {/* Header */}
          <div className="bg-slate-950 p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C49A6C] rounded-2xl flex items-center justify-center text-white text-base">🛡</div>
              <div>
                <p className="font-black text-sm text-white">Legacy Co-Pilot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[280px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#C49A6C] text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3.5 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <div key={d} className="w-1.5 h-1.5 bg-[#C49A6C] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          {messages.length < 3 && !isLoading && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} onClick={() => handleSend(q.prompt)} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 hover:border-[#C49A6C] hover:text-[#C49A6C] transition">
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your assistant anything..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-5 pr-12 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-9 h-9 bg-[#C49A6C] text-white rounded-xl flex items-center justify-center hover:bg-[#b8893a] transition disabled:opacity-30"
              >
                →
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-500 mt-3 font-bold uppercase tracking-widest">Securing Pennsylvania&apos;s Legacy</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group relative ${isOpen ? 'bg-slate-800 border border-white/10 rotate-90' : 'bg-[#C49A6C] hover:scale-110'}`}
      >
        {!isOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-50" />}
        <span className="text-white text-xl">{isOpen ? '✕' : '🧠'}</span>
      </button>
    </div>
  )
}
