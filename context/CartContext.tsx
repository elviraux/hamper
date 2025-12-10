import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/data/products';

// Storage key for AsyncStorage
const CART_STORAGE_KEY = '@pig_of_the_month_cart';

// Cart item interface
export interface CartItem {
  id: string; // Unique instance ID (productId + plan combination)
  product: Product;
  quantity: number;
  selectedPlan?: string; // e.g., "3-months", "6-months", "12-months"
}

// Plan option interface
export interface PlanOption {
  id: string;
  label: string;
  value: string;
}

// Plan options for subscription products
export const planOptions: PlanOption[] = [
  { id: '3', label: '3 Months', value: '3-months' },
  { id: '6', label: '6 Months', value: '6-months' },
  { id: '12', label: '12 Months', value: '12-months' },
];

// Get plan label by value
export const getPlanLabel = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  return planOptions.find((p) => p.value === value)?.label;
};

// Context type definition
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, plan?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  isLoading: boolean;
}

// Create context with default values
const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate unique cart item ID based on product and plan
const generateCartItemId = (productId: string, plan?: string): string => {
  return plan ? `${productId}_${plan}` : productId;
};

// CartProvider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setItems(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever items change
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };

    // Only save after initial load is complete
    if (!isLoading) {
      saveCart();
    }
  }, [items, isLoading]);

  // Add item to cart
  const addToCart = useCallback((product: Product, plan?: string) => {
    const cartItemId = generateCartItemId(product.id, plan);

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === cartItemId);

      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      }

      // New item, add to cart
      const newItem: CartItem = {
        id: cartItemId,
        product,
        quantity: 1,
        selectedPlan: plan,
      };
      return [...prevItems, newItem];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate total items count
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Calculate cart total (subtotal)
  const cartTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    cartTotal,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
