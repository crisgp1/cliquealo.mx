import { useUser } from '@clerk/remix'
import { useMemo } from 'react'

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface RoleInfo {
  role: UserRole
  level: number
  label: string
  isUser: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  canCreateListings: boolean
  canAccessAdminPanel: boolean
  canManageUsers: boolean
}

/**
 * Hook para obtener información del rol del usuario desde Clerk
 */
export function useClerkRole(): RoleInfo {
  const { user } = useUser()
  
  const roleInfo = useMemo(() => {
    // Obtener rol desde metadata de Clerk
    const role = (user?.publicMetadata?.role as UserRole) || 'user'
    
    const roleMap = {
      user: { level: 1, label: 'Usuario' },
      admin: { level: 2, label: 'Administrador' },
      superadmin: { level: 3, label: 'Super Administrador' }
    }
    
    const info = roleMap[role] || roleMap.user
    
    return {
      role,
      level: info.level,
      label: info.label,
      isUser: role === 'user',
      isAdmin: role === 'admin' || role === 'superadmin',
      isSuperAdmin: role === 'superadmin',
      canCreateListings: role === 'admin' || role === 'superadmin',
      canAccessAdminPanel: role === 'admin' || role === 'superadmin',
      canManageUsers: role === 'superadmin'
    }
  }, [user?.publicMetadata?.role])
  
  return roleInfo
}

/**
 * Hook para verificar permisos específicos
 */
export function usePermissions() {
  const roleInfo = useClerkRole()
  
  return {
    ...roleInfo,
    hasPermission: (permission: string): boolean => {
      const permissions = {
        user: ['view_listings', 'like_listings', 'edit_profile'],
        admin: [
          'view_listings', 'like_listings', 'edit_profile',
          'create_listings', 'edit_own_listings', 'delete_own_listings',
          'view_admin_panel', 'manage_credit_applications'
        ],
        superadmin: [
          'view_listings', 'like_listings', 'edit_profile',
          'create_listings', 'edit_own_listings', 'delete_own_listings',
          'view_admin_panel', 'manage_credit_applications',
          'edit_any_listing', 'delete_any_listing', 'manage_users',
          'change_user_roles', 'view_system_stats'
        ]
      }
      
      return permissions[roleInfo.role]?.includes(permission) || false
    }
  }
}