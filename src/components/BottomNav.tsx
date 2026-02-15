import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../../utils/cn';

export const BottomNav = () => {
  const { itemCount } = useCart();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Categories', path: '/products' },
    { icon: Search, label: 'Search', path: '/products?focus=true' }, // Logic to focus search could be added
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: itemCount },
    { icon: User, label: 'Account', path: '/orders' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block h-16 w-full border-t border-gray-200 bg-white/90 backdrop-blur-lg dark:bg-gray-900/90 dark:border-gray-800 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid h-full grid-cols-5 font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => cn(
              "inline-flex flex-col items-center justify-center px-5 transition-colors duration-200 group",
              isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            )}
          >
            <div className="relative">
                <item.icon className="mb-1 h-6 w-6 transition-transform group-active:scale-90" />
                {item.badge ? (
                    <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm border border-white dark:border-gray-900">
                        {item.badge}
                    </span>
                ) : null}
            </div>
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};