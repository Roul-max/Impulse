import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { Button } from '../components/Button';
import { PriceHistory } from '../components/PriceHistory';
import { AnalyticsService } from '../../services/analytics';
import { Star, Truck, Shield, ArrowLeft, Check, Eye, AlertCircle, ShoppingCart, Heart, Share2, TrendingUp, User, Scale, Undo2 } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { cn } from '../../utils/cn';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [viewers, setViewers] = useState(0);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

    const { addToCart } = useCart();
    const { addToCompare } = useCompare();

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        AnalyticsService.logEvent('view_item', { productId: id });

        const fetchProduct = async () => {
            try {
                const data = await ApiService.getProductById(id);

                // 🔥 SAFETY: Normalize Decimal128 just in case
                const normalizedProduct = {
                    ...data,
                    price:
                        typeof data.price === 'object'
                            ? Number((data.price as any)?.$numberDecimal || 0)
                            : Number(data.price),
                    discountedPrice:
                        typeof data.discountedPrice === 'object'
                            ? Number((data.discountedPrice as any)?.$numberDecimal || 0)
                            : Number(data.discountedPrice),
                };

                setProduct(normalizedProduct);

                const allProducts = await ApiService.getProducts();

                setSimilarProducts(
                    allProducts.products
                        .filter((p: Product) => p._id !== data._id)
                        .slice(0, 3)
                );

            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();

        setViewers(Math.floor(Math.random() * (45 - 12 + 1)) + 12);
    }, [id]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="mt-10 lg:mt-0 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-1/2" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-8 text-center">
                Product not found.
                <Link to="/products" className="text-primary-600 underline">
                    {" "}Go back
                </Link>
            </div>
        );
    }

    // 🔥 Safe numeric price (prevents crash)
    const safePrice = Number(product.price) || 0;

    const images =
        product.images?.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    const stockPercentage = Math.min((product.stock / 50) * 100, 100);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in pb-32">
            <nav className="flex items-center text-sm font-medium text-gray-500 mb-6">
                <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 dark:text-gray-100 truncate">{product.name}</span>
            </nav>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
                {/* Left Column: Images */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 relative group">
                        <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 transition-colors tooltip" aria-label="Wishlist">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-primary-600 transition-colors tooltip" aria-label="Share">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button onClick={() => addToCompare(product)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:text-primary-600 transition-colors tooltip" aria-label="Compare">
                                <Scale className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setSelectedImage(idx)}
                                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === idx ? 'border-primary-600 ring-1 ring-primary-600 opacity-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Info */}
                <div className="mt-10 lg:mt-0 lg:col-span-5 flex flex-col h-full">
                    {/* Social Proof Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 mb-4 w-fit animate-pulse">
                        <Eye className="h-3 w-3" /> {viewers} people are viewing this right now
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading leading-tight">{product.name}</h1>

                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-bold">
                            {product.averageRating?.toFixed(1) || '4.5'} <Star className="h-3 w-3 ml-1 fill-current" />
                        </div>
                        <span className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer underline decoration-dotted">{product.totalReviews} verified reviews</span>
                    </div>

                    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</p>
                            <p className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}</p>
                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">25% OFF</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            Inclusive of all taxes.
                            <span className="text-primary-600 font-bold bg-primary-50 px-1 rounded border border-primary-100">EMI starts at ₹{Math.round(product.price / 12)}/mo</span>
                        </p>
                    </div>

                    {/* Urgency Stock Bar */}
                    {product.stock < 20 && (
                        <div className="mb-6 bg-orange-50 p-3 rounded-lg border border-orange-100 animate-fade-in">
                            <div className="flex justify-between text-xs font-bold text-orange-800 mb-1">
                                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Hurry! Only {product.stock} units left</span>
                                <span>{Math.round(stockPercentage)}% Sold</span>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${100 - stockPercentage}%` }}></div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex gap-4 mb-8">
                        <Button
                            size="lg"
                            onClick={() => {
                                addToCart(product);
                                AnalyticsService.logEvent('add_to_cart', { productId: product._id, price: product.price });
                            }}
                            className="flex-1 shadow-xl shadow-primary-500/20 text-lg h-14"
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button size="lg" variant="secondary" className="px-6 h-14">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Trust Anchors - Conversion Optimization */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50 transition-colors">
                            <Truck className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Get it by {deliveryDate.toLocaleDateString('en-IN', dateOptions)}</p>
                                <p className="text-xs text-gray-500">Free Delivery</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50 transition-colors">
                            <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">1 Year Warranty</p>
                                <p className="text-xs text-gray-500">Brand authorized</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50 transition-colors">
                            <Undo2 className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">7 Day Returns</p>
                                <p className="text-xs text-gray-500">No questions asked</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50 transition-colors">
                            <Check className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Genuine Product</p>
                                <p className="text-xs text-gray-500">100% Authentic</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                        <p>{product.description}</p>
                    </div>

                    {/* Price History Graph */}
                    <div className="mb-8">
                        <PriceHistory currentPrice={product.price} />
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 lg:hidden z-50 flex items-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-6 safe-area-bottom">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 line-through">₹{Math.round(product.price * 1.25)}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <Button
                    size="lg"
                    onClick={() => {
                        addToCart(product);
                        AnalyticsService.logEvent('add_to_cart', { productId: product._id, price: product.price });
                    }}
                    className="flex-1 shadow-lg font-bold rounded-xl"
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
            </div>

{/* Reviews Section */}
<div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-12">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-heading">
        Verified Customer Reviews
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
            {
                name: "Avantika Sharma",
                rating: 5,
                review:
                    "Absolutely loving this product! The build quality feels premium and delivery was super fast. Totally worth the price.",
                date: "2 days ago"
            },
            {
                name: "Rohan Mehta",
                rating: 4,
                review:
                    "Great value for money. Performance is smooth and packaging was secure. Would definitely recommend to others.",
                date: "5 days ago"
            },
            {
                name: "Priya Kapoor",
                rating: 5,
                review:
                    "Exceeded my expectations! Looks exactly like the pictures and works flawlessly. Customer support was helpful too.",
                date: "1 week ago"
            }
        ].map((review, i) => (
            <div
                key={i}
                className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {review.name}
                            </p>
                            <div className="flex text-yellow-400">
                                {[...Array(review.rating)].map((_, si) => (
                                    <Star key={si} className="h-3 w-3 fill-current" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{review.review}"
                </p>

                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold">
                    <Check className="h-3 w-3" /> Verified Purchase
                </div>
            </div>
        ))}
    </div>
</div>


            {/* Frequently Bought Together */}
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-heading flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-accent" /> Frequently Bought Together
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {similarProducts.map(p => (
                        <Link key={p._id} to={`/product/${p._id}`} className="group bg-white dark:bg-dark-card rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                            <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden mb-3">
                                <img
                                    src={
                                        p.images && p.images.length > 0
                                            ? p.images[0]
                                            : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                                    }
                                    alt={p.name}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{p.name}</h3>
                            <p className="text-sm font-bold text-gray-500">₹{p.price.toLocaleString('en-IN')}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};