import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { Skeleton } from '../components/Skeleton';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, isLoading } = useCart();
  const navigate = useNavigate();
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  const FREE_SHIPPING_THRESHOLD = 5000;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  useEffect(() => {
    ApiService.getProducts().then(res => {
      if (res?.products) {
        setUpsellProducts(res.products.slice(0, 4));
      }
    });
  }, []);

  /* ================= IMAGE SAFE HANDLER ================= */

  const getImage = (product: any) => {
    if (product?.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product?.image) {
      return product.image;
    }
    return "/fallback.png";
  };

  /* ====================================================== */

  if (isLoading && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="mb-6 rounded-3xl bg-gray-50 dark:bg-gray-800 p-8 shadow-inner">
          <ShoppingBag className="h-16 w-16 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
          Your cart is empty
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products" className="mt-8">
          <Button size="lg" className="px-8 rounded-full shadow-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white font-heading">
        Shopping Cart ({items.length})
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        
        {/* ================= CART ITEMS ================= */}

        <div className="lg:col-span-8 space-y-8">

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white dark:bg-blue-800 p-2 rounded-full">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                {remaining > 0 ? (
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                    Add ₹{remaining.toLocaleString('en-IN')} more for Free Shipping!
                  </p>
                ) : (
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    Congratulations! You've unlocked Free Shipping.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  remaining <= 0 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-b border-gray-200 dark:border-gray-800">
            {items.map((item) => (
              <li key={item.product._id} className="flex py-8 animate-slide-up">

                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white p-2">
                  <img
                    src={getImage(item.product)}
                    alt={item.product.name}
                    className="h-full w-full object-contain object-center"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Variant: Default
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card shadow-sm">
                        <button
                          className="px-3 py-1.5"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1.5"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* ================= UPSELL SECTION ================= */}

          <div className="pt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              You may also like
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upsellProducts.map((p) => (
                <div
                  key={p._id}
                  className="group relative bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-3 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={getImage(p)}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <h4 className="text-sm font-semibold line-clamp-1">
                    {p.name}
                  </h4>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <Link
                      to={`/product/${p._id}`}
                      className="text-xs text-primary-600 font-medium hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}

        <div className="mt-16 lg:mt-0 lg:col-span-4">
          <div className="rounded-2xl bg-gray-50 dark:bg-dark-card p-6 shadow-sm border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order summary</h2>

            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="font-bold">Order total</span>
              <span className="text-2xl font-bold">
                ₹{(cartTotal + (remaining <= 0 ? 0 : 100)).toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              className="w-full mt-6 h-14 text-lg font-bold rounded-xl shadow-xl"
              onClick={() => navigate('/checkout')}
            >
              Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
