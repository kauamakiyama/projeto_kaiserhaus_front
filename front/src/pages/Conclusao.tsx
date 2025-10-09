import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Conclusao.css';
import { ProgressSteps } from '../components/ProgressSteps';

const Conclusao: React.FC = () => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    // Aqui você pode navegar para uma página de acompanhamento de pedido
    console.log('Acompanhar pedido');
  };

  const handleSkip = () => {
    // Aqui você pode navegar para a página inicial ou outra página
    navigate('/');
  };

  return (
    <>
      <Header />
      <div className="conclusao-page">
        <ProgressSteps current="conclusao" />

        <div className="success-card">
          <div className="success-icon">
            <img 
              src="/src/assets/niveis/check-mark.png" 
              alt="Sucesso" 
              className="checkmark-image"
            />
          </div>
          
          <div className="success-message">
            <h2 className="success-title">Pagamento realizado com sucesso!</h2>
          </div>
        </div>

        <div className="success-actions">
          <button 
            className="btn-track-order"
            onClick={handleTrackOrder}
          >
            Acompanhe de perto seu pedido
          </button>
          
          <button 
            className="btn-skip"
            onClick={handleSkip}
          >
            Pular
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Conclusao;
