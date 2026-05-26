// ─────────────────────────────────────────────
//  Footer — minimal premium
// ─────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { Zap, Linkedin, Twitter, Github, Youtube, Mail } from 'lucide-react'
import { COMPANY_NAME, COMPANY_TAGLINE, COMPANY_EMAIL, SOCIAL_LINKS, NAV_LINKS } from './config'
import { scrollToSection } from './utils'

const ICON_MAP = { linkedin: Linkedin, twitter: Twitter, github: Github, youtube: Youtube }

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/6 bg-gray-950/80">
      <div className="section-wrapper py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white group-hover:text-brand-200 transition-colors">
                {COMPANY_NAME}
              </span>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mb-5">{COMPANY_TAGLINE}</p>
            <div className="flex gap-2">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => {
                const Icon = ICON_MAP[name]
                return Icon ? (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg glass border border-white/8 flex items-center justify-center text-gray-600 hover:text-brand-400 hover:border-brand-700/40 transition-all"
                  >
                    <Icon size={13} />
                  </a>
                ) : null
              })}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Platform</h4>
            <div className="space-y-2">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => scrollToSection(href)}
                  className="block text-sm text-gray-600 hover:text-brand-400 transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Contact</h4>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-400 transition-colors mb-4"
            >
              <Mail size={12} /> {COMPANY_EMAIL}
            </a>
            <div className="flex gap-3 text-xs text-gray-700">
              <Link to="/login"  className="hover:text-gray-400 transition-colors">Sign In</Link>
              <span>·</span>
              <Link to="/signup" className="hover:text-gray-400 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-800">© {year} {COMPANY_NAME}. All rights reserved.</p>
          <p className="text-xs text-gray-800">Enterprise AI Infrastructure · Built for scale.</p>
        </div>
      </div>
    </footer>
  )
}
