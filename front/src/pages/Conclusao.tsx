import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Conclusao.css';
import { ProgressSteps } from '../components/ProgressSteps';
import { useCart } from '../contexts/CartContext';

const Conclusao: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const hasClearedCart = useRef(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  // Limpa o carrinho quando o usuário entra na tela de conclusão (apenas uma vez)
  useEffect(() => {
    if (!hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }

    // 1) tentar receber via state da navegação
    const statePedidoId =
      (location as any)?.state?.pedidoId !== undefined &&
      (location as any)?.state?.pedidoId !== null
        ? String((location as any).state.pedidoId)
        : null;

    // 2) tentar via querystring (ex.: /conclusao?pedidoId=123)
    const params = new URLSearchParams(window.location.search);
    const queryPedidoId = params.get('pedidoId');

    // 3) fallback salvo após o checkout
    const storedPedidoId = sessionStorage.getItem('ultimoPedidoId') || localStorage.getItem('kh-pedido-id');

    setPedidoId(statePedidoId || queryPedidoId || storedPedidoId || null);
  }, [clearCart, location]);

  const handleTrackOrder = () => {
    if (pedidoId) {
      navigate(`/acompanhar-pedido/${pedidoId}`);
    } else {
      alert('Não encontrei o ID do seu pedido. Volte ao início ou refaça o checkout.');
    }
  };

  const handleSkip = () => {
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
            <h2 className="success-title">Pedido realizado com sucesso!</h2>
          </div>
        </div>

        <div className="success-actions">
          <button
            className="btn-track-order"
            onClick={handleTrackOrder}
            disabled={!pedidoId}
            title={pedidoId ? `Acompanhar pedido #${pedidoId}` : 'ID do pedido não disponível'}
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
