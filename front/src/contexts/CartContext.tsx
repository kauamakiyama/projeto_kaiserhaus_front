import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  observacoes?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateObservacoes: (id: string, observacoes: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  reloadCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Carrega itens do localStorage na inicialização
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('kaizerhaus-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      return [];
    }
  });

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    try {
      localStorage.setItem('kaizerhaus-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cartItems]);

  // Sincroniza carrinho entre abas do navegador
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kaizerhaus-cart' && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Erro ao sincronizar carrinho entre abas:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateObservacoes = (id: string, observacoes: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, observacoes } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('kaizerhaus-cart');
    } catch (error) {
      console.error('Erro ao limpar carrinho do localStorage:', error);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const reloadCart = () => {
    try {
      const savedCart = localStorage.getItem('kaizerhaus-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Erro ao recarregar carrinho do localStorage:', error);
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateObservacoes,
    clearCart,
    getTotalItems,
    getTotalPrice,
    reloadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
