import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import '../styles/Sacola.css';

const Sacola: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
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

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="sacola-page">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-step active">
          <div className="step-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            </svg>
          </div>
          <span className="step-text">Sacola</span>
        </div>
        
        <div className="progress-line active"></div>
        
        <div className="progress-step">
          <div className="step-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7H16V6C16 3.79 14.21 2 12 2S8 3.79 8 6V7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7M10 6C10 4.9 10.9 4 12 4S14 4.9 14 6V7H10V6M19 18H5V9H19V18Z"/>
            </svg>
          </div>
          <span className="step-text">Entrega</span>
        </div>
        
        <div className="progress-line"></div>
        
        <div className="progress-step">
          <div className="step-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 18H4V6H20V18Z"/>
            </svg>
          </div>
          <span className="step-text">Pagamento</span>
        </div>
        
        <div className="progress-line"></div>
        
        <div className="progress-step">
          <div className="step-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
            </svg>
          </div>
          <span className="step-text">Conclusão</span>
        </div>
      </div>

      {/* Cart Content */}
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
      
      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="continue-btn">Continuar</button>
        <a href="/cardapio" className="add-more-link">Adicionar mais itens</a>
      </div>

      {/* Delete Confirmation Modal */}
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
  );
};

export default Sacola;
