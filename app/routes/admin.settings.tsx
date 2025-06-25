import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { requireClerkAdmin } from "~/lib/auth-clerk.server"
import { AdminLayout } from "~/components/admin/AdminLayout"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { 
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Bell,
  Palette,
  Server,
  Key,
  Users,
  FileText,
  Save
} from "lucide-react"

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireClerkAdmin(args)
  
  // En el futuro, aquí se pueden cargar configuraciones desde la base de datos
  const settings = {
    siteName: "Cliquéalo.mx",
    siteDescription: "Plataforma de compra y venta de vehículos",
    adminEmail: "admin@cliquealo.mx",
    supportEmail: "soporte@cliquealo.mx",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    maxFileSize: "10MB",
    allowedFileTypes: "jpg,jpeg,png,webp,pdf",
    theme: "light",
    language: "es"
  }

  return json({ settings, user })
}

export default function AdminSettings() {
  const { settings, user } = useLoaderData<typeof loader>()

  const settingSections = [
    {
      title: "Configuración General",
      icon: Settings,
      description: "Configuraciones básicas del sitio",
      settings: [
        { key: "siteName", label: "Nombre del Sitio", type: "text", value: settings.siteName },
        { key: "siteDescription", label: "Descripción", type: "textarea", value: settings.siteDescription },
        { key: "language", label: "Idioma", type: "select", value: settings.language, options: [
          { value: "es", label: "Español" },
          { value: "en", label: "English" }
        ]}
      ]
    },
    {
      title: "Configuración de Email",
      icon: Mail,
      description: "Configuraciones de correo electrónico",
      settings: [
        { key: "adminEmail", label: "Email de Administrador", type: "email", value: settings.adminEmail },
        { key: "supportEmail", label: "Email de Soporte", type: "email", value: settings.supportEmail },
        { key: "emailNotifications", label: "Notificaciones por Email", type: "checkbox", value: settings.emailNotifications }
      ]
    },
    {
      title: "Configuración de Seguridad",
      icon: Shield,
      description: "Configuraciones de seguridad y acceso",
      settings: [
        { key: "registrationEnabled", label: "Registro Habilitado", type: "checkbox", value: settings.registrationEnabled },
        { key: "maintenanceMode", label: "Modo Mantenimiento", type: "checkbox", value: settings.maintenanceMode }
      ]
    },
    {
      title: "Configuración de Archivos",
      icon: FileText,
      description: "Configuraciones de carga de archivos",
      settings: [
        { key: "maxFileSize", label: "Tamaño Máximo de Archivo", type: "text", value: settings.maxFileSize },
        { key: "allowedFileTypes", label: "Tipos de Archivo Permitidos", type: "text", value: settings.allowedFileTypes }
      ]
    },
    {
      title: "Notificaciones",
      icon: Bell,
      description: "Configuraciones de notificaciones",
      settings: [
        { key: "emailNotifications", label: "Notificaciones Email", type: "checkbox", value: settings.emailNotifications },
        { key: "smsNotifications", label: "Notificaciones SMS", type: "checkbox", value: settings.smsNotifications }
      ]
    }
  ]

  const renderSettingInput = (setting: any) => {
    switch (setting.type) {
      case "text":
      case "email":
        return (
          <Input
            id={setting.key}
            name={setting.key}
            type={setting.type}
            defaultValue={setting.value}
            className="mt-1"
          />
        )
      case "textarea":
        return (
          <Textarea
            id={setting.key}
            name={setting.key}
            defaultValue={setting.value}
            rows={3}
            className="mt-1"
          />
        )
      case "checkbox":
        return (
          <div className="flex items-center mt-1">
            <input
              id={setting.key}
              name={setting.key}
              type="checkbox"
              defaultChecked={setting.value}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={setting.key} className="ml-2 text-sm text-gray-700">
              Habilitado
            </label>
          </div>
        )
      case "select":
        return (
          <select
            id={setting.key}
            name={setting.key}
            defaultValue={setting.value}
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">
            Administra las configuraciones generales de la plataforma
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.settings.map((setting) => (
                      <div key={setting.key}>
                        <Label htmlFor={setting.key} className="text-sm font-medium text-gray-700">
                          {setting.label}
                        </Label>
                        {renderSettingInput(setting)}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button type="submit" className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </Button>
                  </div>
                </form>
              </Card>
            )
          })}
        </div>

        {/* System Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información del Sistema
              </h3>
              <p className="text-sm text-gray-600">
                Información técnica y estadísticas del sistema
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Base de Datos</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">MongoDB</p>
              <p className="text-xs text-gray-500">Conectado</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Dominio</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">cliquealo.mx</p>
              <p className="text-xs text-gray-500">Activo</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Administrador</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                Administrador
              </p>
              <p className="text-xs text-gray-500">Sesión activa</p>
            </div>
          </div>
        </Card>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Nota Importante
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Los cambios en la configuración pueden afectar el funcionamiento del sitio. 
                Asegúrate de probar los cambios en un entorno de desarrollo antes de aplicarlos en producción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}