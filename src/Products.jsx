// ─────────────────────────────────────────────
//  Products — dynamic from getProducts
//  IMPORTANT: uses product.pricing (NOT price)
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, ArrowRight, Package } from 'lucide-react'
import { getProducts } from './api'
import { scrollToSection } from './utils'

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="h-5 w-1/2 shimmer bg-white/5 rounded-full" />
      <div className="h-8 w-1/3 shimmer bg-white/5 rounded-full" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 shimmer bg-white/5 rounded-full" style={{ width: `${70 + i * 5}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getProducts()
      .then(res => setProducts((res?.products || []).filter(p => p.active === 'yes')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="products" className="py-20 relative">
      {/* Subtle bg */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4"><Package size={11} /> Enterprise Products</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            AI Products Built for&nbsp;<span className="gradient-text">Scale</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Production-ready AI products, fully managed. Start in days, scale to millions.
          </p>
        </motion.div>

        <div className={`grid sm:grid-cols-2 ${products.length >= 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-5 max-w-6xl mx-auto`}>
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, i) => {
                const isFeatured = product.featured === 'yes'
                const features   = (product.features || '').split('·').map(f => f.trim()).filter(Boolean)

                return (
                  <motion.div
                    key={product.productId || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className={`relative glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                      isFeatured
                        ? 'border border-brand-600/40 shadow-glow'
                        : 'border border-white/8 hover:border-brand-700/30'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-brand-600 text-white shadow-glow-sm">
                          <Star size={9} /> Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="font-display font-bold text-white text-lg">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{product.description}</p>
                    </div>

                    {/* pricing — uses product.pricing (string, not number) */}
                    <div className="mb-5">
                      <span className="text-2xl font-bold text-white font-display">{product.pricing}</span>
                    </div>

                    <ul className="space-y-2 flex-1 mb-6">
                      {features.map(feat => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check size={12} className="text-brand-400 mt-0.5 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => scrollToSection('contact')}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isFeatured
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      Get Started <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}
