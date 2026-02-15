import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface OrderTimelineProps {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, createdAt }) => {
  const steps = [
    { id: 'PENDING', label: 'Ordered', icon: Package, date: new Date(createdAt).toLocaleDateString() },
    { id: 'PROCESSING', label: 'Processing', icon: Clock, date: 'Estimating...' },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck, date: '---' },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle, date: '---' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  const isCancelled = status === 'CANCELLED';

  if (isCancelled) {
      return <div className="p-4 bg-red-50 text-red-600 rounded-lg font-bold text-center">Order Cancelled</div>;
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
         {/* Line Background */}
         <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-200 dark:bg-gray-700 -z-0"></div>
         {/* Progress Line */}
         <div 
            className="absolute left-0 top-5 h-0.5 bg-green-500 transition-all duration-500 -z-0" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
         ></div>

         {steps.map((step, index) => {
             const isCompleted = index <= currentStepIndex;
             const Icon = step.icon;
             return (
                 <div key={step.id} className="flex flex-col items-center relative z-10 group">
                     <div className={cn(
                         "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-dark-card",
                         isCompleted 
                            ? "border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110" 
                            : "border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-600"
                     )}>
                         <Icon className="h-5 w-5" />
                     </div>
                     <p className={cn(
                         "mt-2 text-xs font-semibold",
                         isCompleted ? "text-gray-900 dark:text-white" : "text-gray-400"
                     )}>{step.label}</p>
                     {isCompleted && index === 0 && <p className="text-[10px] text-gray-400">{step.date}</p>}
                 </div>
             )
         })}
      </div>
    </div>
  );
};