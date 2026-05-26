// ─────────────────────────────────────────────
//  Massive — Global Configuration
//  Enterprise AI Infrastructure Platform
// ─────────────────────────────────────────────

export const API_URL =
  'https://script.google.com/macros/s/AKfycbzPBTRBb8kEGmckCJ8boQ7_BBPWYEFZk8Lt9luE8rgeKKuK3E-mIN4F8O3ITOvzNLwo/exec'

export const COMPANY_NAME    = 'Massive'
export const COMPANY_TAGLINE = 'Enterprise AI Infrastructure at Scale'
export const COMPANY_EMAIL   = 'hello@massivefile.com'
export const COMPANY_URL     = 'https://massivefile.com'

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/massivefile',
  twitter:  'https://twitter.com/massivefile',
  github:   'https://github.com/massivefile',
  youtube:  'https://youtube.com/@massivefile',
}

export const NAV_LINKS = [
  { label: 'Products',     href: '#products'     },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Use Cases',    href: '#usecases'     },
  { label: 'Pricing',      href: '#payments'     },
  { label: 'Contact',      href: '#contact'      },
]

// ── LocalStorage keys ──────────────────────────
// Prefixed mf_ to avoid collisions
export const STORAGE_KEYS = {
  IS_LOGGED_IN: 'mf_isLoggedIn',
  USERNAME:     'mf_username',
  EMAIL:        'mf_email',
  ROLE:         'mf_role',
  TIER:         'mf_tier',
}

// ── Tier / Role constants ──────────────────────
export const TIERS = {
  CUSTOMER:   'customer',
  ENTERPRISE: 'enterprise',
  ADMIN:      'admin',
}

export const ROLES = {
  USER:  'user',
  ADMIN: 'admin',
}

// ── Lead interest options ──────────────────────
export const INTEREST_OPTIONS = [
  'Massive Voice AI',
  'Massive Copilot',
  'Massive RAG Studio',
  'Massive CallOps',
  'Agent Orchestration',
  'Workflow Automation',
  'Enterprise Implementation',
  'Custom Solution',
]
