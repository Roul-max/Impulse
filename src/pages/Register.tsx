import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { APP_NAME } from '../../constants';
import { Eye, EyeOff, Check, X, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Simple Password Strength
  const getStrength = (pass: string) => {
      let strength = 0;
      if (pass.length > 7) strength++;
      if (/[A-Z]/.test(pass)) strength++;
      if (/[0-9]/.test(pass)) strength++;
      if (/[^A-Za-z0-9]/.test(pass)) strength++;
      return strength;
  };
  
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register({ name, email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-dark-bg transition-colors duration-200">
       {/* Left Side - Brand (Hidden on mobile) */}
       <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1980&auto=format&fit=crop" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[20s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-20 text-white">
          <Logo color="white" className="mb-8 scale-110 origin-left" />
          <h1 className="text-5xl font-bold font-heading mb-6 leading-tight">
            Join the <br/> Revolution.
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed">
            Create an account to unlock exclusive drops, personalized style feeds, and express checkout. Experience shopping reimagined.
          </p>
          <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-gray-600"></div>
                  ))}
              </div>
              <p className="text-sm font-medium text-white">Join 10k+ members</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-8">
                     <Logo />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-heading">
                    Create account
                </h2>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                    Start your journey with {APP_NAME} today.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-5">
                    <div className="relative group">
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="block w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card pl-11 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all"
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="relative group">
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="block w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card pl-11 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all"
                            placeholder="Email address"
                        />
                    </div>

                    <div>
                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card pl-11 pr-12 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        <div className={`mt-3 transition-all duration-300 ${password ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <div className="flex gap-1.5 h-1.5 mb-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "flex-1 rounded-full transition-colors duration-300",
                                            strength >= i 
                                                ? (strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-500" : "bg-green-500") 
                                                : "bg-gray-200 dark:bg-gray-700"
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-right">
                                {strength < 2 ? "Weak" : strength === 3 ? "Medium" : "Strong"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-card cursor-pointer"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                            I agree to the <a href="#" className="text-primary-600 hover:text-primary-500 hover:underline">Terms</a> and <a href="#" className="text-primary-600 hover:text-primary-500 hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                </div>

                <Button type="submit" className="w-full rounded-2xl py-4 font-bold text-lg shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 transition-all active:scale-[0.98]" isLoading={isLoading}>
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-dark-bg px-4 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-dark-card text-sm font-medium text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-dark-card text-sm font-medium text-gray-700 dark:text-gray-200">
                    <svg className="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                    Facebook
                </button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 hover:underline transition-colors">
                    Sign in here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};