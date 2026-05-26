// ─────────────────────────────────────────────
//  Payments — getPaymentLinks cards
//  Integration: window.open(paymentUrl) — NO Razorpay SDK
//  PaymentLink fields: paymentId, title, amount, paymentUrl, active
//  NO description field
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, CreditCard, ArrowRight } from 'lucide-react'
import { getPaymentLinks } from './api'
import { scrollToSection } from './utils'

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="h-4 w-2/3 shimmer bg-white/5 rounded-full" />
      <div className="h-8 w-1/3 shimmer bg-white/5 rounded-full" />
      <div className="h-10 shimmer bg-white/5 rounded-xl" />
    </div>
  )
}

export default function Payments() {
  const [links,   setLinks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPaymentLinks()
      .then(res => setLinks((res?.paymentLinks || []).filter(l => l.active === 'yes')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handlePay(link) {
    if (link.amount === 0 || link.paymentUrl?.includes('contact')) {
      scrollToSection('contact')
    } else {
      window.open(link.paymentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="payments" className="py-20 relative">
      <div className="absolute inset-0 circuit-grid opacity-25" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4"><CreditCard size={11} /> Pricing</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Transparent&nbsp;<span className="gradient-text">Enterprise Pricing</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            No hidden fees. No per-seat surprises. Start with a plan that fits, scale when you grow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : links.map((link, i) => {
                const isEnterprise = link.amount === 0
                return (
                  <motion.div
                    key={link.paymentId || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass border border-white/8 rounded-2xl p-6 flex flex-col hover:border-brand-700/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    <h3 className="font-display font-semibold text-white text-sm mb-3 leading-snug">{link.title}</h3>

                    <div className="mb-5">
                      {isEnterprise ? (
                        <span className="text-2xl font-bold text-brand-300 font-display">Custom</span>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-white font-display">
                            ${link.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/mo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1" />

                    <button
                      onClick={() => handlePay(link)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isEnterprise ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {isEnterprise ? (
                        <><ArrowRight size={14} /> Contact Sales</>
                      ) : (
                        <><ExternalLink size={13} /> Subscribe</>
                      )}
                    </button>
                  </motion.div>
                )
              })
          }
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-600 mt-8"
        >
          All plans include 99.99% SLA, dedicated onboarding, and enterprise support.
          <button
            onClick={() => scrollToSection('contact')}
            className="text-brand-400 hover:text-brand-300 ml-1 transition-colors"
          >
            Talk to sales →
          </button>
        </motion.p>
      </div>
    </section>
  )
}
