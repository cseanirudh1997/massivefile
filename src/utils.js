// ─────────────────────────────────────────────
//  Massive — Utility Helpers
// ─────────────────────────────────────────────

import { STORAGE_KEYS } from './config'

/* ── Session ── */
export function saveSession(data) {
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) localStorage.setItem(key, val)
  })
}

export function getSession() {
  return {
    isLoggedIn: localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true',
    username:   localStorage.getItem(STORAGE_KEYS.USERNAME) || '',
    email:      localStorage.getItem(STORAGE_KEYS.EMAIL)    || '',
    role:       localStorage.getItem(STORAGE_KEYS.ROLE)     || 'user',
    phone:      localStorage.getItem(STORAGE_KEYS.PHONE)    || '',
    tier:       localStorage.getItem(STORAGE_KEYS.TIER)     || 'customer',
  }
}

export function clearSession() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
}

/* ── Validation ── */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone) {
  return /^\+?[\d\s\-().]{7,}$/.test(phone)
}

/* ── Scroll ── */
export function scrollToSection(id) {
  const el = document.getElementById(id.replace('#', ''))
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── Format ── */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/* ── Debounce ── */
export function debounce(fn, ms = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
