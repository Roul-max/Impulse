import React from 'react';
import { Product } from '../../types';
import { X, Star, Check, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[90vh]">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-white/50 dark:bg-black/50 rounded-full backdrop-blur-md"
        >
            <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center">
            <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[300px] md:max-h-[400px] w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
            />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
            <div className="mb-1">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{typeof product.category === 'string' ? product.category : product.category.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                </div>
                <span className="text-sm text-gray-500">({product.totalReviews} reviews)</span>
            </div>

            <div className="mb-6">
                 <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}</span>
                 </div>
                 <p className="text-xs text-green-600 font-bold mt-1">In Stock • Ready to Ship</p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">
                {product.description}
            </p>

            <div className="space-y-2 mb-8">
                {product.features?.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-600" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-3">
                <Button 
                    size="lg" 
                    className="w-full shadow-xl"
                    onClick={() => { addToCart(product); onClose(); }}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Link to={`/product/${product._id}`} onClick={onClose} className="text-center text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center justify-center gap-1">
                    View Full Details <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};