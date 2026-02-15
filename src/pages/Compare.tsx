import React from 'react';
import { useCompare } from '../context/CompareContext';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { X, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Compare = () => {
  const { compareList, removeFromCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No products to compare</h2>
            <p className="text-gray-500 mb-6">Add products to comparison list to see them here.</p>
            <Link to="/products"><Button>Browse Products</Button></Link>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white font-heading">Product Comparison</h1>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="p-4 border-b border-gray-200 dark:border-gray-800 min-w-[200px] bg-white dark:bg-dark-card sticky left-0 z-10">
                            <span className="text-gray-500 font-medium">Features</span>
                        </th>
                        {compareList.map(product => (
                            <th key={product._id} className="p-4 border-b border-gray-200 dark:border-gray-800 min-w-[250px] align-top relative bg-white dark:bg-dark-card">
                                <button 
                                    onClick={() => removeFromCompare(product._id)}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <img src={product.image} alt={product.name} className="h-40 w-full object-contain mb-4" />
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{product.name}</h3>
                                <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">₹{product.price.toLocaleString('en-IN')}</div>
                                <Button onClick={() => addToCart(product)} className="w-full">Add to Cart</Button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr>
                        <td className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold bg-gray-50 dark:bg-gray-800 sticky left-0">Rating</td>
                        {compareList.map(product => (
                            <td key={product._id} className="p-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">{product.averageRating}</span> 
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-gray-500">({product.totalReviews})</span>
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold bg-gray-50 dark:bg-gray-800 sticky left-0">Category</td>
                        {compareList.map(product => (
                            <td key={product._id} className="p-4 border-b border-gray-100 dark:border-gray-800">
                                {typeof product.category === 'string' ? product.category : product.category.name}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold bg-gray-50 dark:bg-gray-800 sticky left-0">Description</td>
                        {compareList.map(product => (
                            <td key={product._id} className="p-4 border-b border-gray-100 dark:border-gray-800">
                                <p className="line-clamp-4 text-gray-600 dark:text-gray-400">{product.description}</p>
                            </td>
                        ))}
                    </tr>
                     {/* Features Dynamic Rows - assuming generic matching for demo */}
                     {[0,1,2,3].map(idx => (
                         <tr key={idx}>
                             <td className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold bg-gray-50 dark:bg-gray-800 sticky left-0">Feature {idx + 1}</td>
                             {compareList.map(product => (
                                 <td key={product._id} className="p-4 border-b border-gray-100 dark:border-gray-800">
                                     {product.features?.[idx] ? (
                                         <div className="flex items-center gap-2">
                                             <Check className="h-4 w-4 text-green-500" />
                                             {product.features[idx]}
                                         </div>
                                     ) : (
                                         <span className="text-gray-400">-</span>
                                     )}
                                 </td>
                             ))}
                         </tr>
                     ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};