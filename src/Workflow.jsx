// ─────────────────────────────────────────────
//  Workflow — static 5-step pipeline
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Search, Plug, Rocket, BarChart2, RefreshCcw, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon:        Search,
    step:        '01',
    title:       'Discovery',
    description: 'We audit your existing workflows, data sources, and AI readiness. A dedicated solutions architect maps the integration path.',
    color:       'text-brand-400',
    bg:          'bg-brand-500/10 border-brand-700/30',
  },
  {
    icon:        Plug,
    step:        '02',
    title:       'Integration',
    description: 'Secure connectors to your CRM, ERP, databases, and APIs. SAML/SSO, VPC peering, and encryption configured from day one.',
    color:       'text-accent-400',
    bg:          'bg-accent-500/10 border-accent-700/30',
  },
  {
    icon:        Rocket,
    step:        '03',
    title:       'Deployment',
    description: 'AI systems deployed to your cloud or ours. Blue-green rollouts, canary testing, and zero-downtime migration included.',
    color:       'text-blue-400',
    bg:          'bg-blue-500/10 border-blue-700/30',
  },
  {
    icon:        BarChart2,
    step:        '04',
    title:       'Monitoring',
    description: 'Real-time dashboards for model performance, latency, token costs, and business KPIs. Alerts routed to PagerDuty or Slack.',
    color:       'text-emerald-400',
    bg:          'bg-emerald-500/10 border-emerald-700/30',
  },
  {
    icon:        RefreshCcw,
    step:        '05',
    title:       'Optimization',
    description: 'Continuous fine-tuning, A/B testing, and cost optimization. Monthly AI business reviews with your dedicated CSM.',
    color:       'text-violet-400',
    bg:          'bg-violet-500/10 border-violet-700/30',
  },
]

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 relative">
      {/* Subtle bg */}
      <div className="absolute inset-0 circuit-grid opacity-30" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-badge-violet mb-4"><Rocket size={11} /> How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            From Pilot to&nbsp;<span className="gradient-text-violet">Production</span>
            &nbsp;in&nbsp;<span className="gradient-text">30&nbsp;Days</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            A battle-tested deployment playbook refined across 500+ enterprise rollouts.
          </p>
        </motion.div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden lg:flex items-start gap-4 max-w-5xl mx-auto">
          {STEPS.map(({ icon: Icon, step, title, description, color, bg }, i) => (
            <div key={step} className="flex items-start flex-1 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex-1 glass border rounded-2xl p-5 ${bg}`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${bg}`}>
                  <Icon size={17} className={color} />
                </div>
                <div className={`text-xs font-mono font-bold mb-1 ${color}`}>{step}</div>
                <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="mt-8 shrink-0">
                  <ArrowRight size={14} className="text-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical stacked */}
        <div className="flex lg:hidden flex-col gap-4 max-w-lg mx-auto">
          {STEPS.map(({ icon: Icon, step, title, description, color, bg }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`flex gap-4 glass border rounded-2xl p-5 ${bg}`}
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={15} className={color} />
              </div>
              <div>
                <div className={`text-xs font-mono font-bold mb-0.5 ${color}`}>{step} · {title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
