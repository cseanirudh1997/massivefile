// ─────────────────────────────────────────────
//  Contact — createLead form
//  Payload: { action, name, company, email, phone, interest, message }
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Send, MessageSquare, Mail, Phone, Building2 } from 'lucide-react'
import { createLead } from './api'
import { isValidEmail, isValidPhone } from './utils'
import { COMPANY_EMAIL } from './config'

const INTERESTS = [
  'AI Voice Agents',
  'Enterprise Copilots',
  'RAG Systems',
  'Workflow Automation',
  'Agent Orchestration',
  'Call Center AI',
  'Enterprise Plan',
  'Custom Solution',
]

const INIT = { name: '', company: '', email: '', phone: '', interest: '', message: '' }

export default function Contact() {
  const [form,       setForm]       = useState(INIT)
  const [submitting, setSubmitting] = useState(false)

  function set(k) {
    return e => setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim())              return toast.error('Name is required')
    if (!form.company.trim())           return toast.error('Company is required')
    if (!isValidEmail(form.email))      return toast.error('Valid email required')
    if (form.phone && !isValidPhone(form.phone)) return toast.error('Invalid phone number')

    setSubmitting(true)
    try {
      const res = await createLead(form)
      if (res?.success) {
        toast.success(res.message || 'Request submitted! Our team will be in touch.')
        setForm(INIT)
      } else {
        toast.error(res?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="orb w-96 h-96 bg-accent-600/15 -bottom-20 -left-20" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge-violet mb-4"><MessageSquare size={11} /> Enterprise Sales</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Book Your&nbsp;<span className="gradient-text-violet">AI Strategy</span>&nbsp;Call
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Tell us about your goals. Our enterprise team will design a custom AI roadmap
            and get you to production in 30 days.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {[
              { icon: Mail,     label: 'Email',   value: COMPANY_EMAIL },
              { icon: Phone,    label: 'Response', value: '< 1 business day' },
              { icon: Building2,label: 'For',      value: 'Enterprise teams of 20+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass border border-white/8 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-sm text-white font-medium">{value}</div>
                </div>
              </div>
            ))}

            <div className="glass border border-accent-700/30 rounded-xl p-4 mt-auto bg-accent-900/10">
              <p className="text-xs text-accent-300 font-semibold mb-1">What to expect</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>▸ 30-min discovery call with solutions architect</li>
                <li>▸ Custom AI roadmap within 48 hours</li>
                <li>▸ Pilot deployment in 14 days</li>
                <li>▸ Full production go-live in 30 days</li>
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass border border-white/8 rounded-2xl p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
                <input className="input-field" placeholder="Jane Smith" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Company *</label>
                <input className="input-field" placeholder="Acme Corp" value={form.company} onChange={set('company')} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Work Email *</label>
                <input type="email" className="input-field" placeholder="jane@acme.com" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
                <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Area of Interest</label>
              <select className="input-field" value={form.interest} onChange={set('interest')}>
                <option value="">Select a solution…</option>
                {INTERESTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tell us about your challenge</label>
              <textarea
                className="input-field resize-none h-28"
                placeholder="Describe your current bottlenecks, team size, and what success looks like…"
                value={form.message}
                onChange={set('message')}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </span>
              ) : (
                <><Send size={14} /> Submit Enterprise Request</>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
