// ─────────────────────────────────────────────
//  UseCases — static 6 industry cards
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { ShoppingCart, Landmark, Stethoscope, Signal, Truck, Globe } from 'lucide-react'

const USE_CASES = [
  {
    icon:    ShoppingCart,
    industry:'Retail & E-Commerce',
    title:   'AI-Powered Customer Service at Scale',
    bullets: [
      '80% deflection of tier-1 support tickets',
      'Personalised product recommendations via RAG',
      'Voice agent handles returns & order tracking',
    ],
    metric:  '3.2× CSAT improvement',
    color:   'text-brand-400',
    bg:      'hover:border-brand-700/40',
  },
  {
    icon:    Landmark,
    industry:'FinTech & Banking',
    title:   'Intelligent Compliance & Risk Copilot',
    bullets: [
      'Regulatory doc review in minutes, not days',
      'Fraud pattern detection with explainability',
      'Agent-assisted KYC onboarding workflows',
    ],
    metric:  '60% compliance cost reduction',
    color:   'text-accent-400',
    bg:      'hover:border-accent-700/40',
  },
  {
    icon:    Stethoscope,
    industry:'Healthcare',
    title:   'Clinical Workflow Automation',
    bullets: [
      'Prior-auth processing reduced from 3 days to 4 hours',
      'AI medical scribe for EHR documentation',
      'Patient triage voice agent with HIPAA compliance',
    ],
    metric:  '45% admin burden reduction',
    color:   'text-emerald-400',
    bg:      'hover:border-emerald-700/40',
  },
  {
    icon:    Signal,
    industry:'Telecom',
    title:   'AI Call Center Transformation',
    bullets: [
      'IVR replacement with intent-aware voice AI',
      'Real-time agent coaching on live calls',
      '100% call transcription & sentiment tagging',
    ],
    metric:  '35% AHT reduction',
    color:   'text-blue-400',
    bg:      'hover:border-blue-700/40',
  },
  {
    icon:    Truck,
    industry:'Logistics & Supply Chain',
    title:   'Autonomous Operations Intelligence',
    bullets: [
      'AI dispatcher for last-mile route optimisation',
      'Predictive maintenance alerts from sensor data',
      'Copilot for supplier negotiation & PO drafting',
    ],
    metric:  '22% logistics cost savings',
    color:   'text-orange-400',
    bg:      'hover:border-orange-700/40',
  },
  {
    icon:    Globe,
    industry:'Enterprise SaaS',
    title:   'Embedded AI for Product Teams',
    bullets: [
      'In-product AI copilot via Massive SDK',
      'RAG-powered knowledge base for user support',
      'Autonomous onboarding workflows for new users',
    ],
    metric:  '2× feature adoption lift',
    color:   'text-violet-400',
    bg:      'hover:border-violet-700/40',
  },
]

export default function UseCases() {
  return (
    <section id="usecases" className="py-20 relative">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4"><Globe size={11} /> Industry Use Cases</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            AI That Moves&nbsp;<span className="gradient-text">Your Industry</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Real-world deployments across 6 verticals — measurable ROI from day 30.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USE_CASES.map(({ icon: Icon, industry, title, bullets, metric, color, bg }, i) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`group glass border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.015] ${bg}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon size={16} className={color} />
                <span className={`text-xs font-semibold uppercase tracking-widest ${color}`}>{industry}</span>
              </div>
              <h3 className="font-display font-semibold text-white text-sm leading-snug mb-3 group-hover:text-brand-200 transition-colors">
                {title}
              </h3>
              <ul className="space-y-1.5 mb-4">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className={`mt-0.5 shrink-0 ${color}`}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className={`text-xs font-semibold font-mono ${color} bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 inline-block`}>
                {metric}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
