import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { requireSuperAdmin } from "~/lib/auth.server"
import { db } from "~/lib/db.server"
import { UserModel } from "~/models/User"
import { ListingModel } from "~/models/Listing"
import { Users, Car, TrendingUp, Plus } from 'lucide-react'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSuperAdmin(request)
  
  const [users, listings] = await Promise.all([
    UserModel.findAll({ limit: 20, skip: 0 }),
    ListingModel.findMany({ limit: 20 })
  ])
  
  const stats = {
    totalUsers: await db.collection('users').countDocuments({ isActive: true }),
    totalListings: await db.collection('listings').countDocuments(),
    totalAdmins: await db.collection('users').countDocuments({ role: { $in: ['admin', 'superadmin'] } })
  }
  
  return json({ users, listings, stats })
}

export default function AdminDashboard() {
  const { users, listings, stats } = useLoaderData<typeof loader>()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios y listings de la plataforma
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-light text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
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
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-light text-gray-900">{stats.totalAdmins}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Usuarios Recientes</h2>
              <Link 
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ver todos
              </Link>
            </div>
            
            <div className="space-y-3">
              {users.slice(0, 5).map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
                </div>
              ))}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  )
}