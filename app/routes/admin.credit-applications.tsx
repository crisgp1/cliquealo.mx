import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Form, useSubmit } from "@remix-run/react"
import { CreditApplicationModel } from "~/models/CreditApplication.server"
import { requireClerkAdmin } from "~/lib/auth-clerk.server"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/toast"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Download,
  MessageSquare
} from "lucide-react"
import { useState } from "react"
import { TicketCatalog } from "~/components/ui/ticket-catalog"

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireClerkAdmin(args)

  const url = new URL(args.request.url)
  const status = url.searchParams.get("status") || undefined
  const search = url.searchParams.get("search") || undefined
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const applications = await CreditApplicationModel.findAll({
    status: status as any,
    search,
    limit,
    skip
  })

  const stats = await CreditApplicationModel.getStats()

  return json({ applications, stats, filters: { status, search, page } })
}

export async function action(args: ActionFunctionArgs) {
  const user = await requireClerkAdmin(args)

  const formData = await args.request.formData()
  const action = formData.get("action") as string
  const applicationId = formData.get("applicationId") as string

  try {
    switch (action) {
      case "approve": {
        const approvedAmount = parseFloat(formData.get("approvedAmount") as string)
        const approvedTerm = parseInt(formData.get("approvedTerm") as string)
        const interestRate = parseFloat(formData.get("interestRate") as string)
        const comments = formData.get("comments") as string

        // Calcular pago mensual
        const monthlyRate = interestRate / 100 / 12
        const numPayments = approvedTerm
        const monthlyPayment = (approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1)

        await CreditApplicationModel.updateStatus(applicationId, "approved", {
          reviewedBy: user._id!,
          reviewedAt: new Date(),
          approvedAmount,
          approvedTerm,
          interestRate,
          monthlyPayment: Math.round(monthlyPayment),
          comments
        })

        return json({ success: true, message: "Solicitud aprobada exitosamente" })
      }

      case "reject": {
        const rejectionReason = formData.get("rejectionReason") as string
        const comments = formData.get("comments") as string

        await CreditApplicationModel.updateStatus(applicationId, "rejected", {
          reviewedBy: user._id!,
          reviewedAt: new Date(),
          rejectionReason,
          comments
        })

        return json({ success: true, message: "Solicitud rechazada" })
      }

      case "review": {
        await CreditApplicationModel.updateStatus(applicationId, "under_review")
        return json({ success: true, message: "Solicitud marcada como en revisión" })
      }

      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing application:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock
  },
  under_review: {
    label: "En Revisión",
    color: "bg-blue-100 text-blue-800",
    icon: Eye
  },
  approved: {
    label: "Aprobado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  rejected: {
    label: "Rechazado",
    color: "bg-red-100 text-red-800",
    icon: XCircle
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle
  }
}

export default function AdminCreditApplications() {
  const { applications, stats, filters } = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusChange = (applicationId: string, action: string) => {
    const application = applications.find(app => app._id?.toString() === applicationId)
    setSelectedApplication(application)
    
    if (action === "approve") {
      setShowApprovalModal(true)
    } else if (action === "reject") {
      setShowRejectionModal(true)
    } else {
      submit({ action, applicationId }, { method: "post" })
    }
  }

  const handleApproval = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("action", "approve")
    formData.append("applicationId", selectedApplication._id.toString())
    
    submit(formData, { method: "post" })
    setShowApprovalModal(false)
    setSelectedApplication(null)
  }

  const handleRejection = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("action", "reject")
    formData.append("applicationId", selectedApplication._id.toString())
    
    submit(formData, { method: "post" })
    setShowRejectionModal(false)
    setSelectedApplication(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Solicitudes de Crédito
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y revisa las solicitudes de financiamiento
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <TicketCatalog />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.byStatus.pending?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.byStatus.under_review?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.byStatus.approved?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <Form method="get" className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  name="search"
                  placeholder="Nombre, email, CURP..."
                  defaultValue={filters.search || ""}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                name="status"
                defaultValue={filters.status || ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="under_review">En Revisión</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
            
            <Button type="submit">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </Form>
        </Card>

        {/* Applications List */}
        <div className="space-y-6">
          {applications.map((application) => {
            const status = statusConfig[application.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            
            return (
              <Card key={application._id?.toString()} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.personalInfo.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Solicitud #{application._id?.toString().slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(application.createdAt.toString())}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={status.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{application.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{application.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {application.employmentInfo.companyName || 'No especificado'}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Monto Solicitado</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(application.financialInfo.requestedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ingresos Mensuales</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(application.employmentInfo.monthlyIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Enganche</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(application.financialInfo.downPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Plazo</p>
                    <p className="text-sm font-semibold">
                      {application.financialInfo.preferredTerm} meses
                    </p>
                  </div>
                </div>

                {/* Vehicle Info */}
                {application.listing && application.listing.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Vehículo de Interés:</p>
                    <p className="text-sm text-blue-800">
                      {application.listing[0].brand} {application.listing[0].model} {application.listing[0].year} - 
                      <span className="font-semibold ml-1">
                        {formatCurrency(application.listing[0].price)}
                      </span>
                    </p>
                  </div>
                )}

                {/* Review Info */}
                {application.reviewInfo && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    application.status === 'approved' ? 'bg-green-50 border border-green-200' :
                    application.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Información de Revisión</span>
                    </div>
                    
                    {application.status === 'approved' && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Monto Aprobado: </span>
                          <span className="font-semibold">
                            {formatCurrency(application.reviewInfo.approvedAmount || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-700">Pago Mensual: </span>
                          <span className="font-semibold">
                            {formatCurrency(application.reviewInfo.monthlyPayment || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {application.reviewInfo.comments && (
                      <p className="text-sm mt-2">
                        <span className="font-medium">Comentarios: </span>
                        {application.reviewInfo.comments}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Revisado el {formatDate(application.reviewInfo.reviewedAt.toString())}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {application.documents.length} documento(s) • 
                    CURP: {application.personalInfo.curp}
                  </div>
                  
                  <div className="flex space-x-2">
                    {application.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(application._id!.toString(), "review")}
                        >
                          Marcar en Revisión
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusChange(application._id!.toString(), "reject")}
                        >
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(application._id!.toString(), "approve")}
                        >
                          Aprobar
                        </Button>
                      </>
                    )}
                    
                    {application.status === 'under_review' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusChange(application._id!.toString(), "reject")}
                        >
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(application._id!.toString(), "approve")}
                        >
                          Aprobar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {applications.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron solicitudes
            </h3>
            <p className="text-gray-600">
              No hay solicitudes que coincidan con los filtros seleccionados
            </p>
          </Card>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Aprobar Solicitud</h3>
            <Form onSubmit={handleApproval} className="space-y-4">
              <div>
                <Label htmlFor="approvedAmount">Monto Aprobado</Label>
                <Input
                  id="approvedAmount"
                  name="approvedAmount"
                  type="number"
                  defaultValue={selectedApplication.financialInfo.requestedAmount}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="approvedTerm">Plazo Aprobado (meses)</Label>
                <select
                  name="approvedTerm"
                  defaultValue={selectedApplication.financialInfo.preferredTerm.toString()}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="12">12 meses</option>
                  <option value="24">24 meses</option>
                  <option value="36">36 meses</option>
                  <option value="48">48 meses</option>
                  <option value="60">60 meses</option>
                  <option value="72">72 meses</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="interestRate">Tasa de Interés Anual (%)</Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  step="0.1"
                  defaultValue="12.5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="comments">Comentarios</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="Comentarios adicionales..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Aprobar
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud</h3>
            <Form onSubmit={handleRejection} className="space-y-4">
              <div>
                <Label htmlFor="rejectionReason">Motivo del Rechazo</Label>
                <select
                  name="rejectionReason"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar motivo</option>
                  <option value="insufficient_income">Ingresos insuficientes</option>
                  <option value="poor_credit_history">Historial crediticio deficiente</option>
                  <option value="incomplete_documentation">Documentación incompleta</option>
                  <option value="high_debt_ratio">Relación deuda-ingreso muy alta</option>
                  <option value="employment_instability">Inestabilidad laboral</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="comments">Comentarios Adicionales</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="Explicación detallada del rechazo..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                  Rechazar
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}