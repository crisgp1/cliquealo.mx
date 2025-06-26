import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Chip, Avatar } from '@heroui/react'
import { Users, Shield, Crown, User } from 'lucide-react'
import { useClerkRole } from '~/hooks/useClerkRole'
import type { User as UserType } from '~/models/User.server'

interface RoleManagerProps {
  users: any[] // Usar any[] para compatibilidad con datos serializados de Remix
}

export default function RoleManager({ users }: RoleManagerProps) {
  const { isSuperAdmin } = useClerkRole()
  const fetcher = useFetcher()
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')

  const handleRoleChange = () => {
    if (!selectedUser || !selectedRole) return

    fetcher.submit(
      {
        intent: 'change-role',
        userId: selectedUser,
        newRole: selectedRole
      },
      {
        method: 'post',
        action: '/api/change-role'
      }
    )

    // Reset form
    setSelectedUser('')
    setSelectedRole('')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'warning'
      case 'admin':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin'
      case 'admin':
        return 'Administrador'
      default:
        return 'Usuario'
    }
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tienes permisos para gestionar roles</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cambiar Rol */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Cambiar Rol de Usuario</h3>
          </div>
        </CardHeader>
        <CardBody>
          <fetcher.Form method="post" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Seleccionar Usuario"
                placeholder="Elegir usuario"
                selectedKeys={selectedUser ? [selectedUser] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string
                  setSelectedUser(key)
                }}
              >
                {users.map((user) => (
                  <SelectItem
                    key={user._id!.toString()}
                    startContent={
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size="sm"
                      />
                    }
                    endContent={
                      <Chip
                        size="sm"
                        color={getRoleColor(user.role)}
                        variant="flat"
                        startContent={getRoleIcon(user.role)}
                      >
                        {getRoleLabel(user.role)}
                      </Chip>
                    }
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Nuevo Rol"
                placeholder="Seleccionar rol"
                selectedKeys={selectedRole ? [selectedRole] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string
                  setSelectedRole(key)
                }}
              >
                <SelectItem
                  key="user"
                  startContent={<User className="w-4 h-4 text-gray-600" />}
                >
                  Usuario
                </SelectItem>
                <SelectItem
                  key="admin"
                  startContent={<Shield className="w-4 h-4 text-blue-600" />}
                >
                  Administrador
                </SelectItem>
                <SelectItem
                  key="superadmin"
                  startContent={<Crown className="w-4 h-4 text-yellow-600" />}
                >
                  Super Administrador
                </SelectItem>
              </Select>

              <Button
                color="primary"
                onPress={handleRoleChange}
                isDisabled={!selectedUser || !selectedRole || fetcher.state !== 'idle'}
                isLoading={fetcher.state !== 'idle'}
              >
                Cambiar Rol
              </Button>
            </div>
          </fetcher.Form>

          {(fetcher.data as any)?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{(fetcher.data as any).error}</p>
            </div>
          )}

          {(fetcher.data as any)?.success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Rol actualizado correctamente</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Usuarios del Sistema</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id!.toString()}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-gray-400">{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Chip
                    color={getRoleColor(user.role)}
                    variant="flat"
                    startContent={getRoleIcon(user.role)}
                  >
                    {getRoleLabel(user.role)}
                  </Chip>
                  
                  <div className="text-xs text-gray-400">
                    {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}