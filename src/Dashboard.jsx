// ─────────────────────────────────────────────
//  Dashboard — enterprise AI command center
//  Shows: products (title/category) · payment links · platform config · charts
// ─────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import {
  LayoutDashboard, Package, CreditCard, Settings, Zap,
  TrendingUp, Users, Activity, LogOut, ArrowUpRight,
  Mic, Bot, Database, Phone, Network, Workflow
} from 'lucide-react'
import { getProducts, getPaymentLinks, getPlatformConfig } from './api'
import { getSession, clearSession, safeArr, formatCurrency } from './utils'
import { COMPANY_NAME } from './config'

// ── Static mock metrics ──────────────────────
const API_SERIES = [
  { day: 'Mon', calls: 12400, latency: 72 },
  { day: 'Tue', calls: 18200, latency: 68 },
  { day: 'Wed', calls: 15800, latency: 81 },
  { day: 'Thu', calls: 22100, latency: 65 },
  { day: 'Fri', calls: 19600, latency: 74 },
  { day: 'Sat', calls: 9800,  latency: 69 },
  { day: 'Sun', calls: 7200,  latency: 77 },
]

const CATEGORY_DIST = [
  { name: 'Voice AI',            value: 38, color: '#22d3ee' },
  { name: 'Copilot',             value: 27, color: '#8b5cf6' },
  { name: 'RAG',                 value: 20, color: '#3b82f6' },
  { name: 'Call Center',         value: 15, color: '#10b981' },
]

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#111827', border: '1px solid rgba(34,211,238,0.15)',
    borderRadius: '12px', fontSize: '11px', color: '#e5e7eb',
  },
  labelStyle: { color: '#6b7280' },
  cursor:      { fill: 'rgba(34,211,238,0.05)' },
}

// ── Category icon map ────────────────────────
const CAT_ICONS = {
  'Voice AI':            { icon: Mic,      color: 'text-brand-400'   },
  'Enterprise Copilot':  { icon: Bot,      color: 'text-accent-400'  },
  'RAG Systems':         { icon: Database, color: 'text-blue-400'    },
  'Call Center AI':      { icon: Phone,    color: 'text-rose-400'    },
  'Agent Orchestration': { icon: Network,  color: 'text-violet-400'  },
  'Workflow Automation': { icon: Workflow, color: 'text-emerald-400' },
}

function getCatMeta(cat) {
  return CAT_ICONS[cat] || { icon: Package, color: 'text-brand-400' }
}

// ── Stat card ────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, trend, color = 'text-brand-400', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass border border-white/8 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{label}</span>
        <Icon size={14} className={color} />
      </div>
      <div className={`text-2xl font-bold font-display ${color} mb-0.5`}>{value}</div>
      {sub && <div className="text-xs text-gray-600">{sub}</div>}
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
          <ArrowUpRight size={11} /> {trend}
        </div>
      )}
    </motion.div>
  )
}

// ── Tabs ─────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'products',  label: 'Products',  icon: Package         },
  { id: 'payments',  label: 'Payments',  icon: CreditCard      },
  { id: 'config',    label: 'Config',    icon: Settings        },
]

