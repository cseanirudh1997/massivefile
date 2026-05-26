// ─────────────────────────────────────────────
//  Hero — typewriter capabilities, media asset, stats bar
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, Users, TrendingUp, Globe } from 'lucide-react'
import { getMediaAssets } from './api'
import { scrollToSection } from './utils'

const CAPABILITIES = [
  'AI Voice Agents',
  'Enterprise Copilots',
  'RAG Systems',
  'Workflow Automation',
  'Agent Orchestration',
  'Call Center AI',
]

const STATS = [
  { icon: Users,      value: '500+',   label: 'Enterprise Clients'   },
  { icon: TrendingUp, value: '99.99%', label: 'Uptime SLA'           },
  { icon: Globe,      value: '40+',    label: 'Countries Deployed'   },
  { icon: Zap,        value: '<80ms',  label: 'Avg Response Time'    },
]

export default function Hero() {
  const [capIdx,    setCapIdx]    = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing,    setTyping]    = useState(true)
  const [heroImg,   setHeroImg]   = useState(null)

  // Typewriter
  useEffect(() => {
    const target = CAPABILITIES[capIdx]
    let i = displayed.length

    if (typing) {
      if (i < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i + 1)), 65)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i - 1)), 35)
        return () => clearTimeout(t)
      } else {
        setCapIdx(prev => (prev + 1) % CAPABILITIES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, capIdx])

  // Hero image
  useEffect(() => {
    getMediaAssets().then(res => {
      const featured = (res?.assets || []).find(a => a.entityType === 'hero' && a.featured === 'yes')
      if (featured) setHeroImg(featured.assetUrl)
    }).catch(() => {})
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 circuit-grid opacity-60" />

      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] bg-brand-500/20 -top-32 -left-32" />
      <div className="orb w-[400px] h-[400px] bg-accent-600/15 bottom-0 right-0" />

      <div className="section-wrapper relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-badge mb-6">
                <Zap size={11} /> Enterprise AI Infrastructure
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Deploy&nbsp;
              <span className="gradient-text typing-cursor block sm:inline min-h-[1.2em]">
                {displayed || '\u00a0'}
              </span>
              <span className="block mt-1">at Scale</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Massive delivers production-grade AI infrastructure — Voice Agents, Copilots,
              RAG Systems, and Autonomous Workflow Automation — fully integrated into your
              enterprise stack.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <button onClick={() => scrollToSection('contact')} className="btn-primary">
                Book Enterprise Demo <ArrowRight size={15} />
              </button>
              <button onClick={() => scrollToSection('capabilities')} className="btn-secondary">
                <Play size={14} /> Explore Platform
              </button>
              <Link to="/signup" className="btn-ghost text-brand-400 hover:text-brand-300">
                Start Free Trial →
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="stat-card">
                  <Icon size={14} className="text-brand-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-display">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — hero image / visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border border-brand-700/30 shadow-glow">
              {heroImg ? (
                <img src={heroImg} alt="Enterprise AI infrastructure" className="w-full object-cover aspect-video" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-brand-900/40 to-accent-900/40 circuit-grid flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <Zap size={28} className="text-white" />
                    </div>
                    <p className="text-brand-400 font-display font-semibold text-xl">Massive AI</p>
                    <p className="text-gray-600 text-sm mt-1">Enterprise Infrastructure</p>
                  </div>
                </div>
              )}
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 glass border border-brand-700/30 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <span className="text-xs text-gray-300 font-mono">AI systems operational — 99.99% uptime</span>
              </div>
            </div>

            {/* Floating pill */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 glass border border-accent-700/40 rounded-xl px-3 py-2 shadow-glow-violet"
            >
              <div className="text-xs font-semibold text-accent-300 font-mono">Agent Orchestration</div>
              <div className="text-xs text-gray-500">↑ 12 active workflows</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
