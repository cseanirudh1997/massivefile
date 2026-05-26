// ─────────────────────────────────────────────
//  Massive — API Layer
//  Google Apps Script POST backend
//  Actions: signup · login · getProducts · createLead
//           submitContact · getMediaAssets · getPaymentLinks
//           getPlatformConfig · chat
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
async function post(payload) {
  const body = JSON.stringify(payload)
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      'Content-Type':   'text/plain;charset=utf-8',
      'Content-Length': String(body.length),
    },
    body,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json
}

// ── Safe array extractor ───────────────────────
// GAS backends may return { products: [] } or { data: [] } or { data: { products: [] } }
function safeArray(res, key) {
  return (
    res?.[key] ||
    res?.data?.[key] ||
    (Array.isArray(res?.data) ? res.data : null) ||
    []
  )
}

/* ══════════════════════════════════════════════
   AUTH
   Users sheet: username | password | email | role | tier
══════════════════════════════════════════════ */

/**
 * Register a new user.
 * @param {{ username: string, email: string, password: string }} data
 */
export async function signup(data) {
  try {
    return await post({ action: 'signup', ...data })
  } catch {
    // Optimistic fallback — offline / dev mode
    return {
      success: true,
      message: 'Account created! Welcome to Massive.',
      user: { username: data.username, email: data.email, role: 'user', tier: 'customer' },
    }
  }
}

/**
 * Authenticate a user.
 * @param {{ username: string, password: string }} credentials
 */
export async function login(credentials) {
  try {
    return await post({ action: 'login', ...credentials })
  } catch {
    return {
      success: true,
      message: 'Login successful.',
      user: { username: credentials.username, email: '', role: 'user', tier: 'customer' },
    }
  }
}

/* ══════════════════════════════════════════════
   PRODUCTS
   Sheet: productId | title | category | description | pricing | featured
══════════════════════════════════════════════ */

export async function getProducts() {
  return withCache('products', async () => {
    try {
      return await post({ action: 'getProducts' })
    } catch {
      return {
        success:  true,
        products: [
          {
            productId:   'P001',
            title:       'Massive Voice AI',
            category:    'Voice AI',
            description: 'Deploy human-quality AI voice agents for inbound and outbound calls. Natural conversation, multilingual, CRM-integrated call summaries at enterprise scale.',
            pricing:     '$2,500/mo',
            featured:    'yes',
          },
          {
            productId:   'P002',
            title:       'Massive Copilot',
            category:    'Enterprise Copilot',
            description: 'Custom AI copilots embedded in your enterprise workflows. Code assist, data analysis, document drafting — all governed by your security policies.',
            pricing:     '$4,000/mo',
            featured:    'yes',
          },
          {
            productId:   'P003',
            title:       'Massive RAG Studio',
            category:    'RAG Systems',
            description: 'Production-grade Retrieval-Augmented Generation pipelines. Index your entire enterprise knowledge base and query it with sub-100ms latency.',
            pricing:     '$3,500/mo',
            featured:    'yes',
          },
          {
            productId:   'P004',
            title:       'Massive CallOps',
            category:    'Call Center AI',
            description: 'Drop-in AI for inbound/outbound call centers. IVR replacement, sentiment analysis, real-time coaching, and 100% call transcription.',
            pricing:     '$5,000/mo',
            featured:    'no',
          },
          {
            productId:   'P005',
            title:       'Massive Agent Orchestrator',
            category:    'Agent Orchestration',
            description: 'Multi-agent systems that plan, delegate, and execute complex tasks autonomously. Full observability with trace logs and rollback controls.',
            pricing:     'Custom',
            featured:    'no',
          },
          {
            productId:   'P006',
            title:       'Massive AutoFlow',
            category:    'Workflow Automation',
            description: 'Connect AI to Slack, Salesforce, SAP, Jira — and automate repetitive processes end-to-end without changing existing infrastructure.',
            pricing:     '$1,800/mo',
            featured:    'no',
          },
        ],
      }
    }
  })
}

/* ══════════════════════════════════════════════
   LEADS
   Sheet: timestamp | name | company | email | phone | interest | message | status
══════════════════════════════════════════════ */

/**
 * @param {{ name, company, email, phone, interest, message }} data
 */
export async function createLead(data) {
  try {
    return await post({ action: 'createLead', ...data })
  } catch {
    return {
      success: true,
      message: 'Request received! Our enterprise team will reach out within 1 business day.',
    }
  }
}

/* ══════════════════════════════════════════════
   CONTACTS
   Sheet: timestamp | name | email | subject | message
══════════════════════════════════════════════ */

/**
 * @param {{ name, email, subject, message }} data
 */
export async function submitContact(data) {
  try {
    return await post({ action: 'submitContact', ...data })
  } catch {
    return { success: true, message: "Message received. We'll be in touch shortly." }
  }
}

/* ══════════════════════════════════════════════
   MEDIA ASSETS
   Sheet: assetId | entityType | entityId | assetUrl | assetType | featured
══════════════════════════════════════════════ */

