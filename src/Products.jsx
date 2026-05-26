// ─────────────────────────────────────────────
//  Products — dynamic from getProducts
//  Sheet: productId | title | category | description | pricing | featured
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mic, Bot, Database, Phone, Network, Workflow, Package, Star } from 'lucide-react'
import { getProducts, getMediaAssets, findAsset } from './api'
import { safeArr, scrollToSection } from './utils'

// Category → icon + colors
const CATEGORY_MAP = {
  'Voice AI':            { icon: Mic,      color: 'text-brand-400',   bg: 'bg-brand-500/10 border-brand-700/30'   },
  'Enterprise Copilot':  { icon: Bot,      color: 'text-accent-400',  bg: 'bg-accent-500/10 border-accent-700/30' },
  'RAG Systems':         { icon: Database, color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-700/30'     },
  'Call Center AI':      { icon: Phone,    color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-700/30'     },
  'Agent Orchestration': { icon: Network,  color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-700/30' },
  'Workflow Automation': { icon: Workflow, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-700/30'},
}

function getCategory(cat) {
  return CATEGORY_MAP[cat] || { icon: Package, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-700/30' }
}

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between">
        <div className="h-8 w-8 shimmer bg-white/5 rounded-xl" />
        <div className="h-5 w-16 shimmer bg-white/5 rounded-full" />
      </div>
      <div className="h-5 w-3/4 shimmer bg-white/5 rounded-full" />
      <div className="space-y-2">
        <div className="h-3 shimmer bg-white/5 rounded-full" />
        <div className="h-3 w-5/6 shimmer bg-white/5 rounded-full" />
        <div className="h-3 w-4/6 shimmer bg-white/5 rounded-full" />
      </div>
      <div className="h-9 shimmer bg-white/5 rounded-xl" />
    </div>
  )
}

function ProductCard({ product, asset, index }) {
  const { icon: Icon, color, bg } = getCategory(product.category)
  const isFeatured = product.featured === 'yes'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`group relative glass rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
        isFeatured
          ? 'border border-brand-600/40 shadow-glow'
          : 'border border-white/8 hover:border-brand-700/30'
      }`}
    >
      {/* Product image */}
      {asset?.assetUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={asset.assetUrl}
            alt={product.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>
      )}

      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-600/80 backdrop-blur-sm text-white border border-brand-500/40">
          <Star size={9} className="fill-current" /> Featured
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + category */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${bg}`}>
            <Icon size={16} className={color} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-widest ${color}`}>
            {product.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-brand-200 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">
          {product.description}
        </p>

        {/* Pricing + CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div>
            <div className="text-xs text-gray-600 mb-0.5">Starting at</div>
            <div className="font-display font-bold text-brand-300 text-base">{product.pricing}</div>
          </div>
          <button
            onClick={() => scrollToSection('contact')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isFeatured ? 'btn-primary py-2' : 'btn-secondary py-2'
            }`}
          >
            Deploy <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [assets,   setAssets]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    Promise.all([getProducts(), getMediaAssets()])
      .then(([pRes, mRes]) => {
        setProducts(safeArr(pRes?.products || pRes?.data?.products || pRes?.data))
        setAssets(safeArr(mRes?.assets   || mRes?.data?.assets   || mRes?.data))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return ['all', ...cats]
  }, [products])

  const filtered = useMemo(() => {
    if (filter === 'all') return products
    return products.filter(p => p.category === filter)
  }, [products, filter])

  return (
    <section id="products" className="py-24 relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="section-badge mb-4"><Package size={11} /> Enterprise AI Products</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            AI Products Built for&nbsp;<span className="gradient-text">Enterprise Scale</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Production-ready AI systems, fully managed and enterprise-hardened.
            Deploy in days, scale to millions of interactions.
          </p>
        </motion.div>

        {/* Category filter pills */}
        {!loading && categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                  filter === cat
                    ? 'bg-brand-600/30 border border-brand-600/40 text-white'
                    : 'glass border border-white/8 text-gray-500 hover:text-white hover:border-brand-700/30'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((product, i) => {
                const asset = findAsset(assets, 'product', product.productId)
                return (
                  <ProductCard
                    key={product.productId || i}
                    product={product}
                    asset={asset}
                    index={i}
                  />
                )
              })
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            No products found for this category.
          </div>
        )}
      </div>
    </section>
  )
}
