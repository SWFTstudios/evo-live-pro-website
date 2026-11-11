import type { Access, FieldAccess } from 'payload'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminFieldAccess: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const anyone: Access = () => true

export const adminOrSelf: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}
