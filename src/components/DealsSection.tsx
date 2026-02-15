import React from 'react';
import { Product } from '../../types';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DealsSectionProps {
  title: string;
  products: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ title, products }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">{title}</h2>
           <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
             <Clock className="h-4 w-4 text-accent" />
             <span>Ends in 12h 45m</span>
           </div>
        </div>
        <Link to="/products" className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline">
            View All
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="flex-shrink-0 w-[200px] snap-start group cursor-pointer"
          >
             <div className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden mb-3 border border-gray-100 dark:border-gray-700">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                   40% OFF
                </div>
             </div>
             <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm mb-1">{product.name}</h3>
             <div className="flex items-center gap-1 mb-1">
                <div className="flex items-center bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {product.averageRating} <Star className="h-2.5 w-2.5 ml-0.5 fill-current" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">({product.totalReviews})</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 line-through">₹{Math.round(product.price * 1.4).toLocaleString('en-IN')}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};