// ─────────────────────────────────────────────
//  App — HashRouter routes + HomePage section order
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

/* ── Homepage — assembles all sections ── */
function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Products />
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
        toastOptions={{
          style: {
            background: '#111827',
            color:      '#f9fafb',
            border:     '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize:   '13px',
          },
        }}
      />

      <Routes>
        {/* Public routes with Navbar + Footer + Chatbot */}
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

        {/* Auth routes — no chrome */}
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard */}
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
