import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Pagamento.css';
import { ProgressSteps } from '../components/ProgressSteps';

type Card = {
  id: string;
  brand: string;
  last4: string;
  type: string;
};

const Pagamento: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Simulando cartões cadastrados (em produção viria da API)
  const [userCards] = useState<Card[]>([
    {
      id: '1',
      brand: 'Mastercard',
      last4: '9253',
      type: 'Crédito'
    }
  ]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCardDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardPaymentSelect = () => {
    setShowCardDropdown(!showCardDropdown);
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setShowCardDropdown(false);
  };

  const handleAddNewCard = () => {
    // Aqui você pode navegar para uma página de adicionar cartão ou mostrar um formulário
    console.log('Adicionar novo cartão');
    setShowCardDropdown(false);
  };

  const handleContinue = () => {
    if (selectedPayment === 'pix') {
      navigate('/pix-pagamento');
    } else if (selectedPayment === 'cartao' && selectedCard) {
      navigate('/conclusao');
    } else {
      // Para dinheiro, ir para próxima etapa (conclusão)
      navigate('/conclusao');
    }
  };

  return (
    <>
      <Header />
      <div className="pagamento-page">
        <ProgressSteps current="pagamento" />

        <div className="pagamento-card">
          <div className="pagamento-header">
            <h2 className="pagamento-title">Pagamento</h2>
            <div className="pagamento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" fill="#4a1f0e"/>
                <circle cx="18" cy="6" r="3" fill="#4a1f0e"/>
              </svg>
            </div>
          </div>
          <div className="pagamento-divider"></div>

          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="pix"
                name="payment"
                value="pix"
                checked={selectedPayment === 'pix'}
                onChange={() => setSelectedPayment('pix')}
                className="payment-radio"
              />
              <label htmlFor="pix" className="payment-label">
                <div className="payment-radio-circle"></div>
                <div className="payment-content">
                  <div className="pix-logo">
                    <img src="/src/assets/pagamento/pix.png" alt="PIX" className="pix-image" />
                  </div>
                </div>
              </label>
            </div>

            <div className="payment-option payment-option--card" ref={dropdownRef}>
              <input
                type="radio"
                id="cartao"
                name="payment"
                value="cartao"
                checked={selectedPayment === 'cartao'}
                onChange={() => setSelectedPayment('cartao')}
                className="payment-radio"
              />
              <label htmlFor="cartao" className="payment-label" onClick={handleCardPaymentSelect}>
                <div className="payment-radio-circle"></div>
                <div className="payment-content">
                  <div className="card-logos">
                    <img src="/src/assets/pagamento/cartoes.png" alt="Cartões" className="card-image" />
                  </div>
                  {selectedCard && (
                    <div className="selected-card-info">
                      <span className="card-brand">{selectedCard.brand}</span>
                      <span className="card-number">**** {selectedCard.last4}</span>
                    </div>
                  )}
                </div>
              </label>

              {/* Dropdown de Seleção de Cartão */}
              {showCardDropdown && (
                <div className="card-dropdown">

                  <div className="card-options">
                    {userCards.map((card) => (
                      <div key={card.id} className="card-option" onClick={() => handleCardSelect(card)}>
                        <div className="card-radio"></div>
                        <div className="card-info">
                          <div className="card-brand-logo">
                            <img src="/src/assets/pagamento/mastercard-logo.png" alt={card.brand} className="card-brand-img" />
                          </div>
                          <div className="card-details">
                            <span className="card-type">{card.type}</span>
                            <span className="card-brand">{card.brand}</span>
                            <span className="card-number">**** {card.last4}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="add-card-option" onClick={handleAddNewCard}>
                      <div className="add-card-icon">+</div>
                      <span className="add-card-text">Adicionar cartão</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="dinheiro"
                name="payment"
                value="dinheiro"
                checked={selectedPayment === 'dinheiro'}
                onChange={() => setSelectedPayment('dinheiro')}
                className="payment-radio"
              />
              <label htmlFor="dinheiro" className="payment-label">
                <div className="payment-radio-circle"></div>
                <div className="payment-content">
                  <div className="cash-icon">
                    <img src="/src/assets/pagamento/dinheiro.png" alt="Dinheiro" className="money-image" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="payment-note">
            <p>*Caso seja escolhido dinheiro como forma de pagamento, a finalização da compra será realizada na entrega</p>
          </div>

          <div className="pagamento-actions">
            <button 
              className="btn-continue"
              onClick={handleContinue}
            >Continuar</button>
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
};

export default Pagamento;
