// ─────────────────────────────────────────────
//  Login — username · password
//  Users sheet: username | password | email | role | tier
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login } from './api'
import { saveSession } from './utils'
import { COMPANY_NAME } from './config'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim()) return toast.error('Username is required')
    if (!password)        return toast.error('Password is required')

    setLoading(true)
    try {
      const res = await login({ username: username.trim(), password })
      if (res?.success) {
        saveSession({
          username: res.user?.username || username.trim(),
          email:    res.user?.email    || '',
          role:     res.user?.role     || 'user',
          tier:     res.user?.tier     || 'customer',
        })
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error(res?.message || 'Invalid credentials. Please try again.')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg circuit-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-96 h-96 bg-accent-600/20 -top-24 -left-24" />
      <div className="orb w-72 h-72 bg-brand-500/10 bottom-0 -right-12" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">{COMPANY_NAME}</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">Sign in to your enterprise dashboard</p>
        </div>

        {/* Form card */}
        <div className="glass border border-white/10 rounded-2xl p-6 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Username <span className="text-brand-400">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Password <span className="text-brand-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Start free trial →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