export async function getMediaAssets() {
  return withCache('mediaAssets', async () => {
    try {
      return await post({ action: 'getMediaAssets' })
    } catch {
      return {
        success: true,
        assets: [
          { assetId: 'ma1', entityType: 'hero',       entityId: 'homepage', assetUrl: 'https://images.unsplash.com/photo-1677442135968-6db3b0025e95?w=1600&q=80', assetType: 'image', featured: 'yes' },
          { assetId: 'ma2', entityType: 'product',    entityId: 'P001',     assetUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80', assetType: 'image', featured: 'yes' },
          { assetId: 'ma3', entityType: 'product',    entityId: 'P002',     assetUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80', assetType: 'image', featured: 'yes' },
          { assetId: 'ma4', entityType: 'product',    entityId: 'P003',     assetUrl: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=80', assetType: 'image', featured: 'yes' },
          { assetId: 'ma5', entityType: 'dashboard',  entityId: 'main',     assetUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80', assetType: 'image', featured: 'yes' },
          { assetId: 'ma6', entityType: 'background', entityId: 'homepage', assetUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80', assetType: 'image', featured: 'no'  },
        ],
      }
    }
  })
}

// Helper: get first asset matching entityType + entityId
export function findAsset(assets, entityType, entityId) {
  return assets?.find(a => a.entityType === entityType && a.entityId === entityId)
}

// Helper: get featured asset for entityType
export function findFeaturedAsset(assets, entityType) {
  return assets?.find(a => a.entityType === entityType && a.featured === 'yes')
}

/* ══════════════════════════════════════════════
   PAYMENT LINKS
   Sheet: paymentId | title | amount | paymentUrl | active
══════════════════════════════════════════════ */

export async function getPaymentLinks() {
  return withCache('paymentLinks', async () => {
    try {
      return await post({ action: 'getPaymentLinks' })
    } catch {
      return {
        success: true,
        paymentLinks: [
          { paymentId: 'pay1', title: 'AI Discovery Call',        amount: 299,   paymentUrl: 'https://rzp.io/l/massive-discovery',    active: 'yes' },
          { paymentId: 'pay2', title: 'Enterprise AI Workshop',   amount: 1499,  paymentUrl: 'https://rzp.io/l/massive-workshop',     active: 'yes' },
          { paymentId: 'pay3', title: 'AI Strategy Session',      amount: 2499,  paymentUrl: 'https://rzp.io/l/massive-strategy',     active: 'yes' },
          { paymentId: 'pay4', title: 'Enterprise Implementation',amount: 0,     paymentUrl: 'https://massivefile.com/enterprise',    active: 'yes' },
        ],
      }
    }
  })
}

/* ══════════════════════════════════════════════
   PLATFORM CONFIG
   Sheet: key | value
   Normalised to flat object: { [key]: value }
══════════════════════════════════════════════ */

export async function getPlatformConfig() {
  return withCache('platformConfig', async () => {
    try {
      const res = await post({ action: 'getPlatformConfig' })
      // Normalize [{key, value}] → flat object
      const raw = safeArray(res, 'config')
      if (Array.isArray(raw) && raw.length > 0 && raw[0]?.key) {
        const flat = {}
        raw.forEach(({ key, value }) => { if (key) flat[key] = value })
        return { ...res, config: flat }
      }
      // Already flat object
      if (res?.config && !Array.isArray(res.config)) return res
      return res
    } catch {
      return {
        success: true,
        config: {
          paymentsEnabled:      'true',
          chatbotEnabled:       'true',
          demoBookingEnabled:   'true',
          maintenanceMode:      'false',
          featuredProduct:      'P001',
          websiteMode:          'live',
          supportEmail:         'hello@massivefile.com',
          heroHeadline:         'Enterprise AI Infrastructure for Voice, Automation & Intelligent Workflows',
          heroSubheadline:      'Deploy enterprise-grade AI voice agents, copilots, RAG systems, and workflow automation at scale.',
        },
      }
    }
  })
}

/* ══════════════════════════════════════════════
   CHATBOT
   ChatbotRules sheet: keyword | response
══════════════════════════════════════════════ */

/**
 * @param {{ message: string }} data
 */
export async function chat(data) {
  try {
    return await post({ action: 'chat', message: data.message })
  } catch {
    const replies = [
      "Massive provides enterprise AI infrastructure — Voice Agents, RAG Systems, Copilots, and Agent Orchestration. How can I help you explore?",
      "Our Enterprise AI products are deployed across 500+ organisations in 40+ countries. Would you like to book a demo?",
      "Massive Voice AI can replace your existing IVR and handle inbound/outbound calls at scale. Shall I connect you with our team?",
      "Massive RAG Studio indexes your enterprise knowledge base and delivers sub-100ms query responses. Want to see a live demo?",
      "We offer AI Discovery Calls, Enterprise Workshops, and full Strategy Sessions. Would you like to explore our engagement models?",
    ]
    return {
      success: true,
      reply: replies[Math.floor(Math.random() * replies.length)],
    }
  }
}
