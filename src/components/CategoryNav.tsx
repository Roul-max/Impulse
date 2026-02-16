import React, { useState } from 'react';
import { 
  ShoppingBasket, Smartphone, Shirt, Laptop, Armchair, Tv, 
  Plane, Sparkles, Bike, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const categories = [
  { 
    name: 'Grocery', 
    icon: ShoppingBasket, 
    path: '/products?category=Grocery',
    subcategories: ['Fruits & Veggies', 'Dairy', 'Snacks', 'Beverages', 'Household Care'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop'
  },
  { 
    name: 'Mobiles', 
    icon: Smartphone, 
    path: '/products?category=Mobiles',
    subcategories: ['Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Accessories', 'Tablets'],
    image: 'https://darlingretail.com/cdn/shop/files/iPhone_15_Blue_Pure_Back_iPhone_15_Blue_Pure_Front_2up_Screen__WWEN_600x.jpg?v=1695103868'
  },
  { 
    name: 'Fashion', 
    icon: Shirt, 
    path: '/products?category=Fashion',
    subcategories: ["Men's Top Wear", "Women's Western", "Kids", "Footwear", "Watches", "Bags"],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop'
  },
  { 
    name: 'Electronics', 
    icon: Laptop, 
    path: '/products?category=Electronics',
    subcategories: ['Laptops', 'Cameras', 'Gaming Consoles', 'Smart Home', 'Power Banks', 'Printers'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0RnrYFJ6qXOI1cGD4FMU2iBZbYqRBzvOX5g&s'
  },
  { 
    name: 'Home', 
    icon: Armchair, 
    path: '/products?category=Home',
    subcategories: ['Furniture', 'Decor', 'Kitchen & Dining', 'Lighting', 'Storage', 'Tools'],
    image: 'https://static-assets.business.amazon.com/assets/in/24th-jan/705_Website_Blog_Appliances_1450x664.jpg.transform/1450x664/image.jpg'
  },
  { 
    name: 'Appliances', 
    icon: Tv, 
    path: '/products?category=Appliances',
    subcategories: ['Televisions', 'Washing Machines', 'ACs', 'Refrigerators', 'Kitchen Appliances'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRthR3H3k7m_jqFAi_K0ioET3pgUcPs_dffQQ&s'
  },
  { 
    name: 'Travel', 
    icon: Plane, 
    path: '/products?category=Travel',
    subcategories: ['Luggage', 'Backpacks', 'Travel Accessories', 'Camping Gear'],
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'
  },
  { 
    name: 'Beauty', 
    icon: Sparkles, 
    path: '/products?category=Beauty',
    subcategories: ['Makeup', 'Skincare', 'Haircare', 'Fragrances', 'Grooming'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUhejO33GvUBrdyhWShK6WPwNGCCQKibGEWA&s'
  },
  { 
    name: 'Vehicles', 
    icon: Bike, 
    path: '/products?category=Vehicles',
    subcategories: ['Electric Bikes', 'Scooters', 'Car Accessories', 'Helmets', 'Cleaning Kits'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpJN_-t0Rbf00BeJ_bent28m5drYHAhyrq9g&s'
  },
];

export const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-gray-800 shadow-sm relative z-30" onMouseLeave={() => setActiveCategory(null)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 md:gap-8 overflow-x-auto py-3 scrollbar-hide snap-x justify-start md:justify-center">
          {categories.map((cat, idx) => (
            <div 
                key={idx} 
                className="group"
                onMouseEnter={() => setActiveCategory(cat.name)}
            >
                <Link 
                  to={cat.path}
                  className="flex flex-col items-center min-w-[60px] cursor-pointer snap-start transition-transform active:scale-95"
                >
                  <div className={cn(
                      "h-10 w-10 mb-1.5 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all duration-300 border border-gray-100 dark:border-gray-700",
                      "group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:shadow-md group-hover:-translate-y-0.5",
                      activeCategory === cat.name && "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-md -translate-y-0.5"
                  )}>
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                      "text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center whitespace-nowrap transition-colors",
                      "group-hover:text-primary-600 dark:group-hover:text-primary-400",
                      activeCategory === cat.name && "text-primary-600 dark:text-primary-400 font-bold"
                  )}>
                    {cat.name}
                  </span>
                </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <div 
        className={cn(
            "absolute left-0 top-full w-full bg-white dark:bg-dark-card border-b border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 origin-top z-40 hidden md:block",
            activeCategory ? "opacity-100 visible scale-y-100" : "opacity-0 invisible scale-y-95"
        )}
      >
          {activeCategory && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                  {categories.map((cat) => {
                      if (cat.name !== activeCategory) return null;
                      return (
                          <div key={cat.name} className="grid grid-cols-12 gap-8">
                              {/* Subcategories List */}
                              <div className="col-span-3">
                                  <h4 className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                                      <cat.icon className="h-4 w-4" /> Shop {cat.name}
                                  </h4>
                                  <ul className="space-y-2">
                                      {cat.subcategories.map((sub, i) => (
                                          <li key={i}>
                                              <Link 
                                                to={`${cat.path}&sub=${sub}`}
                                                className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 transition-all"
                                              >
                                                  {sub}
                                              </Link>
                                          </li>
                                      ))}
                                      <li>
                                          <Link to={cat.path} className="text-sm font-bold text-gray-900 dark:text-white mt-4 inline-flex items-center hover:underline">
                                              View All <ChevronRight className="h-3 w-3 ml-1" />
                                          </Link>
                                      </li>
                                  </ul>
                              </div>
                              
                              {/* Popular Picks (Mock) */}
                              <div className="col-span-5">
                                   <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-4">Popular in {cat.name}</h4>
                                   <div className="grid grid-cols-2 gap-4">
                                       {[1, 2].map((item) => (
                                           <div key={item} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group/item">
                                               <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                                                   <img src={cat.image} className="h-full w-full object-cover group-hover/item:scale-110 transition-transform" alt="" />
                                               </div>
                                               <div>
                                                   <div className="text-xs font-bold text-gray-900 dark:text-white mb-1 group-hover/item:text-primary-600">Trending Item {item}</div>
                                                   <div className="text-[10px] text-gray-500">Best Seller</div>
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                              </div>

                              {/* Featured Image */}
                              <div className="col-span-4">
                                  <div className="relative h-full w-full rounded-xl overflow-hidden group/img">
                                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                          <h4 className="text-white font-bold text-xl mb-1">{cat.name} Collection</h4>
                                          <p className="text-white/80 text-xs mb-3">Discover the latest trends and best deals.</p>
                                          <Link to={cat.path}>
                                            <button className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                                                Explore Now
                                            </button>
                                          </Link>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}
      </div>
    </div>
  );
};