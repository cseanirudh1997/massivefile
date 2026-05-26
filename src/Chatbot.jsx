// ─────────────────────────────────────────────
//  Chatbot — floating AI assistant
//  Uses action:'chat' — backend matches ChatbotRules keywords
//  ChatbotRules sheet: keyword | response
// ─────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Zap, RotateCcw } from 'lucide-react'
import { chat, getPlatformConfig } from './api'
import { COMPANY_NAME } from './config'

const WELCOME = `Hi! I'm the ${COMPANY_NAME} AI assistant. Ask me anything about our Voice AI, Copilots, RAG Systems, or enterprise deployments.`

const SUGGESTED = [
  'Tell me about Voice AI',
  'Explain Massive RAG Studio',
  'How do enterprise deployments work?',
  'Show enterprise AI products',
]

export default function Chatbot() {
  const [open,      setOpen]     = useState(false)
  const [messages,  setMessages] = useState([{ role: 'bot', text: WELCOME, id: 0 }])
  const [input,     setInput]    = useState('')
  const [loading,   setLoading]  = useState(false)
  const [enabled,   setEnabled]  = useState(true)
  const [showSugg,  setShowSugg] = useState(true)
  const msgId       = useRef(1)
  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)

  // Check if chatbot is enabled via PlatformConfig
  useEffect(() => {
    getPlatformConfig().then(res => {
      if (res?.config?.chatbotEnabled === 'false') setEnabled(false)
    }).catch(() => {})
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    setInput('')
    setShowSugg(false)
    const userMsg = { role: 'user', text: msg, id: msgId.current++ }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await chat({ message: msg })
      const reply = res?.reply || res?.data?.reply || res?.message || "I'm having trouble connecting. Please try again."
      setMessages(prev => [...prev, { role: 'bot', text: reply, id: msgId.current++ }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't process that. Please try again.", id: msgId.current++ }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function reset() {
    setMessages([{ role: 'bot', text: WELCOME, id: msgId.current++ }])
    setShowSugg(true)
  }

  if (!enabled) return null

  return (
    <>
      {/* Toggle FAB */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-glow-lg"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={22} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0,  y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[400px] flex flex-col rounded-2xl overflow-hidden shadow-glow border border-brand-700/30 bg-gray-950/95 backdrop-blur-xl"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-gradient-to-r from-brand-950/60 to-accent-950/40 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm shrink-0">
                <Zap size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none">{COMPANY_NAME} AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  <span className="text-xs text-gray-500">Enterprise AI assistant</span>
                </div>
              </div>
              <button onClick={reset} className="p-1.5 text-gray-600 hover:text-gray-400 transition-colors" title="Reset chat">
                <RotateCcw size={13} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                >
                  {m.text}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="chat-bubble-bot flex items-center gap-1.5 py-3">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Suggested prompts */}
              {showSugg && messages.length <= 2 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {SUGGESTED.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs px-3 py-2 rounded-xl glass border border-white/8 text-gray-400 hover:text-brand-300 hover:border-brand-700/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/8 flex gap-2 shrink-0 bg-gray-950/60">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about our AI platform…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                disabled={loading}
                maxLength={500}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center text-white disabled:opacity-30 hover:from-brand-500 hover:to-accent-500 transition-all shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
