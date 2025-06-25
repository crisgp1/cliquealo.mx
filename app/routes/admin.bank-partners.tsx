import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react"
import { useState } from "react"
import { requireClerkSuperAdmin } from "~/lib/auth-clerk.server"
import { BankPartnerModel } from "~/models/BankPartner.server"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card } from "~/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { ConfirmDialog } from "~/components/ui/confirm-dialog"
import { toast } from "~/components/ui/toast"
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Percent,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Globe
} from "lucide-react"

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireClerkSuperAdmin(args)
  
  const url = new URL(args.request.url)
  const search = url.searchParams.get("search") || ""
  const isActive = url.searchParams.get("active")
  
  const filters: any = {}
  if (search) filters.search = search
  if (isActive !== null) filters.isActive = isActive === "true"
  
  const [partners, stats] = await Promise.all([
    BankPartnerModel.findAll(filters),
    BankPartnerModel.getStats()
  ])
  
  return json({ partners, stats, currentUser: user, search, isActive })
}

export async function action(args: ActionFunctionArgs) {
  const user = await requireClerkSuperAdmin(args)
  const formData = await args.request.formData()
  const intent = formData.get("intent")
  
  try {
    switch (intent) {
      case "create": {
        const partnerData = {
          name: formData.get("name") as string,
          logo: formData.get("logo") as string || undefined,
          creditRate: parseFloat(formData.get("creditRate") as string),
          minTerm: parseInt(formData.get("minTerm") as string),
          maxTerm: parseInt(formData.get("maxTerm") as string),
          requirements: (formData.get("requirements") as string).split('\n').filter(r => r.trim()),
          processingTime: parseInt(formData.get("processingTime") as string),
          isActive: formData.get("isActive") === "true",
          contactInfo: {
            phone: formData.get("phone") as string || undefined,
            email: formData.get("email") as string || undefined,
            website: formData.get("website") as string || undefined,
          },
        }
        
        await BankPartnerModel.create({
          ...partnerData,
          createdBy: user._id!
        })
        return json({ success: true, message: "Aliado bancario creado exitosamente" })
      }
      
      case "update": {
        const id = formData.get("id") as string
        const creditRate = parseFloat(formData.get("creditRate") as string)
        const isActive = formData.get("isActive") === "true"
        
        await BankPartnerModel.update(id, { creditRate, isActive })
        return json({ success: true, message: "Tasa de interés actualizada exitosamente" })
      }
      
      case "updateRate": {
        const id = formData.get("id") as string
        const creditRate = parseFloat(formData.get("creditRate") as string)
        
        await BankPartnerModel.updateCreditRate(id, creditRate)
        return json({ success: true, message: "Tasa de interés actualizada exitosamente" })
      }
      
      case "toggle": {
        const id = formData.get("id") as string
        await BankPartnerModel.toggleActive(id)
        return json({ success: true, message: "Estado actualizado exitosamente" })
      }
      
      case "delete": {
        const id = formData.get("id") as string
        await BankPartnerModel.delete(id)
        return json({ success: true, message: "Aliado bancario eliminado exitosamente" })
      }
      
      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in bank partners action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function AdminBankPartners() {
  const { partners, stats, currentUser, search, isActive } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatRate = (rate: number) => {
    return `${rate.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Aliados Bancarios
              </h1>
              <p className="text-gray-600">
                Gestiona los bancos aliados y sus tasas de crédito
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Aliado
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Aliados</p>
                <p className="text-2xl font-light text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-light text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Percent className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa Promedio</p>
                <p className="text-2xl font-light text-gray-900">{formatRate(stats.avgRate)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mejor Tasa</p>
                <p className="text-2xl font-light text-gray-900">{formatRate(stats.minRate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <Form method="get" className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  name="search"
                  placeholder="Buscar por nombre o email..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="active">Estado</Label>
              <select
                name="active"
                defaultValue={isActive || ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline">
                Filtrar
              </Button>
            </div>
          </Form>
        </Card>

        {/* Partners List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {partners.map((partner: any) => (
            <Card key={partner._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      partner.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {partner.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Form method="post" className="inline">
                    <input type="hidden" name="intent" value="toggle" />
                    <input type="hidden" name="id" value={partner._id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      title={partner.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {partner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </Form>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPartner(partner)}
                    title="Editar Tasa de Interés"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(partner._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de Interés</span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatRate(partner.creditRate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plazo</span>
                  <span className="text-sm font-medium">
                    {partner.minTerm} - {partner.maxTerm} meses
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Procesamiento</span>
                  <span className="text-sm font-medium">
                    {partner.processingTime} días
                  </span>
                </div>

                {partner.contactInfo && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {partner.contactInfo.phone && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {partner.contactInfo.phone}
                        </div>
                      )}
                      {partner.contactInfo.email && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {partner.contactInfo.email}
                        </div>
                      )}
                      {partner.contactInfo.website && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Globe className="w-3 h-3 mr-1" />
                          Sitio web
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay aliados bancarios
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primer aliado bancario
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Aliado
            </Button>
          </div>
        )}

        {/* Create Dialog */}
        {showCreateDialog && (
          <BankPartnerDialog
            isOpen={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            partner={null}
            isEditing={false}
          />
        )}

        {/* Edit Rate Dialog */}
        {editingPartner && (
          <EditRateDialog
            isOpen={!!editingPartner}
            onClose={() => setEditingPartner(null)}
            partner={editingPartner}
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm) {
              const form = document.createElement('form')
              form.method = 'post'
              form.innerHTML = `
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value="${deleteConfirm}" />
              `
              document.body.appendChild(form)
              form.submit()
              setDeleteConfirm(null)
            }
          }}
          title="Eliminar Aliado Bancario"
          description="¿Estás seguro de que quieres eliminar este aliado bancario? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          destructive={true}
        />
      </div>
    </div>
  )
}

function BankPartnerDialog({ 
  isOpen, 
  onClose, 
  partner, 
  isEditing 
}: { 
  isOpen: boolean
  onClose: () => void
  partner?: any
  isEditing: boolean
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Aliado Bancario</DialogTitle>
        </DialogHeader>
        <Form method="post" className="space-y-6">
        <input type="hidden" name="intent" value="create" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre del Banco *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Banco Azteca"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="logo">URL del Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          
          <div>
            <Label htmlFor="creditRate">Tasa de Interés Anual (%) *</Label>
            <Input
              id="creditRate"
              name="creditRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="12.50"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="processingTime">Tiempo de Procesamiento (días) *</Label>
            <Input
              id="processingTime"
              name="processingTime"
              type="number"
              min="1"
              placeholder="5"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="minTerm">Plazo Mínimo (meses) *</Label>
            <Input
              id="minTerm"
              name="minTerm"
              type="number"
              min="1"
              placeholder="12"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="maxTerm">Plazo Máximo (meses) *</Label>
            <Input
              id="maxTerm"
              name="maxTerm"
              type="number"
              min="1"
              placeholder="72"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="requirements">Requisitos (uno por línea)</Label>
          <Textarea
            id="requirements"
            name="requirements"
            rows={4}
            placeholder="Identificación oficial&#10;Comprobante de ingresos&#10;Comprobante de domicilio"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="33 1234 5678"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contacto@banco.com"
            />
          </div>
          
          <div>
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://banco.com"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            value="true"
            defaultChecked={true}
            className="mr-2"
          />
          <Label htmlFor="isActive">Activo</Label>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            Crear
          </Button>
        </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function EditRateDialog({
  isOpen,
  onClose,
  partner
}: {
  isOpen: boolean
  onClose: () => void
  partner: any
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tasa de Interés - {partner?.name}</DialogTitle>
        </DialogHeader>
        <Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="updateRate" />
          <input type="hidden" name="id" value={partner?._id} />
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Información del Banco</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Banco:</strong> {partner?.name}</p>
                <p><strong>Plazo:</strong> {partner?.minTerm} - {partner?.maxTerm} meses</p>
                <p><strong>Tasa Actual:</strong> {partner?.creditRate?.toFixed(2)}%</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="creditRate">Nueva Tasa de Interés Anual (%) *</Label>
              <Input
                id="creditRate"
                name="creditRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                defaultValue={partner?.creditRate}
                placeholder="12.50"
                required
                className="text-lg font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta tasa se aplicará a todas las nuevas simulaciones de crédito
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked={partner?.isActive ?? true}
                className="mr-2"
              />
              <Label htmlFor="isActive">Mantener banco activo</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Actualizar Tasa
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}