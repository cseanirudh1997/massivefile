// ─────────────────────────────────────────────
//  ProtectedRoute — redirect unauthenticated users
// ─────────────────────────────────────────────

import { Navigate } from 'react-router-dom'
import { getSession } from './utils'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = getSession()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}
