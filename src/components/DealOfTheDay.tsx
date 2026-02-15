import React from "react";
import { Product } from "../../types";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { Timer, ArrowRight, Star, Zap, Tag } from "lucide-react";

interface DealOfTheDayProps {
  products: Product[];
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ products }) => {
  const mainDeal = products?.[0];
  const sideDeals = products?.slice(1, 5) || [];

  if (!mainDeal) return null;

  /* ================= SAFE HELPERS ================= */

  const getImage = (product: Product) => {
    return product.images?.[0] || "";
  };

  const getPrice = (price: any) => {
    if (typeof price === "number") return price;
    if (price?.$numberDecimal) return Number(price.$numberDecimal);
    return Number(price) || 0;
  };

  const mainPrice = getPrice(mainDeal.price);

  /* ================================================= */

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
              <Timer className="h-5 w-5 text-red-500 animate-pulse" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-red-600 font-bold">
                Limited Time Offer
              </p>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Deal of the Day
              </h2>
            </div>
          </div>

          <Link
            to="/products"
            className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* MAIN DEAL */}
          <div className="lg:col-span-5 p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">

            <div>
              {/* Top Badge + Rating */}
              <div className="flex justify-between items-center mb-8">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Hot Deal
                </span>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-bold">
                    {Number(mainDeal.averageRating || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Image */}
              <Link to={`/product/${mainDeal._id}`}>
                <img
                  src={getImage(mainDeal)}
                  alt={mainDeal.name}
                  className="w-full h-72 object-contain mb-8 transition-transform duration-500 hover:scale-110"
                />
              </Link>

              {/* Category */}
              <div className="text-xs uppercase text-primary-600 font-bold mb-2 tracking-wide">
                {typeof mainDeal.category === "string"
                  ? mainDeal.category
                  : mainDeal.category?.name}
              </div>

              {/* Title */}
              <Link to={`/product/${mainDeal._id}`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 hover:text-primary-600 transition-colors">
                  {mainDeal.name}
                </h3>
              </Link>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  ₹{mainPrice.toLocaleString("en-IN")}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹{Math.round(mainPrice * 1.5).toLocaleString("en-IN")}
                </span>

                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                  33% OFF
                </span>
              </div>
            </div>

            {/* CTA */}
            <Button className="w-full h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all">
              Add to Cart
            </Button>
          </div>

          {/* SIDE DEALS */}
          <div className="lg:col-span-7 grid grid-cols-2 divide-x divide-y divide-gray-100 dark:divide-gray-800 bg-gray-50 dark:bg-dark-card">

            {sideDeals.map((product) => {
              const price = getPrice(product.price);

              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="p-6 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-center mb-4 h-40">
                    <img
                      src={getImage(product)}
                      alt={product.name}
                      className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <div className="text-xs uppercase text-gray-400 mb-1 tracking-wide">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name}
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 hover:text-primary-600 transition-colors">
                      {product.name}
                    </h4>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-400 line-through block">
                          ₹{Math.round(price * 1.3)}
                        </span>

                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Placeholder Slots */}
            {[...Array(Math.max(0, 4 - sideDeals.length))].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center p-6 bg-gray-50 dark:bg-dark-card"
              >
                <div className="text-center text-gray-400">
                  <Tag className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-bold uppercase">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};
