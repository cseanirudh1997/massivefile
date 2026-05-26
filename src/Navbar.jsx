// ─────────────────────────────────────────────
//  Navbar — glass nav + mobile drawer
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, LayoutDashboard } from 'lucide-react'
import { NAV_LINKS, COMPANY_NAME } from './config'
import { getSession, clearSession, scrollToSection } from './utils'

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const session = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close drawer on ESC
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  function handleNav(href) {
    setOpen(false)
    if (href.startsWith('#')) scrollToSection(href)
    else navigate(href)
  }

  function handleLogout() {
    clearSession()
    navigate('/')
    window.location.reload()
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/8 shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-wrapper flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white group-hover:text-brand-200 transition-colors">
            {COMPANY_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => handleNav(href)}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {session.isLoggedIn ? (
            <>
              <span className="text-xs text-gray-600 font-mono">{session.username}</span>
              <Link to="/dashboard" className="btn-ghost gap-1.5 text-xs">
                <LayoutDashboard size={13} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300 p-2">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-ghost text-sm">Sign In</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-xs">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 w-72 z-50 md:hidden bg-gray-950/98 backdrop-blur-xl border-l border-white/8 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <span className="font-display font-bold text-white">{COMPANY_NAME}</span>
                <button onClick={() => setOpen(false)} className="p-1.5 text-gray-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ label, href }) => (
                  <button
                    key={label}
                    onClick={() => handleNav(href)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Auth section */}
              <div className="px-4 pb-6 border-t border-white/8 pt-4 space-y-2">
                {session.isLoggedIn ? (
                  <>
                    <div className="text-xs text-gray-600 px-2 mb-2 font-mono">{session.username}</div>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary w-full justify-center text-xs">
                      <LayoutDashboard size={13} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">
                      <LogOut size={13} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"  onClick={() => setOpen(false)} className="btn-secondary w-full justify-center text-sm">Sign In</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
