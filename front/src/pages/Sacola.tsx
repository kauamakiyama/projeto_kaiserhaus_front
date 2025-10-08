import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sacola.css';
import { ProgressSteps } from '../components/ProgressSteps';

const Sacola: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const deliveryFee = 10.99;
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItemToDelete(id);
      setShowDeleteModal(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleContinue = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/sacola' } });
      return;
    }
    navigate('/entrega');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <>
      <Header />
      <div className="sacola-page">
        <ProgressSteps current="sacola" />

        <div className="cart-content">
          <h1 className="cart-title">Sua sacola</h1>
          
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{formatPrice(item.price)}</p>
                </div>
                
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Taxa de entrega</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="continue-btn" onClick={handleContinue}>Continuar</button>
          <a href="/cardapio" className="add-more-link">Adicionar mais itens</a>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Remover produto</h3>
              <p className="modal-message">
                Tem certeza que deseja remover este produto da sua sacola?
              </p>
              <div className="modal-buttons">
                <button 
                  className="modal-btn cancel-btn" 
                  onClick={cancelDelete}
                >
                  Cancelar
                </button>
                <button 
                  className="modal-btn confirm-btn" 
                  onClick={confirmDelete}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Sacola;
