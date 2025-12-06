"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Category = "all" | "headwear" | "tops" | "accessories";
export type SubFilter = "polos" | "hoodies" | null;

interface ShopFilterContextType {
  activeCategory: Category;
  subFilter: SubFilter;
  setActiveCategory: (category: Category) => void;
  setSubFilter: (filter: SubFilter) => void;
  setFilter: (category: Category, sub?: SubFilter) => void;
  isReady: boolean;
}

const ShopFilterContext = createContext<ShopFilterContextType | undefined>(undefined);

export function ShopFilterProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [subFilter, setSubFilter] = useState<SubFilter>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const setFilter = (category: Category, sub: SubFilter = null) => {
    setActiveCategory(category);
    setSubFilter(sub);
  };

  return (
    <ShopFilterContext.Provider
      value={{
        activeCategory,
        subFilter,
        setActiveCategory,
        setSubFilter,
        setFilter,
        isReady,
      }}
    >
      {children}
    </ShopFilterContext.Provider>
  );
}

export function useShopFilter() {
  const context = useContext(ShopFilterContext);
  if (context === undefined) {
    throw new Error("useShopFilter must be used within a ShopFilterProvider");
  }
  return context;
}
