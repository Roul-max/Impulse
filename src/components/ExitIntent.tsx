import React, { useEffect, useState } from 'react';
import { X, Gift, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const ExitIntent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      // Show only if moving towards top of viewport (tab bar)
      if (e.clientY < 0 && !hasShown && window.innerWidth > 768) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-dark-card shadow-2xl animate-slide-up border border-white/20">
        <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
            <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
            {/* Visual Hook */}
            <div className="bg-gradient-to-r from-primary-600 to-accent p-6 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <Gift className="h-16 w-16 text-white mx-auto mb-2 animate-bounce" />
                 <h2 className="text-2xl font-bold text-white font-heading">
                    Wait! Unlock Flat ₹500 OFF
                 </h2>
                 <p className="text-primary-100 text-sm">
                    Limited time offer for new members only.
                 </p>
            </div>

            {/* Action Area */}
            <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    Get your exclusive coupon code sent directly to your phone. 
                    <span className="block font-bold text-gray-900 dark:text-white mt-1">Don't miss out on this deal!</span>
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                            type="tel" 
                            placeholder="Enter your mobile number" 
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:border-gray-700 outline-none transition-all"
                        />
                    </div>
                    <Button className="w-full rounded-xl py-4 font-bold text-base shadow-lg shadow-primary-500/20">
                        Send Me The Code <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline decoration-dotted"
                    >
                        No thanks, I'd rather pay full price
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};