// ─────────────────────────────────────────────
//  Massive — Utility Helpers
// ─────────────────────────────────────────────

import { STORAGE_KEYS } from './config'

/* ── Session ── */
export function saveSession({ username, email, role, tier }) {
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true')
  if (username) localStorage.setItem(STORAGE_KEYS.USERNAME, username)
  if (email)    localStorage.setItem(STORAGE_KEYS.EMAIL,    email)
  if (role)     localStorage.setItem(STORAGE_KEYS.ROLE,     role)
  if (tier)     localStorage.setItem(STORAGE_KEYS.TIER,     tier)
}

export function getSession() {
  return {
    isLoggedIn: localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true',
    username:   localStorage.getItem(STORAGE_KEYS.USERNAME) || '',
    email:      localStorage.getItem(STORAGE_KEYS.EMAIL)    || '',
    role:       localStorage.getItem(STORAGE_KEYS.ROLE)     || 'user',
    tier:       localStorage.getItem(STORAGE_KEYS.TIER)     || 'customer',
  }
}

export function clearSession() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
}

/* ── Validation ── */
export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPhone(phone = '') {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone.trim())
}

/* ── Scroll ── */
export function scrollToSection(id) {
  const clean = id.startsWith('#') ? id.slice(1) : id
  const el = document.getElementById(clean)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── Format ── */
export function formatCurrency(amount, currency = 'USD') {
  if (!amount) return 'Free'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

/* ── Debounce ── */
export function debounce(fn, ms = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

/* ── Safe array ── */
export function safeArr(val) {
  return Array.isArray(val) ? val : []
}

/* ── Class join ── */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
