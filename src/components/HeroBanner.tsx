import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Timer, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
    title: 'The Big Impulse Sale',
    subtitle: 'Up to 80% Off on Electronics & Fashion',
    cta: 'Shop Sale',
    color: 'from-blue-600 to-violet-600',
    countdown: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2070&auto=format&fit=crop',
    title: 'Flagship Phones',
    subtitle: 'Exchange offers you cannot resist.',
    cta: 'Upgrade Now',
    color: 'from-emerald-600 to-teal-600',
    countdown: false
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    title: 'Fashion Refresh',
    subtitle: 'New season arrivals are here.',
    cta: 'View Collection',
    color: 'from-rose-600 to-orange-600',
    countdown: false
  }
];

const Countdown = () => {
    return (
        <div className="flex gap-4 mb-8">
            {['02', '14', '59'].map((time, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 min-w-[65px] text-center shadow-lg">
                        <span className="text-2xl font-bold text-white font-mono">{time}</span>
                    </div>
                    <span className="text-[10px] text-gray-300 uppercase mt-2 font-bold tracking-wider">{['Hrs', 'Mins', 'Secs'][i]}</span>
                </div>
            ))}
        </div>
    );
}

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900 group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Enhanced Background with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title} 
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === current ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Content Area */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 max-w-4xl">
            {/* Personalization or Urgency Tag */}
            <div className="animate-slide-up mb-4 flex items-center gap-2">
                {user && index === 0 ? (
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white text-sm font-bold flex items-center gap-2">
                         <Sparkles className="h-4 w-4 text-yellow-400" /> Welcome back, {user.name.split(' ')[0]}
                    </span>
                ) : slide.countdown ? (
                    <span className="text-accent font-bold tracking-widest uppercase text-sm flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm border border-accent/30">
                        <Timer className="h-4 w-4" /> Limited Time Offer
                    </span>
                ) : (
                    <span className="text-white/80 font-bold tracking-widest uppercase text-sm border-l-2 border-primary-500 pl-3">
                        Featured Collection
                    </span>
                )}
            </div>
            
            <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight font-heading animate-slide-up leading-[1.1] drop-shadow-2xl">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl animate-slide-up leading-relaxed font-light" style={{animationDelay: '0.1s'}}>
              {slide.subtitle}
            </p>
            
            {slide.countdown && <div className="animate-slide-up" style={{animationDelay: '0.15s'}}><Countdown /></div>}

            <div className="flex flex-wrap gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Link to="/products">
                    <Button size="lg" className={`rounded-full px-8 py-4 text-lg border-none bg-gradient-to-r ${slide.color} hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95`}>
                        {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link to="/products">
                    <Button variant="outline" size="lg" className="rounded-full px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                        Explore
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300 shadow-lg"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300 shadow-lg"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Active Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'w-10 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};