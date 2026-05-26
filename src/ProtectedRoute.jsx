// ─────────────────────────────────────────────
//  ProtectedRoute — redirect unauthenticated users
// ─────────────────────────────────────────────

import { Navigate } from 'react-router-dom'
import { getSession } from './utils'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = getSession()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}