export default function Dashboard() {
  const [products,  setProducts]  = useState([])
  const [links,     setLinks]     = useState([])
  const [config,    setConfig]    = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [loading,   setLoading]   = useState(true)
  const { username, email, tier } = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProducts(), getPaymentLinks(), getPlatformConfig()])
      .then(([pRes, lRes, cRes]) => {
        setProducts(safeArr(pRes?.products || pRes?.data?.products || pRes?.data))
        setLinks(safeArr(lRes?.paymentLinks || lRes?.data?.paymentLinks || lRes?.data))
        setConfig(cRes?.config || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  const totalRevenue = useMemo(
    () => links.filter(l => l.active === 'yes' && Number(l.amount) > 0).reduce((s, l) => s + Number(l.amount), 0),
    [links]
  )

  return (
    <div className="min-h-screen animated-bg circuit-grid">

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-white/8">
        <div className="section-wrapper flex items-center justify-between h-14 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-white hidden sm:block">{COMPANY_NAME}</span>
            <span className="text-gray-700 text-xs hidden sm:block">/ Command Center</span>
          </Link>

          <div className="flex items-center gap-3 overflow-hidden">
            {email && <span className="text-xs text-gray-600 hidden md:block truncate max-w-[160px]">{email}</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-900/40 border border-brand-700/25 text-brand-400 font-mono shrink-0">{tier}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 glass border border-white/8 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="section-wrapper py-8">
        {/* Welcome */}
        <div className="mb-7">
          <h1 className="font-display text-2xl font-bold text-white">
            Welcome back,&nbsp;
            <span className="gradient-text">{username || 'Enterprise User'}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your AI infrastructure command center</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 glass border border-white/8 rounded-xl w-fit mb-8 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-brand-600/30 border border-brand-600/40 text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Activity}    label="API Calls Today"   value="22.1K"  sub="↑ 12% vs yesterday" trend="12% this week"    color="text-brand-400"   delay={0}    />
              <StatCard icon={TrendingUp}  label="Avg Latency"       value="74ms"   sub="SLA target: <100ms"  trend="7ms improvement"  color="text-emerald-400" delay={0.06} />
              <StatCard icon={Users}       label="Active Agents"     value="24"     sub="8 orchestrators"                              color="text-accent-400"  delay={0.12} />
              <StatCard icon={Zap}         label="30-day Uptime"     value="99.99%" sub="SLA met"             trend="All systems go"   color="text-brand-300"   delay={0.18} />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-5">
              {/* API calls area chart */}
              <div className="lg:col-span-2 glass border border-white/8 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity size={13} className="text-brand-400" /> API Calls — Last 7 Days
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={API_SERIES} margin={{ left: -16 }}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day"   tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString(), 'API Calls']} />
                    <Area type="monotone" dataKey="calls" stroke="#22d3ee" strokeWidth={2} fill="url(#cyanGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category distribution pie */}
              <div className="glass border border-white/8 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-4">Usage by Product</p>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={CATEGORY_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                      {CATEGORY_DIST.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {CATEGORY_DIST.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-gray-500">{name}</span>
                      </div>
                      <span className="text-gray-400 font-mono">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latency bar chart */}
            <div className="glass border border-white/8 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={13} className="text-accent-400" /> Response Latency ms — Last 7 Days
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={API_SERIES} margin={{ left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={v => [`${v}ms`, 'Latency']} />
                  <Bar dataKey="latency" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Package size={13} className="text-brand-400" />
                {loading ? 'Loading…' : `${products.length} product(s) in catalogue`}
              </p>
            </div>
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="glass border border-white/5 rounded-xl p-4 h-16 shimmer" />
                ))
              : products.map((p, i) => {
                  const { icon: Icon, color } = getCatMeta(p.category)
                  return (
                    <motion.div
                      key={p.productId || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass border border-white/8 rounded-xl p-4 flex items-center gap-4"
                    >
                      <Icon size={15} className={`${color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{p.title}</span>
                          {p.featured === 'yes' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-300">Featured</span>
                          )}
                          {p.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-500">{p.category}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 truncate">{p.description}</p>
                      </div>
                      <div className="text-sm font-bold text-brand-400 font-display shrink-0">{p.pricing}</div>
                    </motion.div>
                  )
                })
            }
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
              <CreditCard size={13} className="text-accent-400" />
              {loading ? 'Loading…' : `${links.length} payment plan(s) · Estimated pipeline: ${formatCurrency(totalRevenue)}`}
            </p>
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="glass border border-white/5 rounded-xl p-4 h-16 shimmer" />
                ))
              : links.map((l, i) => {
                  const isCustom = !l.amount || Number(l.amount) === 0
                  return (
                    <motion.div
                      key={l.paymentId || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass border border-white/8 rounded-xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{l.title}</p>
                        <p className="text-xs text-gray-600 font-mono mt-0.5">
                          {isCustom ? 'Custom pricing' : `${formatCurrency(Number(l.amount))} · one-time`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                          l.active === 'yes'
                            ? 'bg-emerald-900/30 border-emerald-700/30 text-emerald-400'
                            : 'bg-red-900/30 border-red-700/30 text-red-400'
                        }`}>
                          {l.active === 'yes' ? 'Active' : 'Inactive'}
                        </span>
                        {!isCustom && l.paymentUrl && (
                          <button
                            onClick={() => window.open(l.paymentUrl, '_blank', 'noopener,noreferrer')}
                            className="btn-secondary py-1 px-3 text-xs"
                          >
                            Open Link
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })
            }
          </div>
        )}

        {/* ── CONFIG ── */}
        {activeTab === 'config' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
              <Settings size={13} className="text-gray-500" /> Platform configuration (read-only)
            </p>
            <div className="glass border border-white/8 rounded-xl overflow-hidden">
              {Object.entries(config).length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-600">No config loaded.</div>
              ) : (
                Object.entries(config).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-white/5' : ''}`}
                  >
                    <span className="text-xs text-gray-500 font-mono">{key}</span>
                    <span className={`text-xs font-mono px-2.5 py-0.5 rounded-lg ${
                      value === 'true'  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/20' :
                      value === 'false' ? 'bg-red-900/30 text-red-400 border border-red-700/20' :
                      'bg-white/5 text-gray-300 border border-white/8'
                    }`}>
                      {value || '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
