// ─────────────────────────────────────────────
//  App — HashRouter routes
// ─────────────────────────────────────────────

import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar          from './Navbar'
import Footer          from './Footer'
import Chatbot         from './Chatbot'

import Hero            from './Hero'
import Capabilities    from './Capabilities'
import Products        from './Products'
import UseCases        from './UseCases'
import Workflow        from './Workflow'
import ProductShowcase from './ProductShowcase'
import Payments        from './Payments'
import Contact         from './Contact'

import Login           from './Login'
import Signup          from './Signup'
import Dashboard       from './Dashboard'
import ProtectedRoute  from './ProtectedRoute'

function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Products />
      <Capabilities />
      <UseCases />
      <Workflow />
      <ProductShowcase />
      <Payments />
      <Contact />
    </main>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background:   '#0f1117',
            color:        '#f9fafb',
            border:       '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize:     '13px',
            boxShadow:    '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#22d3ee', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* Public — with Navbar + Footer + Chatbot */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
              <Chatbot />
            </>
          }
        />

        {/* Auth — full screen, no chrome */}
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}
