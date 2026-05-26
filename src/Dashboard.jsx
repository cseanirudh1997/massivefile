// ─────────────────────────────────────────────
//  Dashboard — enterprise command center
//  Shows: products + paymentLinks + platformConfig + static mock charts
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { LayoutDashboard, Package, CreditCard, Settings, Zap, TrendingUp, Users, Activity, LogOut } from 'lucide-react'
import { getProducts, getPaymentLinks, getPlatformConfig } from './api'
import { getSession, clearSession } from './utils'
import { useNavigate } from 'react-router-dom'
import { COMPANY_NAME } from './config'

// ── Static mock chart data ────────────────────
const API_CALLS = [
  { day: 'Mon', calls: 12400 }, { day: 'Tue', calls: 18200 }, { day: 'Wed', calls: 15800 },
  { day: 'Thu', calls: 22100 }, { day: 'Fri', calls: 19600 }, { day: 'Sat', calls: 9800 },
  { day: 'Sun', calls: 7200 },
]
const LATENCY = [
  { day: 'Mon', ms: 72 }, { day: 'Tue', ms: 68 }, { day: 'Wed', ms: 81 },
  { day: 'Thu', ms: 65 }, { day: 'Fri', ms: 74 }, { day: 'Sat', ms: 69 }, { day: 'Sun', ms: 77 },
]

const TOOLTIP_STYLE = {
  contentStyle: { background: '#111827', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '10px', fontSize: '11px' },
  labelStyle:   { color: '#9ca3af' },
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-brand-400' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass border border-white/8 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <Icon size={14} className={color} />
      </div>
      <div className={`text-2xl font-bold font-display ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

export default function Dashboard() {
  const [products,  setProducts]  = useState([])
  const [links,     setLinks]     = useState([])
  const [config,    setConfig]    = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const { username, email, tier } = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProducts(), getPaymentLinks(), getPlatformConfig()]).then(([pRes, lRes, cRes]) => {
      setProducts(pRes?.products  || [])
      setLinks(   lRes?.paymentLinks || [])
      setConfig(  cRes?.config    || {})
    }).catch(() => {})
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  const TABS = ['overview', 'products', 'payments', 'config']

  return (
    <div className="min-h-screen animated-bg circuit-grid">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-white/8">
        <div className="section-wrapper flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-white">{COMPANY_NAME}</span>
            <span className="text-gray-700 ml-1">/ Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{email}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-900/40 border border-brand-700/30 text-brand-400 font-mono">{tier}</span>
            <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300 p-1.5">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="section-wrapper py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{username || 'Enterprise User'}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your AI infrastructure command center</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass border border-white/8 rounded-xl w-fit mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-brand-600/30 border border-brand-600/40 text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Activity}    label="API Calls Today"   value="22.1K"  sub="↑ 12% vs yesterday" color="text-brand-400" />
              <StatCard icon={TrendingUp}  label="Avg Latency"       value="74ms"   sub="Well under SLA"     color="text-emerald-400" />
              <StatCard icon={Users}       label="Active Agents"     value="12"     sub="4 orchestrators"    color="text-accent-400" />
              <StatCard icon={Zap}         label="Uptime (30d)"      value="99.99%" sub="SLA met"            color="text-brand-300" />
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="glass border border-white/8 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity size={13} className="text-brand-400" /> API Calls (7 days)
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={API_CALLS}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day"   tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString(), 'Calls']} />
                    <Area type="monotone" dataKey="calls" stroke="#22d3ee" strokeWidth={2} fill="url(#cyanGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass border border-white/8 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={13} className="text-accent-400" /> Response Latency ms (7 days)
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={LATENCY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={v => [`${v}ms`, 'Latency']} />
                    <Bar dataKey="ms" fill="#8b5cf6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2"><Package size={13} /> {products.length} product(s) available</p>
            {products.map((p, i) => (
              <motion.div
                key={p.productId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass border border-white/8 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{p.name}</span>
                    {p.featured === 'yes' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-300">Popular</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{p.description}</p>
                </div>
                <div className="text-sm font-bold text-brand-400 font-display shrink-0">{p.pricing}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2"><CreditCard size={13} /> {links.length} payment plan(s)</p>
            {links.map((l, i) => (
              <motion.div
                key={l.paymentId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass border border-white/8 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{l.title}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {l.amount > 0 ? `$${l.amount.toLocaleString()}/mo` : 'Custom pricing'}
                  </p>
                </div>
                {l.amount > 0 && (
                  <button
                    onClick={() => window.open(l.paymentUrl, '_blank', 'noopener,noreferrer')}
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    Subscribe
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* CONFIG */}
        {activeTab === 'config' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2"><Settings size={13} /> Platform configuration</p>
            <div className="glass border border-white/8 rounded-xl overflow-hidden">
              {Object.entries(config).map(([key, value], i) => (
                <div key={key} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? 'border-t border-white/5' : ''}`}>
                  <span className="text-gray-400 font-mono text-xs">{key}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                    value === 'true'  ? 'bg-emerald-900/30 text-emerald-400' :
                    value === 'false' ? 'bg-red-900/30 text-red-400' :
                    'bg-white/5 text-gray-300'
                  }`}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
