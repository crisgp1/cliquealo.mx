import { redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'
import { ClerkRoles } from './clerk-roles.server'
import { ensureUserSynced } from './clerk-sync.server'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { User } from '~/models/User.server'

/**
 * Obtiene el usuario autenticado desde Clerk y la base de datos
 */
export async function getClerkUser(args: LoaderFunctionArgs | ActionFunctionArgs): Promise<User | null> {
  const { userId } = await getAuth(args)
  
  if (!userId) return null
  
  // Asegurar que el usuario esté sincronizado
  return await ensureUserSynced(userId)
}

/**
 * Requiere que el usuario esté autenticado
 */
export async function requireClerkUser(args: LoaderFunctionArgs | ActionFunctionArgs): Promise<User> {
  const user = await getClerkUser(args)
  
  if (!user) {
    throw redirect('/?signin=true')
  }
  
  return user
}

/**
 * Requiere que el usuario sea admin o superadmin
 */
export async function requireClerkAdmin(args: LoaderFunctionArgs | ActionFunctionArgs): Promise<User> {
  const user = await requireClerkUser(args)
  
  if (!ClerkRoles.canAccessAdminPanel(user.role)) {
    throw redirect('/?error=unauthorized')
  }
  
  return user
}

/**
 * Requiere que el usuario sea superadmin
 */
export async function requireClerkSuperAdmin(args: LoaderFunctionArgs | ActionFunctionArgs): Promise<User> {
  const user = await requireClerkUser(args)
  
  if (user.role !== 'superadmin') {
    throw redirect('/?error=unauthorized')
  }
  
  return user
}

/**
 * Funciones de autorización compatibles con el sistema anterior
 */
export const ClerkAuth = {
  /**
   * Verifica si un usuario puede crear listings
   */
  canCreateListings(user: User | null): boolean {
    if (!user) return false
    return ClerkRoles.canCreateListings(user.role)
  },

  /**
   * Verifica si un usuario puede editar un listing específico
   */
  canEditListing(user: User | null, listing: any): boolean {
    if (!user) return false
    return ClerkRoles.canEditListing(user.role, listing, user._id!.toString())
  },

  /**
   * Verifica si un usuario puede eliminar un listing específico
   */
  canDeleteListing(user: User | null, listing: any): boolean {
    return this.canEditListing(user, listing)
  },

  /**
   * Verifica si un usuario puede gestionar otros usuarios
   */
  canManageUsers(user: User | null): boolean {
    if (!user) return false
    return ClerkRoles.canManageUsers(user.role)
  },

  /**
   * Verifica si un usuario puede ver el panel de administración
   */
  canAccessAdminPanel(user: User | null): boolean {
    if (!user) return false
    return ClerkRoles.canAccessAdminPanel(user.role)
  },

  /**
   * Obtiene información del rol del usuario
   */
  getRoleInfo(user: User | null) {
    if (!user) return { role: 'guest', level: 0, label: 'Invitado' }
    
    const roleMap = {
      user: { role: 'user', level: 1, label: 'Usuario' },
      admin: { role: 'admin', level: 2, label: 'Administrador' },
      superadmin: { role: 'superadmin', level: 3, label: 'Super Administrador' }
    }
    
    return roleMap[user.role] || roleMap.user
  }
}