// ─────────────────────────────────────────────
//  Payments — Razorpay-style payment cards
//  Sheet: paymentId | title | amount | paymentUrl | active
//  Integration: window.open(paymentUrl) — Razorpay Payment Pages
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Shield, CreditCard, Zap, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import { getPaymentLinks, getPlatformConfig } from './api'
import { safeArr, formatCurrency, scrollToSection } from './utils'

const CARD_HIGHLIGHTS = {
  'AI Discovery Call':         ['30-min expert session', 'AI readiness assessment', 'Custom AI roadmap', 'Follow-up report'],
  'Enterprise AI Workshop':    ['Full-day workshop', 'Team of up to 20', 'Live AI demos', 'Deployment playbook'],
  'AI Strategy Session':       ['3-hour deep-dive', 'C-suite AI strategy', 'Vendor evaluation', 'ROI modelling'],
  'Enterprise Implementation': ['Custom engagement', 'Dedicated AI team', 'SLA-backed delivery', 'Ongoing support'],
}

function getHighlights(title) {
  return CARD_HIGHLIGHTS[title] || ['Enterprise-grade delivery', 'Dedicated support', 'Custom SLA', 'Full documentation']
}

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 space-y-5">
      <div className="h-5 w-2/3 shimmer bg-white/5 rounded-full" />
      <div className="h-10 w-1/3 shimmer bg-white/5 rounded-full" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 shimmer bg-white/5 rounded-full" style={{ width: `${65 + i * 5}%` }} />
        ))}
      </div>
      <div className="h-11 shimmer bg-white/5 rounded-xl" />
    </div>
  )
}

export default function Payments() {
  const [links,    setLinks]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    Promise.all([getPaymentLinks(), getPlatformConfig()])
      .then(([lRes, cRes]) => {
        const allLinks = safeArr(lRes?.paymentLinks || lRes?.data?.paymentLinks || lRes?.data)
        setLinks(allLinks.filter(l => l.active === 'yes'))

        const cfg = cRes?.config || {}
        if (cfg.paymentsEnabled === 'false') setDisabled(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handlePay(link) {
    if (!link.paymentUrl) return
    // Enterprise / custom → scroll to contact
    if (link.amount === 0 || link.amount === '0') {
      scrollToSection('contact')
      return
    }
    // Razorpay Payment Link → open in new tab
    window.open(link.paymentUrl, '_blank', 'noopener,noreferrer')
  }

  if (disabled) return null

  return (
    <section id="payments" className="py-24 relative">
      <div className="absolute inset-0 circuit-grid opacity-20" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge-violet mb-4"><CreditCard size={11} /> Engagements &amp; Pricing</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Your&nbsp;<span className="gradient-text-violet">AI Journey</span>&nbsp;Today
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Choose the engagement that fits your team. Every session is led by senior
            AI engineers with enterprise deployment experience.
          </p>
        </motion.div>

        <div className={`grid sm:grid-cols-2 ${links.length >= 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-2 max-w-3xl mx-auto'} gap-5`}>
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : links.map((link, i) => {
                const isEnterprise = !link.amount || link.amount === 0 || link.amount === '0'
                const highlights = getHighlights(link.title)

                return (
                  <motion.div
                    key={link.paymentId || i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`group relative glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                      i === 1
                        ? 'border border-brand-600/40 shadow-glow'
                        : 'border border-white/10 hover:border-brand-700/30'
                    }`}
                  >
                    {/* Popular badge */}
                    {i === 1 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-brand-600 text-white shadow-glow-sm">
                          <Zap size={9} className="fill-current" /> Most Popular
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-white text-base mb-4 leading-snug">
                      {link.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-5">
                      {isEnterprise ? (
                        <div>
                          <span className="font-display text-3xl font-bold gradient-text">Custom</span>
                          <p className="text-xs text-gray-600 mt-1">Tailored to your scale</p>
                        </div>
                      ) : (
                        <div>
                          <span className="font-display text-3xl font-bold text-white">
                            {formatCurrency(Number(link.amount))}
                          </span>
                          <span className="text-sm text-gray-500 ml-1.5">one-time</span>
                        </div>
                      )}
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {highlights.map(feat => (
                        <li key={feat} className="flex items-center gap-2.5 text-sm text-gray-400">
                          <CheckCircle size={13} className="text-brand-400 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handlePay(link)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        i === 1 ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {isEnterprise ? (
                        <><Phone size={14} /> Contact Sales</>
                      ) : (
                        <><ExternalLink size={13} /> Book Now</>
                      )}
                    </button>

                    {/* Razorpay trust badge */}
                    {!isEnterprise && (
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <Shield size={10} className="text-gray-700" />
                        <span className="text-xs text-gray-700">Secured by Razorpay</span>
                      </div>
                    )}
                  </motion.div>
                )
              })
          }
        </div>

        {/* Enterprise CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 glass border border-brand-700/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto"
        >
          <div>
            <p className="text-white font-semibold font-display">Need a full enterprise implementation?</p>
            <p className="text-sm text-gray-500 mt-0.5">Custom AI teams, SLA-backed delivery, dedicated infrastructure.</p>
          </div>
          <button onClick={() => scrollToSection('contact')} className="btn-primary shrink-0">
            Talk to Sales <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
