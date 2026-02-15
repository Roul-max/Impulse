import React, { useState, useEffect } from 'react';
import { Tag, CreditCard, Clock } from 'lucide-react';

const offers = [
  { icon: Clock, text: "Flash Sale: Ends in 02:14:50" },
  { icon: CreditCard, text: "Extra 10% off on HDFC Bank Cards" },
  { icon: Tag, text: "Free Delivery on orders above ₹499" }
];

export const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-900 text-white text-xs md:text-sm py-2 overflow-hidden relative z-40">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {offers.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <div
              key={index}
              className={`transition-all duration-500 ease-in-out absolute inset-0 flex items-center justify-center gap-2 ${
                index === current ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <Icon className="h-3 w-3 md:h-4 md:w-4 text-accent" />
              <span className="font-medium tracking-wide">{offer.text}</span>
            </div>
          );
        })}
        {/* Spacer to give height since children are absolute */}
        <div className="opacity-0 flex items-center justify-center gap-2">
           <Clock className="h-4 w-4" /> <span>Placeholder</span>
        </div>
      </div>
    </div>
  );
};