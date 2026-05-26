// ─────────────────────────────────────────────
//  Navbar — glass navbar + mobile drawer
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, LayoutDashboard } from 'lucide-react'
import { NAV_LINKS, COMPANY_NAME } from './config'
import { getSession, clearSession, scrollToSection } from './utils'

export default function Navbar() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const { isLoggedIn, username }  = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNav(href) {
    setOpen(false)
    if (href.startsWith('#')) {
      scrollToSection(href)
    } else {
      navigate(href)
    }
  }

  function handleLogout() {
    clearSession()
    navigate('/')
    window.location.reload()
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-md border-b border-white/8 shadow-glass' : 'bg-transparent'
      }`}
    >
      <nav className="section-wrapper flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white group-hover:text-brand-300 transition-colors">
            {COMPANY_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => handleNav(href)}
              className="btn-ghost text-gray-400 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-xs text-gray-500">{username}</span>
              <Link to="/dashboard" className="btn-ghost gap-1.5">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-ghost">Sign In</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-xs">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-950/95 backdrop-blur-md border-b border-white/8 px-4 pb-4"
          >
            <div className="flex flex-col gap-1 pt-2">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="border-t border-white/8 mt-2 pt-2 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-primary justify-center text-xs">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost text-red-400 justify-center">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"  onClick={() => setOpen(false)} className="btn-secondary justify-center text-xs">Sign In</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary justify-center text-xs">Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
