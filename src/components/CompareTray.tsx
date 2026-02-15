import React from 'react';
import { useCompare } from '../context/CompareContext';
import { X, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const CompareTray = () => {
  const { compareList, removeFromCompare, clearCompare, isOpen, setIsOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className={cn(
        "fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 transition-all duration-300",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
    )}>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary-600" /> 
                    Compare Products ({compareList.length}/3)
                </h3>
                <div className="flex items-center gap-3">
                    <button onClick={clearCompare} className="text-xs text-red-500 hover:underline">Clear All</button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex-1 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[0, 1, 2].map(idx => {
                        const product = compareList[idx];
                        return (
                            <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                {product ? (
                                    <>
                                        <img src={product.image} alt="" className="h-full w-full object-contain p-1" />
                                        <button 
                                            onClick={() => removeFromCompare(product._id)}
                                            className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow-md border border-gray-200"
                                        >
                                            <X className="h-3 w-3 text-gray-500" />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-gray-400">Add Product</span>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="border-l pl-4 border-gray-200 dark:border-gray-700">
                    <Link to="/compare">
                        <Button disabled={compareList.length < 2} className="rounded-xl h-14">
                            Compare <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};