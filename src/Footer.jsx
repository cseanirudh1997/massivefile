// ─────────────────────────────────────────────
//  Footer
// ─────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { Zap, Linkedin, Twitter, Github, Youtube, Mail } from 'lucide-react'
import { COMPANY_NAME, COMPANY_TAGLINE, COMPANY_EMAIL, SOCIAL_LINKS, NAV_LINKS } from './config'

const SOCIAL_ICONS = {
  linkedin:  Linkedin,
  twitter:   Twitter,
  github:    Github,
  youtube:   Youtube,
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/8 bg-gray-950/80 backdrop-blur-sm mt-16">
      <div className="section-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">{COMPANY_NAME}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{COMPANY_TAGLINE}</p>
            <div className="flex gap-3 mt-4">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => {
                const Icon = SOCIAL_ICONS[name]
                return Icon ? (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                     className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-500 hover:text-brand-400 hover:border-brand-700/40 transition-colors">
                    <Icon size={13} />
                  </a>
                ) : null
              })}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Platform</h4>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className="text-sm text-gray-500 hover:text-brand-400 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contact</h4>
            <a href={`mailto:${COMPANY_EMAIL}`}
               className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors mb-2">
              <Mail size={13} /> {COMPANY_EMAIL}
            </a>
            <div className="mt-4 flex gap-2">
              <Link to="/login"  className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Sign In</Link>
              <span className="text-gray-700">·</span>
              <Link to="/signup" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">
            © {year} {COMPANY_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built for enterprise AI teams.
          </p>
        </div>
      </div>
    </footer>
  )
}
