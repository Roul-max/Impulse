import React from 'react';
import { Button } from './Button';
import { Mail } from 'lucide-react';

export const Newsletter = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-black px-6 py-16 sm:px-12 lg:px-20 text-center">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent/30 rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/10">
                    <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
                    Unlock Exclusive Insider Deals
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                    Join 50,000+ shoppers. Get early access to sales and a flat ₹500 off your first premium order.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-1 rounded-xl border-0 bg-white/10 px-5 py-4 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 backdrop-blur-sm"
                    />
                    <Button size="lg" className="rounded-xl px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-bold border-none">
                        Subscribe
                    </Button>
                </form>
                <p className="text-xs text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </div>
    );
};