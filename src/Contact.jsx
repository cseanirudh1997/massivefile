// ─────────────────────────────────────────────
//  Contact — Lead form (createLead) + Contact form (submitContact)
//  Lead payload:    { action, name, company, email, phone, interest, message }
//  Contact payload: { action, name, email, subject, message }
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Send, MessageSquare, Phone, Mail, Building2, Clock, CheckCircle } from 'lucide-react'
import { createLead, submitContact } from './api'
import { isValidEmail, isValidPhone } from './utils'
import { COMPANY_EMAIL, INTEREST_OPTIONS } from './config'

const LEAD_INIT    = { name: '', company: '', email: '', phone: '', interest: '', message: '' }
const CONTACT_INIT = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [tab,          setTab]          = useState('lead')
  const [leadForm,     setLeadForm]     = useState(LEAD_INIT)
  const [contactForm,  setContactForm]  = useState(CONTACT_INIT)
  const [submitting,   setSubmitting]   = useState(false)
  const [success,      setSuccess]      = useState(false)

  function setLead(k)    { return e => setLeadForm(prev    => ({ ...prev, [k]: e.target.value })) }
  function setContact(k) { return e => setContactForm(prev => ({ ...prev, [k]: e.target.value })) }

  async function submitLead(e) {
    e.preventDefault()
    if (!leadForm.name.trim())          return toast.error('Full name is required')
    if (!leadForm.company.trim())       return toast.error('Company name is required')
    if (!isValidEmail(leadForm.email))  return toast.error('Valid work email required')
    if (leadForm.phone && !isValidPhone(leadForm.phone)) return toast.error('Invalid phone number')

    setSubmitting(true)
    try {
      const res = await createLead(leadForm)
      if (res?.success) {
        toast.success(res.message || 'Request submitted! Our team will reach out within 1 business day.')
        setLeadForm(LEAD_INIT)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
      } else {
        toast.error(res?.message || 'Submission failed. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function submitContactForm(e) {
    e.preventDefault()
    if (!contactForm.name.trim())         return toast.error('Name is required')
    if (!isValidEmail(contactForm.email)) return toast.error('Valid email required')
    if (!contactForm.subject.trim())      return toast.error('Subject is required')
    if (!contactForm.message.trim())      return toast.error('Message is required')

    setSubmitting(true)
    try {
      const res = await submitContact(contactForm)
      if (res?.success) {
        toast.success(res.message || "Message sent! We'll respond within 24 hours.")
        setContactForm(CONTACT_INIT)
      } else {
        toast.error(res?.message || 'Submission failed. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 relative">
      <div className="orb w-96 h-96 bg-accent-600/10 -bottom-20 -left-20" />
      <div className="orb w-72 h-72 bg-brand-500/10 top-10 right-0" />

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
            Get Your&nbsp;<span className="gradient-text-violet">AI Strategy</span>&nbsp;Call
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Tell us your goals. Our senior AI engineers will design a custom implementation
            plan and get you to production in 30 days.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 max-w-5xl mx-auto">

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {[
              { icon: Mail,      label: 'Email',     value: COMPANY_EMAIL              },
              { icon: Phone,     label: 'Response',  value: '< 1 business day'         },
              { icon: Building2, label: 'Best for',  value: 'Enterprises with 20+ team'},
              { icon: Clock,     label: 'Go-live',   value: '30-day deployment target' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass border border-white/8 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600/15 border border-brand-700/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">{label}</div>
                  <div className="text-sm text-white font-medium">{value}</div>
                </div>
              </div>
            ))}

            <div className="glass border border-accent-700/25 bg-accent-900/10 rounded-xl p-5 mt-6">
              <p className="text-xs font-semibold text-accent-300 mb-3">What happens next</p>
              <ul className="space-y-2">
                {[
                  '30-min discovery call with solutions architect',
                  'Custom AI roadmap within 48 hours',
                  'Pilot deployment in 14 days',
                  'Full production go-live in 30 days',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle size={11} className="text-accent-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── Forms ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 glass border border-white/8 rounded-xl w-fit mb-6">
              {[
                { id: 'lead',    label: 'Book Enterprise Demo' },
                { id: 'contact', label: 'General Enquiry'      },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    tab === id
                      ? 'bg-brand-600/30 border border-brand-600/40 text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Lead Form ── */}
            {tab === 'lead' && (
              <form onSubmit={submitLead} className="glass border border-white/8 rounded-2xl p-6 space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                    <input className="input-field" placeholder="Jane Smith" value={leadForm.name} onChange={setLead('name')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company *</label>
                    <input className="input-field" placeholder="Acme Corp" value={leadForm.company} onChange={setLead('company')} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Work Email *</label>
                    <input type="email" className="input-field" placeholder="jane@acme.com" value={leadForm.email} onChange={setLead('email')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                    <input type="tel" className="input-field" placeholder="+1 555 000 0000" value={leadForm.phone} onChange={setLead('phone')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Area of Interest</label>
                  <select className="input-field" value={leadForm.interest} onChange={setLead('interest')}>
                    <option value="">Select a solution…</option>
                    {INTEREST_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Tell us your challenge</label>
                  <textarea
                    className="input-field resize-none h-28"
                    placeholder="Describe your current bottlenecks, team size, and what success looks like…"
                    value={leadForm.message}
                    onChange={setLead('message')}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting
                    ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting…</>
                    : <><Send size={14} /> Submit Enterprise Request</>
                  }
                </button>
                {success && (
                  <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded-xl px-4 py-3">
                    <CheckCircle size={14} /> Request submitted! We&apos;ll be in touch within 1 business day.
                  </div>
                )}
              </form>
            )}

            {/* ── Contact Form ── */}
            {tab === 'contact' && (
              <form onSubmit={submitContactForm} className="glass border border-white/8 rounded-2xl p-6 space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
                    <input className="input-field" placeholder="Jane Smith" value={contactForm.name} onChange={setContact('name')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
                    <input type="email" className="input-field" placeholder="jane@acme.com" value={contactForm.email} onChange={setContact('email')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject *</label>
                  <input className="input-field" placeholder="Partnership enquiry / Technical question / Other" value={contactForm.subject} onChange={setContact('subject')} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Message *</label>
                  <textarea
                    className="input-field resize-none h-32"
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={setContact('message')}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting
                    ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending…</>
                    : <><Send size={14} /> Send Message</>
                  }
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
