// ─────────────────────────────────────────────
//  Massive — Global Configuration
//  Enterprise AI Infrastructure Platform
// ─────────────────────────────────────────────

export const API_URL =
  'https://script.google.com/macros/s/YOUR_MASSIVEFILE_SCRIPT_ID/exec'

export const COMPANY_NAME    = 'Massive'
export const COMPANY_TAGLINE = 'Enterprise AI Infrastructure at Scale'
export const COMPANY_EMAIL   = 'hello@massivefile.com'
export const COMPANY_PHONE   = '+1 (800) 555-0199'
export const COMPANY_ADDRESS = 'San Francisco, CA'

export const SOCIAL_LINKS = {
  linkedin:  'https://linkedin.com/company/massivefile',
  twitter:   'https://twitter.com/massivefile',
  github:    'https://github.com/massivefile',
  youtube:   'https://youtube.com/@massivefile',
}

export const NAV_LINKS = [
  { label: 'Capabilities', href: '#capabilities'    },
  { label: 'Products',     href: '#products'         },
  { label: 'Use Cases',    href: '#usecases'         },
  { label: 'Workflow',     href: '#workflow'         },
  { label: 'Pricing',      href: '#payments'         },
  { label: 'Contact',      href: '#contact'          },
]

// ── Feature flags ─────────────────────────────
export const paymentsEnabled      = true
export const consultationsEnabled = true
export const chatbotEnabled       = true

// ── Tier constants ─────────────────────────────
export const TIERS = {
  CUSTOMER:   'customer',
  ENTERPRISE: 'enterprise',
  ADMIN:      'admin',
}

// ── Role constants ─────────────────────────────
export const ROLES = {
  USER:  'user',
  ADMIN: 'admin',
}

// ── LocalStorage keys ──────────────────────────
export const STORAGE_KEYS = {
  IS_LOGGED_IN: 'mf_isLoggedIn',
  USERNAME:     'mf_username',
  EMAIL:        'mf_email',
  ROLE:         'mf_role',
  PHONE:        'mf_phone',
  TIER:         'mf_tier',
}
