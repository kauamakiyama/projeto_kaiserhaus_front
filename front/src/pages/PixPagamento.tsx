import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PixPagamento.css';
import { ProgressSteps } from '../components/ProgressSteps';
import { apiGet } from '../services/api';

const PixPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Carrega dados do PIX gerados na etapa anterior
  const pixData = useMemo(() => {
    try {
      const raw = localStorage.getItem('kh-pix');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { copiaECola: string; qrcode: string };
      console.log('PIX data loaded:', { hasQrcode: !!parsed.qrcode, hasCopiaECola: !!parsed.copiaECola });
      return parsed;
    } catch (e) {
      console.error('Erro ao carregar dados PIX:', e);
      return null;
    }
  }, []);

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixData?.copiaECola || '');
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
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
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
