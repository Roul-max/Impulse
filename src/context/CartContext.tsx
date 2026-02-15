import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // ✅ Load cart only when user is authenticated
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const loadCart = async () => {
      setIsLoading(true);
      try {
        const data: any = await ApiService.getCart();
        setItems(data?.items || []);
      } catch (error: any) {
        // Silently ignore unauthorized errors
        if (error.response?.status !== 401) {
          console.error("Failed to load cart", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const addToCart = async (product: Product, qty: number = 1) => {
    if (!user) {
      showToast("Please login to add items to cart", "error");
      return;
    }

    try {
      const data: any = await ApiService.addToCart(product._id, qty);
      setItems(data?.items || []);
      showToast("Added to cart", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to add to cart",
        "error"
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const data: any = await ApiService.removeFromCart(productId);
      setItems(data?.items || []);
      showToast("Item removed", "info");
    } catch (error: any) {
      showToast("Failed to remove item", "error");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    const oldItems = [...items];

    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );

    try {
      await ApiService.updateCartItem(productId, quantity);
    } catch (error: any) {
      // Revert if failed
      setItems(oldItems);
      showToast(
        error.response?.data?.message || "Failed to update quantity",
        "error"
      );
    }
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
