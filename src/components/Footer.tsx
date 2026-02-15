import React from 'react';
import { APP_NAME } from '../../constants';
import { Facebook, Twitter, Instagram, Youtube, CreditCard, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                {/* Brand & Contact */}
                <div className="lg:col-span-2 space-y-6">
                    <Logo className="scale-90 origin-left" />
                    <p className="text-sm leading-relaxed max-w-sm">
                        Experience premium shopping with AI-powered assistance. 
                        Impulse is your destination for instant gratification, delivering happiness since 2024.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-primary-600" />
                            <span>123 Commerce Tower, Tech Hub, Bangalore</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-primary-600" />
                            <span>+91 1800-123-4567</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary-600" />
                            <span>support@impulse.com</span>
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-bold mb-6 font-heading text-lg text-gray-900 dark:text-white">Shop</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Discount Zone</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Gift Cards</a></li>
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h4 className="font-bold mb-6 font-heading text-lg text-gray-900 dark:text-white">Customer Care</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Track Order</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Shipping Policy</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Returns & Refunds</a></li>
                        <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQs</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="font-bold mb-6 font-heading text-lg text-gray-900 dark:text-white">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-sky-500 hover:text-white transition-all duration-300">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-600 hover:text-white transition-all duration-300">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-600 hover:text-white transition-all duration-300">
                            <Youtube className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% Secure Payment</span>
                    <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> SSL Encrypted</span>
                </div>

                <div className="text-center md:text-right text-xs text-gray-400">
                    © {new Date().getFullYear()} {APP_NAME} Enterprise. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  );
};