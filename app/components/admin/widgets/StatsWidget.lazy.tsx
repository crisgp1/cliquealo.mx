import React from 'react';
import { motion } from 'framer-motion';
import { Users, Car, TrendingUp, CreditCard } from 'lucide-react';

interface StatsWidgetProps {
  stats: {
    totalListings: number;
    totalCreditApplications: number;
    pendingCreditApplications: number;
    totalUsers?: number;
    totalAdmins?: number;
  };
  isSuperAdmin: boolean;
}

export function StatsWidget({ stats, isSuperAdmin }: StatsWidgetProps) {
  // ========================================
  // CONFIGURACIÓN DE STATS DINÁMICAS
  // ========================================
  const statItems = React.useMemo(() => {
    const baseStats = [
      {
        title: 'Total Listings',
        value: stats.totalListings.toLocaleString(),
        icon: Car,
        color: 'blue',
        change: '+8%',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900'
      },
      {
        title: 'Aplicaciones de Crédito',
        value: stats.totalCreditApplications.toLocaleString(),
        icon: CreditCard,
        color: 'purple',
        change: '+15%',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-900'
      },
      {
        title: 'Pendientes',
        value: stats.pendingCreditApplications.toLocaleString(),
        icon: TrendingUp,
        color: 'orange',
        change: '-3%',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900'
      }
    ];

    // ========================================
    // AGREGAR STATS DE SUPERADMIN
    // ========================================
    if (isSuperAdmin && stats.totalUsers !== undefined) {
      baseStats.unshift({
        title: 'Total Usuarios',
        value: stats.totalUsers.toLocaleString(),
        icon: Users,
        color: 'green',
        change: '+12%',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-900'
      });
    }

    return baseStats;
  }, [stats, isSuperAdmin]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.3,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor} mb-2`}>
                {stat.value}
              </p>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') 
                    ? 'text-green-600' 
                    : stat.change.startsWith('-') 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}