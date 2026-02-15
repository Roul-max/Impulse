import React from 'react';
import { Button } from './Button';
import { Smartphone, Star } from 'lucide-react';

export const AppDownload = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-black dark:from-dark-card dark:to-black rounded-3xl overflow-hidden flex flex-col md:flex-row items-center shadow-2xl relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="p-8 md:p-12 lg:p-20 md:w-1/2 z-10">
                <div className="flex items-center gap-2 text-accent font-bold tracking-wider uppercase text-xs mb-4">
                    <Smartphone className="h-4 w-4" /> Impulse App
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                    Shop Smarter. <br/> Anywhere, Anytime.
                </h2>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Experience the fastest way to shop. Unlock exclusive app-only drops, real-time tracking, and use our AR tool to try before you buy.
                </p>
                
                <div className="flex items-center gap-2 mb-8">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <span className="text-gray-300 text-sm font-medium">4.9/5 Rating on App Store</span>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-xl h-14 px-6 flex items-center gap-3 transition-all hover:scale-105">
                        <div className="h-6 w-6 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M17.05 20.28c-.98.95-2.05 2.3-3.73 2.3-1.61 0-2.14-.97-4.13-.97-2.01 0-2.61 1.01-4.18 1.01-1.68 0-3.32-1.74-4.52-3.47-2.45-3.53-2.09-8.45 1.95-10.15 2.01-.82 3.92.54 5.16.54 1.2 0 3.39-1.21 5.73-1.01 1 .04 3.8.39 5.37 2.68-4.57 2.22-3.8 8.1 1.35 10.08M13.8 4.25c.9-.96 1.48-2.3 1.32-3.64-1.27.05-2.82.84-3.73 1.9-.81.93-1.52 2.43-1.33 3.65 1.42.11 2.87-.93 3.74-1.91" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] uppercase leading-none opacity-80">Download on the</div>
                            <div className="text-base font-bold leading-none">App Store</div>
                        </div>
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-xl h-14 px-6 flex items-center gap-3 transition-all hover:scale-105">
                         <div className="h-6 w-6 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,13.11C20.84,12.8 21.17,12.35 21.17,12C21.17,11.65 20.84,11.2 20.3,10.89L18.06,9.64L15.39,12.31L18.06,14.97L20.3,13.11M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                         </div>
                         <div className="text-left">
                            <div className="text-[10px] uppercase leading-none opacity-80">Get it on</div>
                            <div className="text-base font-bold leading-none">Google Play</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="md:w-1/2 flex justify-center items-end relative h-[400px] md:h-[500px] w-full overflow-hidden">
                 {/* Realistic Phone Mockup */}
                 <div className="relative w-[280px] h-[550px] bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl translate-y-12 z-10 ring-1 ring-white/10">
                     {/* Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                     
                     {/* Screen Content */}
                     <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                         <img 
                            src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1000&auto=format&fit=crop" 
                            className="w-full h-full object-cover" 
                            alt="App Interface" 
                         />
                         
                         {/* Fake UI Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-6">
                             <div className="flex justify-between items-center text-white mt-8">
                                <span className="font-bold text-lg">Impulse</span>
                                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md"></div>
                             </div>
                             
                             <div className="mb-12">
                                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl mb-4">
                                     <div className="flex gap-3">
                                         <div className="h-12 w-12 bg-white rounded-lg">
                                             <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" className="w-full h-full object-cover rounded-lg" alt="Shoe" />
                                         </div>
                                         <div className="text-white">
                                             <div className="text-xs opacity-70">Order Shipped</div>
                                             <div className="font-bold text-sm">Nike Air Max</div>
                                             <div className="text-xs text-green-400">Arriving Tomorrow</div>
                                         </div>
                                     </div>
                                 </div>
                                 <Button className="w-full rounded-xl bg-primary-600 text-white border-none py-3 font-bold shadow-lg shadow-primary-600/30">Checkout Now</Button>
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Decorative elements behind phone */}
                 <div className="absolute bottom-0 right-10 bg-gradient-to-tr from-accent to-purple-600 w-64 h-64 rounded-full blur-[80px] opacity-40"></div>
            </div>
        </div>
    );
};