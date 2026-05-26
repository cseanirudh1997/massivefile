// ─────────────────────────────────────────────
//  Signup
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { signup } from './api'
import { saveSession, isValidEmail } from './utils'
import { COMPANY_NAME, STORAGE_KEYS } from './config'

const INIT = { name: '', company: '', email: '', phone: '', password: '' }

export default function Signup() {
  const [form,    setForm]    = useState(INIT)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(k) { return e => setForm(prev => ({ ...prev, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim())           return toast.error('Full name required')
    if (!form.company.trim())        return toast.error('Company required')
    if (!isValidEmail(form.email))   return toast.error('Valid email required')
    if (form.password.length < 8)    return toast.error('Password must be at least 8 characters')

    setLoading(true)
    try {
      const res = await signup(form)
      if (res?.success) {
        saveSession({
          [STORAGE_KEYS.IS_LOGGED_IN]: 'true',
          [STORAGE_KEYS.EMAIL]:        form.email,
          [STORAGE_KEYS.USERNAME]:     form.name,
          [STORAGE_KEYS.ROLE]:         res.user?.role || 'user',
          [STORAGE_KEYS.TIER]:         res.user?.tier || 'customer',
        })
        toast.success(res.message || 'Account created! Welcome to Massive.')
        navigate('/dashboard')
      } else {
        toast.error(res?.message || 'Signup failed. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg circuit-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">{COMPANY_NAME}</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Start your free trial</h1>
          <p className="text-sm text-gray-500">Enterprise AI infrastructure in 30 days</p>
        </div>

        <form onSubmit={handleSubmit} className="glass border border-white/8 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
              <input className="input-field" placeholder="Jane Smith" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Company *</label>
              <input className="input-field" placeholder="Acme Corp" value={form.company} onChange={set('company')} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Work Email *</label>
            <input type="email" className="input-field" placeholder="jane@acme.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
            <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account…
              </span>
            ) : 'Create Account'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            By signing up you agree to our{' '}
            <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors">Privacy Policy</a>.
          </p>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
