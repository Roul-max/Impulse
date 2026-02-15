import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { APP_NAME } from '../../constants';
import { Eye, EyeOff, ShieldCheck, Smartphone, Mail, ArrowRight, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Login = () => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('demo@luxemarket.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Real-time validation logic
  const isValid = () => {
    if (authMethod === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    } else {
        return /^[0-9]{10}$/.test(identifier);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid()) return;

    // Backend expects 'email' field, so we map identifier to it
    const success = await login({ email: identifier, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-dark-bg transition-colors duration-200">
      {/* Left Side - Visual Storytelling (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Lifestyle" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-16 text-white">
          <Logo color="white" className="mb-8 scale-110 origin-left" />
          <h1 className="text-5xl font-bold font-heading mb-6 leading-tight">
            Curated Luxury <br/> For the Modern Soul.
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-gray-900 bg-gray-700"></div>
                ))}
             </div>
             <p>Join 10M+ users shopping today</p>
          </div>
        </div>
      </div>

      {/* Right Side - Functional Conversion */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-white dark:bg-dark-bg">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-8">
                     <Logo />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-heading">
                    Welcome back
                </h2>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Securely login to access your personalized feed.
                </p>
            </div>

            {/* Method Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button 
                    onClick={() => { setAuthMethod('email'); setIdentifier(''); setTouched(false); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
                        authMethod === 'email' ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                >
                    <Mail className="h-4 w-4" /> Email
                </button>
                <button 
                    onClick={() => { setAuthMethod('phone'); setIdentifier(''); setTouched(false); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
                        authMethod === 'phone' ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                >
                    <Smartphone className="h-4 w-4" /> Number
                </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {authMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                        </label>
                        <div className="relative group">
                            <input
                                type={authMethod === 'email' ? 'email' : 'tel'}
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                onBlur={() => setTouched(true)}
                                className={cn(
                                    "block w-full rounded-xl border px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 transition-all bg-gray-50 dark:bg-dark-card",
                                    touched && !isValid() 
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                                        : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/10"
                                )}
                                placeholder={authMethod === 'email' ? "name@example.com" : "9876543210"}
                            />
                            {/* Visual Validation Feedback */}
                            {identifier && isValid() && (
                                <div className="absolute right-3 top-3.5 text-green-500 animate-fade-in">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                        {touched && !isValid() && (
                            <p className="mt-1 text-xs text-red-500 font-medium animate-slide-up">
                                Please enter a valid {authMethod === 'email' ? 'email address' : '10-digit number'}.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                Forgot?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card px-4 py-3.5 pr-10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full rounded-xl py-4 font-bold text-base shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all" 
                    isLoading={isLoading}
                    disabled={!identifier || !password}
                >
                    Continue to Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                 <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-4">
                    <Lock className="h-3 w-3" /> Your data is securely encrypted.
                 </p>
                 <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                        Create Your Account
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};