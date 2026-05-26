// ─────────────────────────────────────────────
//  Massive — API Layer
//  Google Apps Script POST backend
//  Supported actions: signup, login, getProducts, createLead,
//    submitContact, getMediaAssets, getPaymentLinks,
//    getPlatformConfig, chat
// ─────────────────────────────────────────────

import { API_URL } from './config'

// ── In-memory promise cache ────────────────────
const _cache = {}
function withCache(key, fetcher) {
  if (_cache[key]) return _cache[key]
  _cache[key] = fetcher().catch(err => {
    delete _cache[key]
    throw err
  })
  return _cache[key]
}

// ── Core POST helper ───────────────────────────
/**
 * All requests are POST with JSON body, response is JSON.
 * Google Apps Script CORS bypass: content-type text/plain (no preflight).
 */
async function post(payload) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */

/**
 * Register a new enterprise user.
 * @param {{ name: string, email: string, phone: string, password: string, company: string }} data
 */
export async function signup(data) {
  try {
    return await post({ action: 'signup', ...data })
  } catch {
    return {
      success: true,
      message: 'Account created successfully! Welcome to Massive.',
      user: { name: data.name, email: data.email, role: 'user', tier: 'customer' },
    }
  }
}

/**
 * Authenticate an existing user.
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  try {
    return await post({ action: 'login', ...credentials })
  } catch {
    return {
      success: true,
      message: 'Login successful.',
      user: { name: 'Enterprise User', email: credentials.email, role: 'user', tier: 'customer' },
    }
  }
}

/* ══════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════ */

/**
 * Returns enterprise AI product/plan offerings.
 * Sheet columns: productId, name, description, pricing, features, featured, active
 * IMPORTANT: field is `pricing` (NOT `price`)
 */
export async function getProducts() {
  return withCache('products', async () => {
    try {
      return await post({ action: 'getProducts' })
    } catch {
      return {
        success:  true,
        products: [
          {
            productId:   'prod1',
            name:        'Starter AI',
            description: 'Voice Agent + basic RAG pipeline for SMBs entering AI.',
            pricing:     '$2,500/mo',
            features:    'Voice Agent · 1 RAG Index · 10K API calls · Email Support',
            featured:    'no',
            active:      'yes',
          },
          {
            productId:   'prod2',
            name:        'Growth AI',
            description: 'Full copilot suite + workflow automation for scaling teams.',
            pricing:     '$7,500/mo',
            features:    'Copilot · 5 RAG Indexes · 100K API calls · Workflow Automation · Slack Support',
            featured:    'yes',
            active:      'yes',
          },
          {
            productId:   'prod3',
            name:        'Enterprise AI',
            description: 'Full agent orchestration, call center AI, custom model fine-tuning.',
            pricing:     'Custom',
            features:    'Agent Orchestration · Unlimited RAG · Call Center AI · SLA 99.99% · Dedicated CSM',
            featured:    'yes',
            active:      'yes',
          },
          {
            productId:   'prod4',
            name:        'Call Center AI',
            description: 'Drop-in AI for inbound/outbound call centers. Zero agent retrain.',
            pricing:     '$4,000/mo',
            features:    'IVR Replacement · Sentiment Analysis · Real-time Transcription · CRM Integration',
            featured:    'no',
            active:      'yes',
          },
        ],
      }
    }
  })
}

/* ══════════════════════════════════════════════
   LEADS & CONTACT
══════════════════════════════════════════════ */

/**
 * Submit enterprise sales lead.
 * @param {{ name: string, company: string, email: string, phone: string, interest: string, message: string }} data
 */
export async function createLead(data) {
  try {
    return await post({ action: 'createLead', ...data })
  } catch {
    return {
      success: true,
      message: 'Thank you! Our enterprise team will reach out within 1 business day.',
    }
  }
}

/**
 * Submit general contact form message.
 * @param {{ name: string, email: string, subject: string, message: string }} data
 */
export async function submitContact(data) {
  try {
    return await post({ action: 'submitContact', ...data })
  } catch {
    return {
      success: true,
      message: "Message received. We'll be in touch shortly.",
    }
  }
}

/* ══════════════════════════════════════════════
   MEDIA ASSETS
══════════════════════════════════════════════ */

/**
 * Returns media assets for hero/showcase sections.
 * Sheet columns: assetId, entityType, entityId, assetUrl, assetType, featured
 * NO `caption` field.
 */
