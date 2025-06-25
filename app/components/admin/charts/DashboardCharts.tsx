import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface ChartData {
  monthlyUsers: Array<{ month: string; users: number; newUsers: number }>
  monthlyListings: Array<{ month: string; listings: number; sold: number }>
  creditApplications: Array<{ month: string; applications: number; approved: number; rejected: number }>
  listingsByBrand: Array<{ brand: string; count: number; value: number }>
  userActivity: Array<{ day: string; active: number; logins: number }>
}

interface DashboardChartsProps {
  data: any // Using any to handle JSON serialized data from Remix loader
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Monthly Users Growth */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Usuarios</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.monthlyUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="users" 
              stackId="1" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.6}
              name="Total Usuarios"
            />
            <Area 
              type="monotone" 
              dataKey="newUsers" 
              stackId="2" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
              name="Nuevos Usuarios"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Listings Performance */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Listings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyListings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="listings" fill="#3B82F6" name="Listings Creados" />
            <Bar dataKey="sold" fill="#10B981" name="Vendidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Credit Applications Trend */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Solicitudes de Crédito</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.creditApplications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#F59E0B" 
              strokeWidth={3}
              name="Solicitudes"
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Aprobadas"
            />
            <Line 
              type="monotone" 
              dataKey="rejected" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Rechazadas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Listings by Brand Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Marca</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.listingsByBrand}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ brand, percent }: any) => `${brand} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.listingsByBrand.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, 'Listings']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* User Activity (Last 7 Days) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad de Usuarios (Últimos 7 días)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.userActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="active" 
              stackId="1" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.6}
              name="Usuarios Activos"
            />
            <Area 
              type="monotone" 
              dataKey="logins" 
              stackId="2" 
              stroke="#06B6D4" 
              fill="#06B6D4" 
              fillOpacity={0.6}
              name="Inicios de Sesión"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}