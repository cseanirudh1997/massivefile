// ─────────────────────────────────────────────
//  Login
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { login } from './api'
import { saveSession, isValidEmail } from './utils'
import { COMPANY_NAME, STORAGE_KEYS } from './config'

export default function Login() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(email)) return toast.error('Valid email required')
    if (!password)             return toast.error('Password required')

    setLoading(true)
    try {
      const res = await login({ email, password })
      if (res?.success) {
        saveSession({
          [STORAGE_KEYS.IS_LOGGED_IN]: 'true',
          [STORAGE_KEYS.EMAIL]:        email,
          [STORAGE_KEYS.USERNAME]:     res.user?.name || email.split('@')[0],
          [STORAGE_KEYS.ROLE]:         res.user?.role || 'user',
          [STORAGE_KEYS.TIER]:         res.user?.tier || 'customer',
        })
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error(res?.message || 'Login failed. Please try again.')
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
          <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your enterprise dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="glass border border-white/8 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Work Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
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
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 transition-colors">
            Start free trial
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