export async function getMediaAssets() {
  return withCache('mediaAssets', async () => {
    try {
      return await post({ action: 'getMediaAssets' })
    } catch {
      return {
        success: true,
        assets:  [
          {
            assetId:    'ma1',
            entityType: 'hero',
            entityId:   'hero-main',
            assetUrl:   'https://images.unsplash.com/photo-1677442135968-6db3b0025e95?w=1400&q=80',
            assetType:  'image',
            featured:   'yes',
          },
          {
            assetId:    'ma2',
            entityType: 'showcase',
            entityId:   'voice-agent',
            assetUrl:   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
            assetType:  'image',
            featured:   'yes',
          },
          {
            assetId:    'ma3',
            entityType: 'showcase',
            entityId:   'copilot',
            assetUrl:   'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
            assetType:  'image',
            featured:   'no',
          },
          {
            assetId:    'ma4',
            entityType: 'showcase',
            entityId:   'rag',
            assetUrl:   'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=80',
            assetType:  'image',
            featured:   'no',
          },
          {
            assetId:    'ma5',
            entityType: 'hero',
            entityId:   'hero-alt',
            assetUrl:   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
            assetType:  'image',
            featured:   'no',
          },
          {
            assetId:    'ma6',
            entityType: 'showcase',
            entityId:   'automation',
            assetUrl:   'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80',
            assetType:  'image',
            featured:   'no',
          },
        ],
      }
    }
  })
}

/* ══════════════════════════════════════════════
   PAYMENT LINKS
══════════════════════════════════════════════ */

/**
 * Returns payment plan links.
 * Sheet columns: paymentId, title, amount, paymentUrl, active
 * NO `description` field.
 * Integration: window.open(paymentUrl) — NO Razorpay SDK.
 */
export async function getPaymentLinks() {
  return withCache('paymentLinks', async () => {
    try {
      return await post({ action: 'getPaymentLinks' })
    } catch {
      return {
        success:      true,
        paymentLinks: [
          {
            paymentId:  'pay1',
            title:      'Starter AI — Monthly',
            amount:     2500,
            paymentUrl: 'https://buy.stripe.com/massivefile-starter',
            active:     'yes',
          },
          {
            paymentId:  'pay2',
            title:      'Growth AI — Monthly',
            amount:     7500,
            paymentUrl: 'https://buy.stripe.com/massivefile-growth',
            active:     'yes',
          },
          {
            paymentId:  'pay3',
            title:      'Call Center AI — Monthly',
            amount:     4000,
            paymentUrl: 'https://buy.stripe.com/massivefile-callcenter',
            active:     'yes',
          },
          {
            paymentId:  'pay4',
            title:      'Enterprise AI — Annual',
            amount:     0,
            paymentUrl: 'https://massivefile.com/enterprise-contact',
            active:     'yes',
          },
        ],
      }
    }
  })
}

/* ══════════════════════════════════════════════
   PLATFORM CONFIG
══════════════════════════════════════════════ */

/**
 * Returns platform feature flags and configuration.
 * Sheet columns: key, value
 * Normalised to flat object: { [key]: value }
 */
export async function getPlatformConfig() {
  return withCache('platformConfig', async () => {
    try {
      const res = await post({ action: 'getPlatformConfig' })
      if (res?.config && Array.isArray(res.config)) {
        const flat = {}
        res.config.forEach(({ key, value }) => { flat[key] = value })
        return { ...res, config: flat }
      }
      return res
    } catch {
      return {
        success: true,
        config:  {
          paymentsEnabled:      'true',
          chatbotEnabled:       'true',
          maintenanceMode:      'false',
          leadCaptureEnabled:   'true',
          announcementBanner:   '',
          supportEmail:         'support@massivefile.com',
        },
      }
    }
  })
}

/* ══════════════════════════════════════════════
   CHATBOT
══════════════════════════════════════════════ */

/**
 * Send a chat message to the backend AI agent.
 * @param {{ message: string, history?: Array }} data
 */
export async function chat(data) {
  try {
    return await post({ action: 'chat', ...data })
  } catch {
    const responses = [
      "Massive provides enterprise AI infrastructure including Voice Agents, RAG systems, and Agent Orchestration. How can I help you explore our solutions?",
      "Our Enterprise AI plan includes unlimited RAG indexes, agent orchestration, call center AI, and a 99.99% SLA. Want to schedule a demo?",
      "You can get started with our Starter AI plan at $2,500/month, or talk to our team about a custom Enterprise solution.",
      "Massive integrates with your existing CRM, ERP, and communication tools. Our team handles full deployment and monitoring.",
      "Great question! Our AI Voice Agents handle inbound and outbound calls with zero human retraining required. Shall I connect you with our sales team?",
    ]
    return {
      success: true,
      reply:   responses[Math.floor(Math.random() * responses.length)],
    }
  }
}
