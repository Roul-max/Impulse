import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { CategoryNav } from '../components/CategoryNav';
import { HeroBanner } from '../components/HeroBanner';
import { DealOfTheDay } from '../components/DealOfTheDay';
import { CategoryHighlights } from '../components/CategoryHighlights';
import { TrustSection } from '../components/TrustSection';
import { AppDownload } from '../components/AppDownload';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRODUCTS } from '../../constants';

export const Home = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            let allProducts: Product[] = [];
            
            try {
                const res = await ApiService.getProducts();
                if (res.products && Array.isArray(res.products) && res.products.length > 0) {
                    allProducts = res.products;
                }
            } catch (err) {
                console.warn("Backend fetch failed, falling back to mock data", err);
            }

            if (allProducts.length === 0) {
                allProducts = MOCK_PRODUCTS;
            }

            /* ---------------- FIXED SECTION ---------------- */
            // ❌ Removed repetition logic
            // ✅ Only take first 5 (no duplicates ever)
            const featured = allProducts.slice(0, 5);
            setFeaturedProducts(featured);
            /* ------------------------------------------------ */

            /* ---------------- RECOMMENDED LOGIC -------------- */
            const viewHistory: string[] = JSON.parse(
              localStorage.getItem('impulse_view_history') || '[]'
            );
            
            let recommended: Product[] = [];

            if (viewHistory.length > 0) {
                const historyItems = allProducts.filter(p =>
                    viewHistory.includes(p._id)
                );

                historyItems.sort(
                    (a, b) =>
                        viewHistory.indexOf(a._id) -
                        viewHistory.indexOf(b._id)
                );

                recommended = [...historyItems];
            }

            const remainingSlots = 4 - recommended.length;

            if (remainingSlots > 0) {
                const pool = allProducts
                    .filter(p => 
                        !featured.find(f => f._id === p._id) &&
                        !recommended.find(r => r._id === p._id)
                    );

                recommended = [
                    ...recommended,
                    ...pool.slice(0, remainingSlots),
                ];
            }

            if (recommended.length < 4) {
                const fallbackPool = allProducts.filter(
                    p => !recommended.find(r => r._id === p._id)
                );

                recommended = [
                    ...recommended,
                    ...fallbackPool.slice(0, 4 - recommended.length),
                ];
            }

            setRecommendedProducts(recommended.slice(0, 4));
            /* ------------------------------------------------ */

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200 font-body pb-20 md:pb-0">
      
      {/* 1. Category Discovery */}
      <CategoryNav />

      {/* 2. Hero (Emotion & Personalization) */}
      <HeroBanner />
      
      {/* 3. Trust Anchors */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 my-8 lg:-mt-10 lg:mb-20">
          <TrustSection />
      </div>

      <div className="flex flex-col gap-16 lg:gap-24 pb-20">
        
        {/* 4. Don't Miss Out Section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div className="flex items-center gap-4">
                     <div className="h-10 w-2 bg-gradient-to-b from-primary-600 to-accent rounded-full"></div>
                     <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading leading-none">Don't Miss Out</h2>
                        <p className="text-gray-500 mt-1">Today's best deals, curated just for you.</p>
                     </div>
                 </div>
                 {/* Optional: Add a countdown or category pill here */}
             </div>
             
             {/* Bento Grid Component */}
             <DealOfTheDay products={featuredProducts} />
        </section>

        {/* 5. Recommended for You Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-dark-card/30 dark:to-dark-bg py-16 border-y border-gray-100 dark:border-gray-800/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="flex gap-4">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl h-fit">
                            {user ? (
                                <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            ) : (
                                <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Recommended for You</h2>
                            <p className="text-gray-500 mt-1 max-w-md font-medium">
                                {user 
                                    ? "Based on your recent interests and views" 
                                    : "Trending items you might love"}
                            </p>
                        </div>
                    </div>
                    <Link to="/products">
                        <Button variant="ghost" className="group text-primary-600 dark:text-primary-400">
                            View All Recommendations <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                    </Link>
                </div>
                
                {/* 4-Column Grid for Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    
                    {/* Skeleton Loading */}
                    {loading && (
                        [...Array(4)].map((_, i) => (
                             <div key={i} className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                        ))
                    )}
                    
                    {/* Empty State Graceful Handling */}
                    {!loading && recommendedProducts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">
                            Check back later for personalized picks!
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 6. Collections */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-10 gap-4">
                 <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-heading leading-tight">Curated Collections</h2>
                    <p className="text-gray-500 mt-2 text-lg">Handpicked essentials for your lifestyle.</p>
                 </div>
                 <Link to="/products">
                    <Button variant="ghost" className="group">Explore All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Button>
                 </Link>
            </div>
            <CategoryHighlights />
        </section>

        {/* 7. App Download */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
            <AppDownload />
        </section>

      </div>
    </div>
  );
};