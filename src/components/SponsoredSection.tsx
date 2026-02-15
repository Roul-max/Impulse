import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const SponsoredSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Large Featured Card */}
      <div className="md:col-span-2 relative h-[300px] rounded-2xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Featured"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-center items-start text-white">
           <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">Sponsored</span>
           <h3 className="text-3xl font-bold mb-2 font-heading">Smart Living Revolution</h3>
           <p className="text-gray-200 mb-6 max-w-md">Upgrade your home with the latest AI-integrated appliances.</p>
           <Button variant="primary" className="rounded-full">Check it out</Button>
        </div>
      </div>

      {/* Smaller Cards */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden group bg-gray-100 dark:bg-gray-800">
         <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Sneakers"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
            <h4 className="text-xl font-bold mb-1">Sneaker Head?</h4>
            <p className="text-sm text-gray-300 mb-3">Latest drops just landed.</p>
            <div className="flex items-center text-sm font-semibold text-accent hover:text-accent-hover cursor-pointer">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </div>
         </div>
      </div>
    </div>
  );
};