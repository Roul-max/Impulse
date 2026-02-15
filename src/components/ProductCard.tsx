import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { Button } from './Button';
import { Star, ShoppingCart, Heart, Eye, Truck, Zap, Scale, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickView } from './QuickView';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();
  const [showQuickView, setShowQuickView] = useState(false);

  // 🔥 DEBUG LOG (temporary)
  useEffect(() => {
  }, [product]);

  // 🛠 SAFE PRICE CONVERSION (Handles Decimal128 or normal number)
  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : Number(
          (product.price as any)?.$numberDecimal ||
          (product.price as any)?.amount ||
          product.price ||
          0
        );

  const originalPrice = Math.round(numericPrice * 1.25);
  const discount = 25;

  const displayImage =
    product.image ||
    product.images?.[0] ||
    "https://via.placeholder.com/300";

  const isLowStock =
    typeof product.stock === "number" &&
    product.stock < 10 &&
    product.stock > 0;

  return (
    <>
      <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent dark:border-gray-800">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Link to={`/product/${product._id}`}>
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
            <span className="bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {typeof product.category === 'object'
                ? product.category.name
                : product.category}
            </span>

            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-fit">
              {discount}% OFF
            </span>
          </div>

          {/* QUICK ADD DESKTOP */}
          <div className="hidden lg:block absolute inset-x-4 bottom-4 translate-y-[120%] transition-transform duration-300 group-hover:translate-y-0 z-10">
            <Button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-full shadow-lg font-bold rounded-xl h-11 bg-white text-gray-900 hover:bg-primary-600 hover:text-white dark:bg-gray-800 dark:text-white dark:hover:bg-primary-600 transition-all"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>

          {/* MOBILE CART BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="lg:hidden absolute bottom-3 right-3 p-3 rounded-full bg-white dark:bg-gray-700 text-primary-600 shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-4">

          {/* LOW STOCK */}
          {isLowStock ? (
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 mb-2 h-4">
              Only {product.stock} left
            </div>
          ) : (
            <div className="h-4 mb-2"></div>
          )}

          {/* NAME */}
          <Link to={`/product/${product._id}`} className="mb-1 block">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 h-[2.5rem] group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* RATING */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 text-[10px] px-1.5 py-0.5 rounded gap-0.5 font-bold">
              {Number(product.averageRating || 0).toFixed(1)}
              <Star className="h-2 w-2 fill-current" />
            </div>
            <span className="text-xs text-gray-400">
              ({Number(product.totalReviews || 0).toLocaleString()})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{numericPrice.toLocaleString("en-IN")}
              </span>

              <span className="text-xs text-gray-500 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* MICRO INFO */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dashed text-[10px] text-gray-500">
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" /> <span>2 Day Delivery</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Zap className="h-3 w-3 text-yellow-500" /> <span>Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};
