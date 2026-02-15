import React, { useEffect, useState, useMemo } from 'react';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/Skeleton';
import { cn } from '../../utils/cn';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
       fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, page]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
        const res = await ApiService.getProducts({ pageNumber: page, keyword });
        setProducts(res.products);
        setPages(res.pages);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Our Collection</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Explore the finest products tailored for you.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white transition-all shadow-sm"
                placeholder="Search items..."
                />
            </div>
            <button className="flex items-center justify-center h-full px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-dark-card p-3 border border-gray-100 dark:border-gray-800">
               <Skeleton className="aspect-[4/5] w-full rounded-xl" />
               <div className="px-1 space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-3 w-1/2" />
                   <div className="flex justify-between items-end pt-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                   </div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
            <ProductCard key={product._id} product={product} />
            ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
              {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={cn(
                        "h-10 w-10 rounded-xl text-sm font-bold transition-all border",
                        page === x + 1 
                         ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30" 
                         : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                      {x + 1}
                  </button>
              ))}
          </div>
      )}
    </div>
  );
};