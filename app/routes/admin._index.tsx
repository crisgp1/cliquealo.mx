import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { requireClerkAdmin } from "~/lib/auth-clerk.server"
import { db } from "~/lib/db.server"
import { UserModel } from "~/models/User.server"
import { ListingModel } from "~/models/Listing.server"
import { CreditApplicationModel } from "~/models/CreditApplication.server"
import { Users, Car, TrendingUp, Plus, CreditCard, Building2 } from 'lucide-react'
import { TicketCatalog } from "~/components/ui/ticket-catalog"

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireClerkAdmin(args)
  
  const [users, listings, creditApplications] = await Promise.all([
    user.role === 'superadmin' ? UserModel.findAll({ limit: 20, skip: 0 }) : [],
    ListingModel.findMany({ limit: 20 }), // En admin dashboard mostrar todos los listings
    CreditApplicationModel.findAll({ limit: 5 }) // Últimas 5 aplicaciones de crédito
  ])
  
  const stats = {
    totalUsers: user.role === 'superadmin' ? await db.collection('users').countDocuments({ isActive: true }) : 0,
    totalListings: await db.collection('listings').countDocuments(),
    totalAdmins: user.role === 'superadmin' ? await db.collection('users').countDocuments({ role: { $in: ['admin', 'superadmin'] } }) : 0,
    totalCreditApplications: await db.collection('creditApplications').countDocuments(),
    pendingCreditApplications: await db.collection('creditApplications').countDocuments({ status: 'pending' })
  }
  
  return json({ users, listings, creditApplications, stats, currentUser: user })
}

export default function AdminDashboard() {
  const { users, listings, creditApplications, stats, currentUser } = useLoaderData<typeof loader>()
  const isSuperAdmin = currentUser.role === 'superadmin'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Gestiona usuarios y listings de la plataforma
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <TicketCatalog />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isSuperAdmin && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-light text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Car className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-light text-gray-900">{stats.totalListings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes de Crédito</p>
                <p className="text-2xl font-light text-gray-900">{stats.totalCreditApplications}</p>
                {stats.pendingCreditApplications > 0 && (
                  <p className="text-xs text-orange-600 font-medium">
                    {stats.pendingCreditApplications} pendientes
                  </p>
                )}
                
                {isSuperAdmin && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <Building2 className="w-8 h-8 text-indigo-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Aliados Bancarios</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-light text-gray-900">Gestionar</p>
                          <Link
                            to="/admin/bank-partners"
                            className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full hover:bg-indigo-200"
                          >
                            Ver todos
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {isSuperAdmin && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-light text-gray-900">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 ${isSuperAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
          {/* Recent Users - Only for SuperAdmin */}
          {isSuperAdmin && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Usuarios Recientes</h2>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Users className="w-4 h-4" />
                  Gestionar Usuarios
                </Link>
              </div>
              
              <div className="space-y-3">
                {users.slice(0, 5).map((user: any) => (
                  <Link
                    key={user._id}
                    to={`/admin/users/${user._id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' || user.role === 'superadmin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Listings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Listings Recientes</h2>
              <Link 
                to="/listings/new"
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Crear
              </Link>
            </div>
            
            <div className="space-y-3">
              {listings.slice(0, 5).map((listing: any) => (
                <Link 
                  key={listing._id}
                  to={`/listings/${listing._id}`}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <p className="font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500">
                    ${listing.price.toLocaleString()} • {listing.brand} {listing.model}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Credit Applications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Solicitudes de Crédito</h2>
              <Link
                to="/admin/credit-applications"
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
              >
                <CreditCard className="w-4 h-4" />
                Gestionar Créditos
              </Link>
            </div>
            
            <div className="space-y-3">
              {creditApplications.slice(0, 5).map((application: any) => (
                <div
                  key={application._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{application.personalInfo?.fullName || 'Sin nombre'}</p>
                    <p className="text-sm text-gray-500">
                      ${application.financialInfo?.requestedAmount?.toLocaleString() || '0'} • {application.vehicleInfo?.brand} {application.vehicleInfo?.model}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status === 'pending' ? 'Pendiente' :
                     application.status === 'approved' ? 'Aprobado' :
                     application.status === 'rejected' ? 'Rechazado' :
                     application.status}
                  </span>
                </div>
              ))}
              {creditApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay solicitudes de crédito aún</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}