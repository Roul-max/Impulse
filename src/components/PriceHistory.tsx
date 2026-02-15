import React from 'react';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';

interface PriceHistoryProps {
  currentPrice: number;
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({ currentPrice }) => {
  // Simulate history data based on current price
  const history = [
    currentPrice * 1.1,
    currentPrice * 1.05,
    currentPrice * 1.08,
    currentPrice * 1.02,
    currentPrice * 0.95, // Dip
    currentPrice // Current
  ];

  const min = Math.min(...history);
  const max = Math.max(...history);
  const isLowest = currentPrice <= min;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-dark-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Price History 
            <span className="text-xs font-normal text-gray-400 border border-gray-200 rounded px-1.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">30 Days</span>
        </h3>
        {isLowest ? (
             <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingDown className="h-3 w-3" /> Lowest Price
             </span>
        ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" /> Fair Price
             </span>
        )}
      </div>

      {/* Simple SVG Line Chart */}
      <div className="relative h-24 w-full flex items-end justify-between gap-1">
         {history.map((price, idx) => {
            const height = ((price - (min * 0.9)) / ((max * 1.1) - (min * 0.9))) * 100;
            return (
                <div key={idx} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                    <div 
                        className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 hover:opacity-80 ${idx === history.length - 1 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₹{Math.round(price)}
                    </div>
                </div>
            )
         })}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Average price: ₹{Math.round(history.reduce((a,b) => a+b, 0) / history.length)}
      </p>
    </div>
  );
};