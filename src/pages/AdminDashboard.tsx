import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { DashboardStats } from '../../types';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  if (!stats) return <div className="p-8">Failed to load stats</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
                <div className="rounded-md bg-primary-100 p-3">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5">
                    <p className="truncate text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.revenue.total.toLocaleString('en-IN')}</p>
                </div>
            </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
                <div className="rounded-md bg-green-100 p-3">
                    <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                    <p className="truncate text-sm font-medium text-gray-500">Active Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.users.activeLast30Days}</p>
                </div>
            </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
             <div className="flex items-center">
                <div className="rounded-md bg-purple-100 p-3">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                    <p className="truncate text-sm font-medium text-gray-500">Top Product</p>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{stats.products.topSelling[0]?.name || 'N/A'}</p>
                </div>
            </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
                <div className="rounded-md bg-orange-100 p-3">
                    <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5">
                    <p className="truncate text-sm font-medium text-gray-500">Monthly Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.revenue.history[stats.revenue.history.length - 1]?.revenue || 0}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders / Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Order Status Breakdown</h3>
             <ul className="divide-y divide-gray-200">
                 {stats.orders.statusBreakdown.map((status) => (
                     <li key={status._id} className="py-4 flex justify-between">
                         <span className="font-medium text-gray-700">{status._id}</span>
                         <span className="text-gray-500">{status.count} orders</span>
                     </li>
                 ))}
             </ul>
          </div>

          {/* Low Stock */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 text-red-600">Low Stock Alert</h3>
             <ul className="divide-y divide-gray-200">
                 {stats.products.lowStock.map((prod) => (
                     <li key={prod._id} className="py-4 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                             <img src={prod.image} alt="" className="h-10 w-10 rounded bg-gray-100 object-cover" />
                             <span className="font-medium text-gray-700">{prod.name}</span>
                         </div>
                         <span className="text-red-500 font-bold">{prod.stock} left</span>
                     </li>
                 ))}
                 {stats.products.lowStock.length === 0 && <p className="text-gray-500">Inventory looks good.</p>}
             </ul>
          </div>
      </div>
    </div>
  );
};