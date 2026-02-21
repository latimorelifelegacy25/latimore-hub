'use client'

import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ChevronDown, Phone, Mail, Calendar, Shield,
  CheckCircle2, Menu, X, ArrowRight, TrendingUp
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Navigation ────────────────────────────────────────────────────
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-[#0B0F17]/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#F7F7F5] font-black text-lg tracking-[0.15em]">{BRAND.name}</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['services','Services'],['process','Process'],['about','About'],['contact','Contact']].map(([id, label]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="text-[#A9B1BE] hover:text-[#F7F7F5] text-sm font-medium transition-colors">
                {label}
              </button>
            ))}
            <Link href="/retirement" className="text-[#A9B1BE] hover:text-[#F7F7F5] text-sm font-medium transition-colors">Retirement</Link>
            <Link href="/consult" className="text-[#A9B1BE] hover:text-[#F7F7F5] text-sm font-medium transition-colors">Consult</Link>
            <a href={BRAND.bookingUrl} className="cta-gold text-xs px-5 py-2.5">
              Secure Your Legacy
            </a>
          </div>
          <button className="md:hidden text-[#F7F7F5]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-[#0B0F17]/98 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {[['services','Services'],['process','Process'],['about','About'],['contact','Contact']].map(([id, label]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="text-[#F7F7F5] text-2xl font-semibold">{label}</button>
            ))}
            <Link href="/retirement" onClick={() => setMobileMenuOpen(false)} className="text-[#F7F7F5] text-2xl font-semibold">Retirement</Link>
            <Link href="/consult" onClick={() => setMobileMenuOpen(false)} className="text-[#F7F7F5] text-2xl font-semibold">Request Consult</Link>
            <a href={BRAND.bookingUrl} className="cta-gold mt-4">Secure Your Legacy</a>
          </div>
        </div>
      )}
    </>
  )
}

