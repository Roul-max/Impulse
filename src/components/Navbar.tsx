import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  LayoutDashboard,
  Sun,
  Moon,
  MapPin,
  Mic,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./Button";
import { Logo } from "./Logo";

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCloseTimer = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 3000);
  };

  const clearCloseTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/products?search=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  return (
    <nav className="sticky top-0 z-[999] border-b border-gray-100 dark:border-gray-800 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* LOCATION DESKTOP */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 min-w-max">
            <MapPin className="h-4 w-4" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-gray-400">Deliver to</span>
              <span className="font-bold">Delhi 110001</span>
            </div>
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search for products..."
              />
              <Mic
                onClick={handleVoiceSearch}
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer ${
                  isListening
                    ? "text-red-500 animate-pulse"
                    : "text-gray-400 hover:text-primary-600"
                }`}
              />
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    startCloseTimer();
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:block font-semibold">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div
                    onMouseEnter={clearCloseTimer}
                    onMouseLeave={startCloseTimer}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-[1000]"
                  >
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LayoutDashboard className="inline mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Package className="inline mr-2 h-4 w-4" />
                      My Orders
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="inline mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center gap-4">

            {/* DARK MODE FIRST */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>

            {/* CART */}
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* HAMBURGER */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE PANEL */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg absolute w-full z-[999]">
          <div className="px-4 py-4 space-y-5">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-10 text-sm"
                placeholder="Search products..."
              />
              <Mic
                onClick={handleVoiceSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold">
                Explore Collection
              </Link>

              {user ? (
                <>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold">
                    My Orders
                  </Link>

                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold">
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};
