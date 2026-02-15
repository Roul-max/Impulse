import React from 'react';
import { Truck, RefreshCw, ShieldCheck, CreditCard } from 'lucide-react';

export const TrustSection = () => {
    const items = [
        { icon: Truck, title: "Free & Fast Delivery", desc: "Shipping within 24 hours" },
        { icon: RefreshCw, title: "7 Days Return", desc: "No questions asked returns" },
        { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure transaction" },
        { icon: CreditCard, title: "Multiple Payments", desc: "UPI, Cards, Netbanking" }
    ];

    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                                <Icon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};