// ── Hero Section ──────────────────────────────────────────────────
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-bg', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
      gsap.fromTo('.hero-label', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' })
      gsap.fromTo('.hero-headline span', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.08, delay: 0.4, ease: 'power3.out' })
      gsap.fromTo('.hero-subheadline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: 'power2.out' })
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 1, ease: 'power2.out' })

      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 }
      })
      scrollTl
        .fromTo('.hero-headline', { x: 0, opacity: 1 }, { x: '40vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo('.hero-bg', { scale: 1, opacity: 1 }, { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .fromTo('.hero-cta', { y: 0, opacity: 1 }, { y: '12vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-pinned z-10" id="hero">
      <div className="hero-bg absolute inset-0">
        <img src="/jackson-outdoor.jpg" alt="Jackson Latimore" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/80 via-[#0B0F17]/50 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="max-w-4xl">
          <p className="hero-label micro-label text-[#C9A25F] mb-6">Independent Protection Advisor</p>
          <h1 className="hero-headline heading-display text-[clamp(2.5rem,8vw,5.5rem)] text-[#F7F7F5] mb-8">
            <span className="block">Protecting</span>
            <span className="block">Today.</span>
            <span className="block text-[#C9A25F]">Securing</span>
            <span className="block">Tomorrow.</span>
          </h1>
          <p className="hero-subheadline text-[#A9B1BE] text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
            Clear, education-first plans for families across Schuylkill, Luzerne & Northumberland Counties.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <a href={BRAND.bookingUrl} className="cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <Link href="/retirement" className="px-8 py-4 border border-[#F7F7F5]/20 text-[#F7F7F5] rounded-full font-bold text-sm hover:bg-[#F7F7F5]/5 transition-all flex items-center justify-center">
              <TrendingUp className="mr-2 w-4 h-4" /> Retirement Planning
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 right-6 lg:right-[6vw] text-[#A9B1BE] text-xs flex items-center gap-2">
        <span>Scroll to begin</span><ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}

// ── What If Section ───────────────────────────────────────────────
function WhatIfSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      tl.fromTo('.whatif-headline span', { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0)
        .fromTo('.whatif-caption', { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo('.whatif-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo('.whatif-cta', { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18)
        .to('.whatif-headline', { x: '-35vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.whatif-caption', { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.whatif-bg', { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .to('.whatif-cta', { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="section-pinned z-20" id="whatif">
      <div className="whatif-bg absolute inset-0">
        <img src="/jackson-coaching.jpg" alt="Jackson coaching youth baseball" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="whatif-headline heading-display text-[clamp(2.5rem,7vw,5rem)] text-[#F7F7F5]">
              <span className="block">What If</span>
              <span className="block">Something</span>
              <span className="block text-[#C9A25F]">Happens?</span>
            </h2>
          </div>
          <div className="whatif-caption">
            <p className="text-[#A9B1BE] text-lg lg:text-xl leading-relaxed mb-8">
              Most families are one event away from financial strain. We map the risks—then build a plan that keeps life on track.
            </p>
            <a href={BRAND.bookingUrl} className="whatif-cta cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Blueprint Section ─────────────────────────────────────────────
function BlueprintSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      tl.fromTo('.blueprint-headline span', { x: '60vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0)
        .fromTo('.blueprint-caption', { x: '-18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo('.blueprint-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo('.blueprint-cta', { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18)
        .to('.blueprint-headline', { x: '35vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.blueprint-caption', { x: '-10vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.blueprint-bg', { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .to('.blueprint-cta', { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="section-pinned z-30" id="blueprint">
      <div className="blueprint-bg absolute inset-0">
        <img src="/jackson-hero.png" alt="Latimore Life & Legacy" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="blueprint-caption order-2 lg:order-1">
            <p className="text-[#A9B1BE] text-lg lg:text-xl leading-relaxed mb-8">
              We'll map what needs protecting—mortgage, income, retirement, legacy—then shop the market for the right fit. No pressure. No jargon.
            </p>
            <a href={BRAND.bookingUrl} className="blueprint-cta cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
          <div className="order-1 lg:order-2 text-right">
            <h2 className="blueprint-headline heading-display text-[clamp(2.5rem,7vw,5rem)] text-[#F7F7F5]">
              <span className="block">Build A</span>
              <span className="block">Protection</span>
              <span className="block text-[#C9A25F]">Blueprint.</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Process Section ───────────────────────────────────────────────
function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-heading', { y: 40, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: s, start: 'top 80%', end: 'top 50%', scrub: 0.5 } })
      gsap.fromTo('.process-card', { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, scrollTrigger: { trigger: '.process-grid', start: 'top 80%', end: 'top 40%', scrub: 0.5 } })
    }, s)
    return () => ctx.revert()
  }, [])
  const steps = [
    { num: '01', title: 'Discovery Call', desc: '15–20 minutes to understand your priorities.' },
    { num: '02', title: 'The Blueprint', desc: 'A clear plan showing what to protect and why.' },
    { num: '03', title: 'Compare Options', desc: 'We shop carriers to match coverage and budget.' },
    { num: '04', title: 'Implement & Review', desc: 'Apply, confirm beneficiaries, and schedule annual reviews.' },
  ]
  return (
    <section ref={ref} className="relative z-40 bg-[#F4F1EA] py-24 lg:py-32" id="process">
      <div className="px-6 lg:px-[6vw]">
        <h2 className="process-heading heading-display text-[clamp(2rem,5vw,4rem)] text-[#0B0F17] mb-16">How It Works</h2>
        <div className="process-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="process-card bg-white p-8 rounded-2xl shadow-sm border border-[#0B0F17]/5">
              <span className="text-[#C9A25F] text-sm font-black tracking-widest mb-4 block">{step.num}</span>
              <h3 className="text-[#0B0F17] font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-[#0B0F17]/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Coverage Section ──────────────────────────────────────────────
function CoverageSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      tl.fromTo('.coverage-headline span', { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0)
        .fromTo('.coverage-caption', { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo('.coverage-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo('.coverage-cta', { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18)
        .to('.coverage-headline', { x: '-35vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.coverage-caption', { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.coverage-bg', { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .to('.coverage-cta', { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="section-pinned z-50" id="coverage">
      <div className="coverage-bg absolute inset-0">
        <img src="/jackson-outdoor.jpg" alt="Jackson Latimore" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="coverage-headline heading-display text-[clamp(2rem,6vw,4.5rem)] text-[#F7F7F5]">
              <span className="block">Schuylkill</span>
              <span className="block">Luzerne</span>
              <span className="block text-[#C9A25F]">Northumberland</span>
            </h2>
          </div>
          <div className="coverage-caption">
            <p className="text-[#A9B1BE] text-lg lg:text-xl leading-relaxed mb-8">
              Independent guidance for families and business owners across Pennsylvania's coal region and Wyoming Valley.
            </p>
            <a href={BRAND.bookingUrl} className="coverage-cta cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Services Section ──────────────────────────────────────────────
function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      tl.fromTo('.services-headline span', { x: '60vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0)
        .fromTo('.services-caption', { x: '-18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo('.services-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo('.services-cta', { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18)
        .to('.services-headline', { x: '35vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.services-caption', { x: '-10vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.services-bg', { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .to('.services-cta', { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="section-pinned z-[60]" id="services">
      <div className="services-bg absolute inset-0">
        <img src="/jackson-headshot.png" alt="Jackson Latimore" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="services-caption order-2 lg:order-1">
            <p className="text-[#A9B1BE] text-lg lg:text-xl leading-relaxed mb-8">
              Term, IUL, final expense, mortgage protection, key-person coverage, and tax-smart retirement income—designed around your life, not a sales quota.
            </p>
            <a href={BRAND.bookingUrl} className="services-cta cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
          <div className="order-1 lg:order-2 text-right">
            <h2 className="services-headline heading-display text-[clamp(2rem,6vw,4.5rem)] text-[#F7F7F5]">
              <span className="block">Life</span>
              <span className="block">Income</span>
              <span className="block">Retirement</span>
              <span className="block text-[#C9A25F]">Business</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Independence Section ──────────────────────────────────────────
function IndependenceSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      tl.fromTo('.independence-headline span', { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0)
        .fromTo('.independence-caption', { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo('.independence-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo('.independence-cta', { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18)
        .to('.independence-headline', { x: '-35vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.independence-caption', { x: '10vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .to('.independence-bg', { scale: 1.06, opacity: 0.3, ease: 'power2.in' }, 0.7)
        .to('.independence-cta', { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75)
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="section-pinned z-[70]" id="about">
      <div className="independence-bg absolute inset-0">
        <img src="/jackson-coaching.jpg" alt="Jackson Latimore coaching" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/90 via-[#0B0F17]/60 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="independence-headline heading-display text-[clamp(2.5rem,7vw,5rem)] text-[#F7F7F5]">
              <span className="block">Shop</span>
              <span className="block">The</span>
              <span className="block text-[#C9A25F]">Market.</span>
            </h2>
          </div>
          <div className="independence-caption">
            <p className="text-[#A9B1BE] text-lg lg:text-xl leading-relaxed mb-8">
              No single carrier agenda. We compare options, explain tradeoffs in plain English, and let you choose what fits.
            </p>
            <a href={BRAND.bookingUrl} className="independence-cta cta-gold">
              Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Social Proof Section ──────────────────────────────────────────
function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.social-heading', { y: 40, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: s, start: 'top 80%', end: 'top 50%', scrub: 0.5 } })
      gsap.fromTo('.testimonial-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', end: 'top 40%', scrub: 0.5 } })
      gsap.fromTo('.badge-item', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.08, scrollTrigger: { trigger: '.badges-row', start: 'top 85%', end: 'top 60%', scrub: 0.5 } })
    }, s)
    return () => ctx.revert()
  }, [])
  const testimonials = [
    { quote: 'Jackson explained everything without pressure. We finally feel protected.', author: 'A family in Luzerne County' },
    { quote: 'He shopped multiple carriers and found us better coverage for less.', author: 'Small business owner, Schuylkill County' },
    { quote: 'The Blueprint made it easy to understand what we actually needed.', author: 'Retiree, Northumberland County' },
  ]
  const badges = [
    { icon: <Shield className="w-5 h-5" />, text: 'Independent Advisor' },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Multi-Carrier Options' },
    { icon: <Calendar className="w-5 h-5" />, text: 'Annual Reviews Included' },
  ]
  return (
    <section ref={ref} className="relative z-[80] bg-[#0B0F17] py-24 lg:py-32" id="testimonials">
      <div className="px-6 lg:px-[6vw]">
        <h2 className="social-heading heading-display text-[clamp(1.5rem,4vw,3rem)] text-[#F7F7F5] text-center mb-16">
          Trusted By Families Across The Region
        </h2>
        <div className="testimonials-grid grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card bg-[#1a2535] p-8 rounded-2xl border border-[#F7F7F5]/5">
              <p className="text-[#F7F7F5] text-lg leading-relaxed mb-6 italic">"{t.quote}"</p>
              <p className="text-[#A9B1BE] text-sm">— {t.author}</p>
            </div>
          ))}
        </div>
        <div className="badges-row flex flex-wrap justify-center gap-4">
          {badges.map((b, i) => (
            <div key={i} className="badge-item flex items-center gap-2 px-6 py-3 bg-[#1a2535] rounded-full border border-[#C9A25F]/30">
              <span className="text-[#C9A25F]">{b.icon}</span>
              <span className="text-[#F7F7F5] text-sm font-medium">{b.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center border-t border-[#F7F7F5]/10 pt-16">
          <div>
            <img src="/jackson-outdoor.jpg" alt="Jackson Latimore" className="w-full max-w-sm mx-auto rounded-2xl object-cover object-top aspect-square" />
          </div>
          <div>
            <p className="micro-label text-[#C9A25F] mb-4">Why I Do This</p>
            <h3 className="heading-display text-[clamp(1.5rem,3vw,2.5rem)] text-[#F7F7F5] mb-6">I Needed This Plan Too.</h3>
            <p className="text-[#A9B1BE] text-lg leading-relaxed mb-6">
              In December 2010, a defibrillator saved my life on the basketball court at East Stroudsburg University.
              I was 22. I had no plan, no policy, nothing protecting the people I loved.
            </p>
            <p className="text-[#A9B1BE] text-lg leading-relaxed mb-8">
              That moment is why I built Latimore Life &amp; Legacy — to make sure no family in our region gets caught without a plan when it matters most. <span className="text-[#C9A25F] font-semibold">#TheBeatGoesOn</span>
            </p>
            <div className="flex items-center gap-3 bg-[#131b2a] rounded-xl p-4 border border-[#C9A25F]/20">
              <img src="/news-headline.jpg" alt="Pocono Record news" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
              <p className="text-[#A9B1BE] text-sm italic">"Defibrillator saves basketball player at ESU" — Pocono Record, Dec. 8, 2010</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Contact Section ───────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const s = ref.current; if (!s) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-headline', { y: 50, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: s, start: 'top 80%', end: 'top 50%', scrub: 0.5 } })
      gsap.fromTo('.contact-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: s, start: 'top 75%', end: 'top 45%', scrub: 0.5 } })
    }, s)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="relative z-[90] min-h-screen" id="contact">
      <div className="absolute inset-0">
        <img src="/jackson-outdoor.jpg" alt="Jackson Latimore" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-[#0B0F17]/80" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 lg:px-[6vw] py-24">
        <h2 className="contact-headline heading-display text-[clamp(2.5rem,8vw,6rem)] text-[#F7F7F5] text-center mb-6">
          Ready When You Are.
        </h2>
        <p className="contact-sub text-[#A9B1BE] text-lg lg:text-xl text-center max-w-2xl mb-12">
          Book a 15–20 minute call. We'll map your priorities and next steps—no pressure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href={BRAND.bookingUrl} className="cta-gold">
            Secure Your Legacy <ArrowRight className="ml-2 w-4 h-4" />
          </a>
          <Link href="/consult" className="px-8 py-4 border border-[#F7F7F5]/30 text-[#F7F7F5] hover:bg-[#F7F7F5]/10 rounded-full font-bold text-sm flex items-center justify-center transition-all">
            Request a Consultation
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 text-center">
          <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-[#A9B1BE] hover:text-[#C9A25F] transition-colors">
            <Mail className="w-4 h-4" /><span className="text-sm">{BRAND.email}</span>
          </a>
          <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-[#A9B1BE] hover:text-[#C9A25F] transition-colors">
            <Phone className="w-4 h-4" /><span className="text-sm">{BRAND.phone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-[100] bg-[#0B0F17] border-t border-[#F7F7F5]/5 py-12">
      <div className="px-6 lg:px-[6vw]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <p className="text-[#F7F7F5] font-black text-lg tracking-[0.15em]">{BRAND.name}</p>
            <p className="text-[#A9B1BE] text-sm mt-1">{BRAND.fullName}</p>
            <p className="text-[#A9B1BE]/60 text-xs mt-2">{BRAND.hashtag}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-[#F7F7F5] font-semibold mb-3">Services</p>
              {[['velocity','Velocity'],['depth','Depth'],['group','Group & Workshops'],['retirement','Retirement']].map(([href, label]) => (
                <Link key={href} href={`/${href}`} className="block text-[#A9B1BE] hover:text-[#C9A25F] transition-colors mb-2">{label}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#F7F7F5] font-semibold mb-3">Company</p>
              {[['consult','Request Consult'],['book','Secure Your Legacy'],['legal/privacy','Privacy'],['legal/terms','Terms'],['legal/disclosures','Disclosures']].map(([href, label]) => (
                <Link key={href} href={`/${href}`} className="block text-[#A9B1BE] hover:text-[#C9A25F] transition-colors mb-2">{label}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${BRAND.phone}`} className="text-[#A9B1BE] hover:text-[#C9A25F] transition-colors"><Phone className="w-5 h-5" /></a>
            <a href={`mailto:${BRAND.email}`} className="text-[#A9B1BE] hover:text-[#C9A25F] transition-colors"><Mail className="w-5 h-5" /></a>
            <a href={BRAND.bookingUrl} className="text-[#A9B1BE] hover:text-[#C9A25F] transition-colors"><Calendar className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="border-t border-[#F7F7F5]/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[#A9B1BE]/40 text-xs">© {new Date().getFullYear()} {BRAND.fullName} LLC. PA License #{BRAND.paLicense}. All rights reserved.</p>
          <p className="text-[#A9B1BE]/40 text-xs text-center md:text-right max-w-lg">
            Insurance products and features vary by carrier and state. Benefits are not guaranteed and may require additional premium. No rate/return promises. Serving Schuylkill, Luzerne, and Northumberland Counties, PA.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── Home Page ─────────────────────────────────────────────────────
export default function HomePage() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll().filter(st => st.vars.pin).sort((a, b) => a.start - b.start)
      const maxScroll = ScrollTrigger.maxScroll(window)
      if (!maxScroll || pinned.length === 0) return
      const ranges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }))
      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = ranges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02)
            if (!inPinned) return value
            return ranges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              ranges[0]?.center ?? 0
            )
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      })
    }, 500)
    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <WhatIfSection />
        <BlueprintSection />
        <ProcessSection />
        <CoverageSection />
        <ServicesSection />
        <IndependenceSection />
        <SocialProofSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
