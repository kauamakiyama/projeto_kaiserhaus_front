import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PixPagamento.css';
import { ProgressSteps } from '../components/ProgressSteps';

const PixPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Código PIX simulado (em uma aplicação real, viria do backend)
  const pixCode = "00020126580014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913KaiserHaus LTDA6009Sao Paulo62070503***63041D3D";

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar código PIX:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="pix-page">
        <ProgressSteps current="pagamento" />

        <div className="pix-card">
          <div className="pix-header">
            <h2 className="pix-title">Informações de pagamento</h2>
          </div>

          <div className="pix-content">
            <p className="pix-instructions">
              Realize o pagamento pelo seu banco preferido escaneando a imagem ou colando o código do QR Code
            </p>

            <div className="qr-code-container">
              <div className="qr-code">
                <img 
                  src="/src/assets/pagamento/qrcode.png" 
                  alt="QR Code PIX" 
                  className="qr-image"
                />
              </div>
            </div>

            <div className="pix-actions">
              <button 
                className={`btn-copy-pix ${copied ? 'copied' : ''}`}
                onClick={handleCopyPixCode}
              >
                {copied ? 'Código copiado!' : 'Copiar código Pix'}
              </button>
              
              <button 
                className="btn-continue"
                onClick={() => navigate('/conclusao')}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PixPagamento;
