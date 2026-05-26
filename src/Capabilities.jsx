// ─────────────────────────────────────────────
//  Capabilities — static 6-card grid
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Mic, Bot, Database, Workflow, Phone, Network } from 'lucide-react'

const CAPABILITIES = [
  {
    icon:        Mic,
    title:       'AI Voice Agents',
    description: 'Deploy human-quality voice AI for inbound and outbound calls. Natural conversation flows, multilingual support, CRM-integrated call summaries.',
    tags:        ['Real-time STT', 'LLM Routing', 'CRM Sync'],
    color:       'from-brand-600/30 to-brand-800/20',
    border:      'hover:border-brand-600/40',
    iconBg:      'bg-brand-600/20 text-brand-400',
  },
  {
    icon:        Bot,
    title:       'Enterprise Copilots',
    description: 'Custom AI copilots embedded in your workflows. Code assist, data analysis, document drafting — all governed by your enterprise policies.',
    tags:        ['Custom LLM', 'RBAC', 'Audit Logs'],
    color:       'from-accent-700/30 to-accent-900/20',
    border:      'hover:border-accent-600/40',
    iconBg:      'bg-accent-600/20 text-accent-400',
  },
  {
    icon:        Database,
    title:       'RAG Systems',
    description: 'Production-grade Retrieval-Augmented Generation pipelines. Ingest, index, and query your enterprise knowledge base with sub-100ms latency.',
    tags:        ['Vector DB', 'Hybrid Search', '<100ms'],
    color:       'from-blue-800/30 to-blue-900/20',
    border:      'hover:border-blue-600/40',
    iconBg:      'bg-blue-600/20 text-blue-400',
  },
  {
    icon:        Network,
    title:       'Agent Orchestration',
    description: 'Multi-agent systems that plan, delegate, and execute complex tasks autonomously. Full observability with trace logs and rollback controls.',
    tags:        ['Multi-agent', 'Trace Logs', 'Auto-retry'],
    color:       'from-violet-800/30 to-violet-900/20',
    border:      'hover:border-violet-600/40',
    iconBg:      'bg-violet-600/20 text-violet-400',
  },
  {
    icon:        Workflow,
    title:       'Workflow Automation',
    description: 'Connect AI to your existing tools — Slack, Salesforce, SAP, Jira — and automate repetitive processes end-to-end without code changes.',
    tags:        ['200+ Integrations', 'No-code Builder', 'Event-driven'],
    color:       'from-emerald-800/30 to-emerald-900/20',
    border:      'hover:border-emerald-600/40',
    iconBg:      'bg-emerald-600/20 text-emerald-400',
  },
  {
    icon:        Phone,
    title:       'Call Center AI',
    description: 'Replace legacy IVR with conversational AI. Sentiment analysis, real-time coaching, auto-escalation, and 100% call transcription included.',
    tags:        ['Sentiment Analysis', 'Live Coaching', 'IVR Replacement'],
    color:       'from-rose-800/30 to-rose-900/20',
    border:      'hover:border-rose-600/40',
    iconBg:      'bg-rose-600/20 text-rose-400',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 relative">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4"><Network size={11} /> Platform Capabilities</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to&nbsp;
            <span className="gradient-text">Ship AI</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            A unified infrastructure layer for every enterprise AI use case — from first
            prototype to global production scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map(({ icon: Icon, title, description, tags, color, border, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`group glass border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${border}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2 group-hover:text-brand-200 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
