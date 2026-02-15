import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
    { 
        name: 'Premium Audio', 
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop', 
        col: 'md:col-span-1', 
        row: 'md:row-span-2',
        overlayColor: 'from-purple-900/90'
    },
    { 
        name: 'Minimalist Furniture', 
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop', 
        col: 'md:col-span-2', 
        row: 'md:row-span-1',
        overlayColor: 'from-orange-900/90'
    },
    { 
        name: 'Cyberpunk Gaming', 
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop', 
        col: 'md:col-span-1', 
        row: 'md:row-span-1',
        overlayColor: 'from-blue-900/90'
    },
    { 
        name: 'Smart Wearables', 
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop', 
        col: 'md:col-span-1', 
        row: 'md:row-span-1',
        overlayColor: 'from-emerald-900/90'
    },
];

export const CategoryHighlights = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[480px]">
            {categories.map((cat, idx) => (
                <Link 
                    key={idx} 
                    to="/products"
                    className={`relative group overflow-hidden rounded-2xl ${cat.col} ${cat.row} min-h-[200px] md:min-h-0`}
                >
                    <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.overlayColor} via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xl md:text-2xl font-bold font-heading leading-tight mb-2">{cat.name}</h3>
                            <div className="flex items-center gap-2 text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs">Shop Now</span>
                                <div className="bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/20">
                                     <ArrowUpRight className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};