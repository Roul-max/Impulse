import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children?: ReactNode }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const addToCompare = (product: Product) => {
    if (compareList.find(p => p._id === product._id)) {
      showToast("Already in comparison list", "info");
      return;
    }
    if (compareList.length >= 3) {
      showToast("You can compare max 3 products", "error");
      return;
    }
    setCompareList(prev => [...prev, product]);
    setIsOpen(true);
    showToast("Added to comparison", "success");
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsOpen(false);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isOpen, setIsOpen }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
};