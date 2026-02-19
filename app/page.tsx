'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  }, [])

  return (
    <main className="bg-[#0B0F17] text-[#F7F7F5]">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 opacity-20 bg-[url('/hero_family_home.jpg')] bg-cover bg-center" />
        <div className="relative z-10 text-center max-w-4xl">
          <p className="text-[#C9A961] text-sm font-bold tracking-widest mb-4">INDEPENDENT PROTECTION ADVISOR</p>
          <h1 className="text-5xl md:text-7xl font-black mb-6">Protecting Today.<br /><span className="text-[#C9A961]">Securing</span> Tomorrow.</h1>
          <p className="text-xl text-[#A9B1BE] mb-8">Clear, education-first plans for families across Schuylkill, Luzerne & Northumberland Counties.</p>
          <a href="/consult" className="inline-block bg-[#C9A961] text-[#0B0F17] px-8 py-4 rounded-lg font-bold hover:bg-[#D4B76A] transition">Book Your Protection Blueprint →</a>
        </div>
      </section>

      <section ref={el => {if(el) sectionsRef.current[0] = el}} className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div><img src="/jackson-outdoor.jpg" alt="Jackson Latimore" className="rounded-lg shadow-2xl" /></div>
          <div>
            <p className="text-[#C9A961] text-sm font-bold tracking-widest mb-4">#THEBEATGOESON</p>
            <h2 className="text-4xl font-black mb-6">Why I Do This</h2>
            <p className="text-[#A9B1BE] text-lg mb-6">December 8, 2010. I was 22, playing basketball at East Stroudsburg University's Koehler Fieldhouse. My heart stopped.</p>
            <p className="text-[#A9B1BE] text-lg mb-6">An AED — funded by the Gregory W. Moyer Defibrillator Fund — saved my life that day. Rachel Moyer placed that machine there after losing her son Greg to sudden cardiac arrest. Her preparation gave me a second chance.</p>
            <p className="text-[#A9B1BE] text-lg mb-6">That's why I'm obsessive about protection. Life changes in seconds. The families I serve in Pennsylvania's coal region deserve the same preparation that saved me.</p>
            <p className="text-[#F7F7F5] text-xl font-bold">#TheBeatGoesOn</p>
          </div>
        </div>
      </section>

      <section ref={el => {if(el) sectionsRef.current[1] = el}} className="min-h-screen flex items-center px-6 py-20 bg-[#13171F]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">How I Serve You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0B0F17] p-8 rounded-lg border border-[#C9A961]/20">
              <h3 className="text-2xl font-bold mb-4 text-[#C9A961]">Life Insurance</h3>
              <p className="text-[#A9B1BE]">Term, whole, and universal life policies designed for Pennsylvania families.</p>
            </div>
            <div className="bg-[#0B0F17] p-8 rounded-lg border border-[#C9A961]/20">
              <h3 className="text-2xl font-bold mb-4 text-[#C9A961]">Annuities</h3>
              <p className="text-[#A9B1BE]">Retirement income strategies that protect what you've built.</p>
            </div>
            <div className="bg-[#0B0F17] p-8 rounded-lg border border-[#C9A961]/20">
              <h3 className="text-2xl font-bold mb-4 text-[#C9A961]">Key Person Insurance</h3>
              <p className="text-[#A9B1BE]">Business continuation plans for local employers.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={el => {if(el) sectionsRef.current[2] = el}} className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Get Your Quote</h2>
          <p className="text-[#A9B1BE] text-lg mb-8">See what protection costs. No pressure.</p>
          <a href="https://rapid-rater.live.web.corebridgefinancial.com/Simplinowquoter" target="_blank" rel="noopener" className="inline-block bg-[#C9A961] text-[#0B0F17] px-8 py-4 rounded-lg font-bold hover:bg-[#D4B76A] transition">Get Quote →</a>
        </div>
      </section>

      <section ref={el => {if(el) sectionsRef.current[3] = el}} className="min-h-screen flex items-center px-6 py-20 bg-[#13171F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">Ready to Protect What Matters?</h2>
          <p className="text-[#A9B1BE] text-xl mb-8">No hard sell. Just honest conversation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/consult" className="bg-[#C9A961] text-[#0B0F17] px-8 py-4 rounded-lg font-bold hover:bg-[#D4B76A] transition">Start Conversation →</a>
            <a href="/book" className="border-2 border-[#C9A961] text-[#C9A961] px-8 py-4 rounded-lg font-bold hover:bg-[#C9A961] hover:text-[#0B0F17] transition">Book a Call →</a>
          </div>
          <p className="text-[#A9B1BE] mt-8">Call/Text: (856) 895-1457</p>
        </div>
      </section>
    </main>
  )
}
