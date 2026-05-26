// ─────────────────────────────────────────────
//  ProductShowcase — media assets visual showcase
//  NO caption field — just entityId for label
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { getMediaAssets } from './api'

const ENTITY_LABELS = {
  'voice-agent':  'AI Voice Agent',
  'copilot':      'Enterprise Copilot',
  'rag':          'RAG System',
  'automation':   'Workflow Automation',
  'hero-main':    'Massive Platform',
  'hero-alt':     'Enterprise Infrastructure',
}

export default function ProductShowcase() {
  const [assets,  setAssets]  = useState([])
  const [idx,     setIdx]     = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMediaAssets()
      .then(res => {
        const showcaseAssets = (res?.assets || []).filter(
          a => a.entityType === 'showcase' || a.entityType === 'hero'
        )
        setAssets(showcaseAssets)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function prev() { setIdx(i => (i - 1 + assets.length) % assets.length) }
  function next() { setIdx(i => (i + 1) % assets.length) }

  if (!loading && assets.length === 0) return null

  const current = assets[idx]

  return (
    <section id="showcase" className="py-20 relative">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="section-badge mb-4"><Layers size={11} /> Platform Showcase</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            See Massive&nbsp;<span className="gradient-text">in Action</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Real deployments powering enterprise AI teams worldwide.
          </p>
        </motion.div>

        {loading ? (
          <div className="max-w-4xl mx-auto aspect-video rounded-2xl shimmer bg-white/5 border border-white/10" />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-brand-700/30 shadow-glow aspect-video">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current?.assetId}
                  src={current?.assetUrl}
                  alt={ENTITY_LABELS[current?.entityId] || 'Massive AI Platform'}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Label overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950/90 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-display font-semibold">
                      {ENTITY_LABELS[current?.entityId] || 'Massive Platform'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">
                      {current?.entityType} · {current?.assetType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={next}
                      className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                {assets.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === idx ? 'bg-brand-400 w-4' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
