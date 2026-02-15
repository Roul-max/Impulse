import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { Order } from '../../types';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import { OrderTimeline } from '../components/OrderTimeline';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiService.getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-8">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Your Orders</h1>
        <div className="text-sm text-gray-500">Total {orders.length} orders</div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
             <div className="bg-gray-50 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-gray-300" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">No orders yet</h3>
             <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
             <Link to="/products">
                <Button>Start Shopping</Button>
             </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-slide-up">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-4 gap-4">
                <div className="flex gap-8 text-sm">
                    <div>
                        <p className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Order Placed</p>
                        <p className="text-gray-900 dark:text-white font-semibold mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Total Amount</p>
                        <p className="text-gray-900 dark:text-white font-semibold mt-1">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <span className="text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</span>
                     <Button size="sm" variant="outline" className="h-8 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">Invoice</Button>
                </div>
              </div>

              <div className="p-6">
                 {/* Visual Timeline */}
                 <div className="mb-8">
                     <OrderTimeline status={order.status} createdAt={order.createdAt} />
                 </div>

                 {/* Items */}
                 <div className="space-y-4">
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-2 overflow-hidden">
                                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link to={`/product/${item.product}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-1">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price.toLocaleString('en-IN')}</p>
                                <Link to={`/product/${item.product}`} className="text-xs text-primary-600 hover:underline mt-1 block">Write Review</Link>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};