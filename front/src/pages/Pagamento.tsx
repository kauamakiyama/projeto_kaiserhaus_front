import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Pagamento.css';
import { ProgressSteps } from '../components/ProgressSteps';

const Pagamento: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');

  const handleContinue = () => {
    if (selectedPayment === 'pix') {
      navigate('/pix-pagamento');
    } else {
      // Para cartão e dinheiro, ir para próxima etapa (conclusão)
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

            <div className="payment-option">
              <input
                type="radio"
                id="cartao"
                name="payment"
                value="cartao"
                checked={selectedPayment === 'cartao'}
                onChange={() => setSelectedPayment('cartao')}
                className="payment-radio"
              />
              <label htmlFor="cartao" className="payment-label">
                <div className="payment-radio-circle"></div>
                <div className="payment-content">
                  <div className="card-logos">
                    <img src="/src/assets/pagamento/cartoes.png" alt="Cartões" className="card-image" />
                  </div>
                </div>
              </label>
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
