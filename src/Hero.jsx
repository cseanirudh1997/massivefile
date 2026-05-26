// ─────────────────────────────────────────────
//  Hero — CMS-driven cinematic hero
//  Media from getMediaAssets (entityType:'hero', entityId:'homepage')
//  Config from getPlatformConfig (heroHeadline, heroSubheadline)
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, ChevronDown, Zap, Activity, Globe, Users, TrendingUp } from 'lucide-react'
import { getMediaAssets, getPlatformConfig, findFeaturedAsset } from './api'
import { scrollToSection } from './utils'

const TYPEWRITER_PHRASES = [
  'AI Voice Agents',
  'Enterprise Copilots',
  'RAG Systems',
  'Agent Orchestration',
  'Workflow Automation',
  'Call Center AI',
]

const STATS = [
  { icon: Users,      value: '500+',   label: 'Enterprise Clients'  },
  { icon: TrendingUp, value: '99.99%', label: 'Uptime SLA'          },
  { icon: Globe,      value: '40+',    label: 'Countries'           },
  { icon: Activity,   value: '<80ms',  label: 'Response Latency'    },
]

// ── Floating particle ──
function Particle({ style }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-brand-400/40"
      style={style}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
      transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
    />
  )
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  key: i,
  style: { left: `${5 + Math.random() * 90}%`, top: `${10 + Math.random() * 80}%` },
}))

export default function Hero() {
  const [phraseIdx,  setPhraseIdx]  = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [typing,     setTyping]     = useState(true)
  const [heroImg,    setHeroImg]    = useState(null)
  const [headline,   setHeadline]   = useState('Enterprise AI Infrastructure for Voice, Automation & Intelligent Workflows')
  const [subline,    setSubline]    = useState('Deploy enterprise-grade AI voice agents, copilots, RAG systems, and workflow automation at scale.')

  // Load media + config in parallel
  useEffect(() => {
    Promise.all([
      getMediaAssets(),
      getPlatformConfig(),
    ]).then(([mRes, cRes]) => {
      const asset = findFeaturedAsset(mRes?.assets || [], 'hero')
      if (asset?.assetUrl) setHeroImg(asset.assetUrl)

      const cfg = cRes?.config || {}
      if (cfg.heroHeadline)    setHeadline(cfg.heroHeadline)
      if (cfg.heroSubheadline) setSubline(cfg.heroSubheadline)
    }).catch(() => {})
  }, [])

  // Typewriter effect
  const currentPhrase = TYPEWRITER_PHRASES[phraseIdx]
  useEffect(() => {
    let timer
    if (typing) {
      if (displayed.length < currentPhrase.length) {
        timer = setTimeout(() => setDisplayed(currentPhrase.slice(0, displayed.length + 1)), 60)
      } else {
        timer = setTimeout(() => setTyping(false), 2000)
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      } else {
        setPhraseIdx(i => (i + 1) % TYPEWRITER_PHRASES.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timer)
  }, [displayed, typing, currentPhrase])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Layered background */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 circuit-grid" />

      {/* Floating particles */}
      {PARTICLES.map(p => <Particle key={p.key} style={p.style} />)}

      {/* Ambient orbs */}
      <div className="orb w-[700px] h-[700px] bg-brand-500/10 -top-48 -left-48" />
      <div className="orb w-[500px] h-[500px] bg-accent-600/10 -bottom-24 right-0"  />
      <div className="orb w-[300px] h-[300px] bg-brand-400/5  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="section-wrapper relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="section-badge">
                <Zap size={10} /> Enterprise AI Infrastructure
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-5"
            >
              Deploy{' '}
              <span className="gradient-text typing-cursor inline-block min-w-[3ch]">
                {displayed || '\u00a0'}
              </span>
              <br className="hidden sm:block" />
              <span className="text-white"> at Enterprise Scale</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed max-w-[540px] mb-10"
            >
              {subline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-14"
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-primary text-base px-7 py-3.5"
              >
                Book AI Demo <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="btn-secondary text-base px-7 py-3.5"
              >
                <Play size={14} className="fill-current" /> Explore Products
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-ghost text-brand-400 hover:text-brand-300 text-sm"
              >
                Talk to AI Specialist →
              </button>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="glass border border-white/10 rounded-xl p-3 text-center"
                >
                  <Icon size={13} className="text-brand-400 mx-auto mb-1.5" />
                  <div className="font-display font-bold text-white text-lg leading-none">{value}</div>
                  <div className="text-xs text-gray-600 mt-1">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — hero visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-brand-700/30 shadow-glow aspect-[4/3]">
              {heroImg ? (
                <img
                  src={heroImg}
                  alt="Massive AI Platform"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-brand-950/80 to-accent-950/80 circuit-grid flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-glow-lg">
                      <Zap size={36} className="text-white" />
                    </div>
                    <p className="font-display text-2xl font-bold text-white">Massive AI</p>
                    <p className="text-gray-500 text-sm mt-1">Enterprise Infrastructure</p>
                  </div>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

              {/* Live status bar */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="glass border border-brand-700/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  <span className="text-xs text-gray-400 font-mono">AI systems operational — 99.99% uptime</span>
                  <span className="ml-auto text-xs text-brand-400 font-mono font-semibold">Live</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 glass border border-accent-700/40 rounded-xl px-3.5 py-2.5 shadow-glow-violet"
            >
              <div className="text-xs font-semibold text-accent-300 font-mono">Agent Orchestration</div>
              <div className="text-xs text-gray-500 mt-0.5">↑ 24 active workflows</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-5 -left-5 glass border border-brand-700/40 rounded-xl px-3.5 py-2.5 shadow-glow-sm"
            >
              <div className="text-xs font-semibold text-brand-300 font-mono">Voice AI</div>
              <div className="text-xs text-gray-500 mt-0.5">12,847 calls handled today</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-gray-700">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={14} className="text-gray-700" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
