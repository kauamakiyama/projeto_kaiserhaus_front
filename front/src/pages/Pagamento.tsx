import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Pagamento.css';
import { ProgressSteps } from '../components/ProgressSteps';
import { apiPost, apiGet } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

type Card = {
  id: string;
  brand: string;
  last4: string;
  type: string;
};

type NewCard = {
  numero: string;
  mes: string;
  ano: string;
  cvv: string;
  nome: string;
};

const Pagamento: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { token } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'cartao' | 'dinheiro' | null>(null);
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para o formulário de novo cartão
  const [newCard, setNewCard] = useState<NewCard>({
    numero: '',
    mes: '',
    ano: '',
    cvv: '',
    nome: ''
  });

  // Lista de cartões do usuário
  const [userCards, setUserCards] = useState<Card[]>([]);

  // Carregar cartões do usuário ao montar o componente
  useEffect(() => {
    if (token) {
      loadUserCards();
    }
  }, [token]);

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

  // Função para carregar cartões do usuário
  const loadUserCards = async () => {
    if (!token) return;

    setIsLoadingCards(true);
    try {
      const cards = await apiGet<Card[]>('/cartoes/', token);
      setUserCards(cards);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      // Se não conseguir carregar, mantém array vazio
      setUserCards([]);
    } finally {
      setIsLoadingCards(false);
    }
  };

  const handleCardPaymentSelect = () => {
    setShowCardDropdown(!showCardDropdown);
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    // Mantém o dropdown aberto para o usuário confirmar/visualizar
  };

  const handleAddNewCard = () => {
    setShowAddCardModal(true);
    setShowCardDropdown(false);
  };

  const handleCloseModal = () => {
    setShowAddCardModal(false);
    setNewCard({
      numero: '',
      mes: '',
      ano: '',
      cvv: '',
      nome: ''
    });
  };

  const handleInputChange = (field: keyof NewCard, value: string) => {
    setNewCard(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espaços
  };

  const handleSaveCard = async () => {
    if (!token) {
      alert('Você precisa estar logado para salvar um cartão.');
      return;
    }

    // Validações básicas
    if (!newCard.numero || !newCard.mes || !newCard.ano || !newCard.cvv || !newCard.nome) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (newCard.cvv.length !== 3) {
      alert('Código de segurança deve ter exatamente 3 dígitos.');
      return;
    }

    setIsSavingCard(true);
    try {
      const cardData = {
        numero: newCard.numero.replace(/\D/g, ''),
        mes: newCard.mes,
        ano: newCard.ano,
        cvv: newCard.cvv,
        nome: newCard.nome
        // Bandeira detectada no backend
      };

      const savedCard = await apiPost<Card>('/cartoes/', cardData, token);

      // Atualiza a lista de cartões
      setUserCards(prev => [...prev, savedCard]);

      // Seleciona o cartão recém-criado
      setSelectedCard(savedCard);

      // Fecha o modal
      handleCloseModal();

      alert('Cartão salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      alert((error as Error).message || 'Erro ao salvar cartão');
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleContinue = async () => {
    // Valida se um tipo de pagamento foi selecionado
    if (!selectedPayment) {
      alert('Por favor, selecione uma forma de pagamento.');
      return;
    }

    // Monta payload do pedido a partir do carrinho e entrega persistida
    const entregaRaw = localStorage.getItem('kh-entrega');
    const entregaParsed = entregaRaw ? JSON.parse(entregaRaw) : null;
    const itens = cartItems.map((i) => {
      const isNumericId = /^\d+$/.test(String(i.id));
      const quantidade = parseInt(String(i.quantity), 10);
      const item = {
        produtoId: isNumericId ? parseInt(String(i.id), 10) : String(i.id),
        quantidade: isNaN(quantidade) ? 1 : quantidade,
        observacoes: i.observacoes || null,
      };
      return item;
    });

    const pagamento =
      selectedPayment === 'cartao'
        ? { metodo: 'cartao', cartaoId: selectedCard ? parseInt(String(selectedCard.id), 10) : null, trocoPara: null }
        : selectedPayment === 'dinheiro'
        ? { metodo: 'dinheiro', cartaoId: null, trocoPara: null }
        : selectedPayment === 'pix'
        ? { metodo: 'pix', cartaoId: null, trocoPara: null }
        : { metodo: 'pix', cartaoId: null, trocoPara: null }; // fallback

    const body = {
      itens,
      entrega: {
        tipo: entregaParsed?.tipo || 'padrao',
        endereco: entregaParsed?.endereco || {
          logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', complemento: ''
        },
      },
      pagamento,
    } as any;

    try {
      if (!token) {
        throw new Error('Você precisa estar logado para finalizar o pedido.');
      }

      // Cria o pedido
      const pedido = await apiPost<{ pedidoId: number; total: number }>(
        '/pedidos/',
        body,
        token
      );

      // Salva o ID real para fallback em Conclusao/PixPagamento
      sessionStorage.setItem('ultimoPedidoId', String(pedido.pedidoId));
      localStorage.setItem('kh-pedido-id', String(pedido.pedidoId)); // se você usa em outros lugares

      if (selectedPayment === 'pix') {
        const pix = await apiPost<{ pedidoId: number; qrcode: string; copiaECola: string; expiraEm: number }>(
          '/pagamentos/pix/',
          { pedidoId: pedido.pedidoId, valor: pedido.total },
          token
        );

        localStorage.setItem('kh-pix', JSON.stringify(pix));

        navigate('/pix-pagamento'); // Tela vai carregar dados do localStorage e levar pedidoId adiante
        return;
      }

      // Cartão ou dinheiro: seguir para conclusão com o ID real
      navigate('/conclusao', { state: { pedidoId: pedido.pedidoId } });
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Erro ao criar pedido');
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
                </div>
              </label>

              {/* Dropdown de Seleção de Cartão */}
              {showCardDropdown && (
                <div className="card-dropdown">
                  <div className="card-options">
                    {isLoadingCards ? (
                      <div className="loading-cards">Carregando cartões...</div>
                    ) : userCards.length > 0 ? (
                      userCards.map((card) => (
                        <div
                          key={card.id}
                          className={`card-option ${selectedCard?.id === card.id ? 'selected' : ''}`}
                          onClick={() => handleCardSelect(card)}
                        >
                          <div className={`card-radio ${selectedCard?.id === card.id ? 'selected' : ''}`}></div>
                          <div className="card-info">
                            <div className="card-brand-logo">
                              <img src="/src/assets/niveis/money.png" alt={card.brand} className="card-brand-img" />
                            </div>
                            <div className="card-details">
                              <span className="card-type">{card.type}</span>
                              <span className="card-number">**** {card.last4}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-cards">Nenhum cartão cadastrado</div>
                    )}

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

      {/* Modal para Adicionar Cartão */}
      {showAddCardModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Informação de pagamento:</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="card-number">Número do cartão</label>
                <input
                  type="text"
                  id="card-number"
                  value={newCard.numero}
                  onChange={(e) => handleInputChange('numero', formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                <div className="card-brands">
                  <img src="/src/assets/pagamento/cartoes.png" alt="Bandeiras de cartão" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry-month">Data de validade</label>
                  <div className="expiry-inputs">
                    <input
                      type="text"
                      id="expiry-month"
                      value={newCard.mes}
                      onChange={(e) => handleInputChange('mes', e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="MM"
                      maxLength={2}
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={newCard.ano}
                      onChange={(e) => handleInputChange('ano', e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="AA"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">Código de segurança</label>
                  <input
                    type="text"
                    id="cvv"
                    value={newCard.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="CVV"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="card-name">Nome no cartão</label>
                <input
                  type="text"
                  id="card-name"
                  value={newCard.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome como está no cartão"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={handleCloseModal}
                disabled={isSavingCard}
              >
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={handleSaveCard}
                disabled={isSavingCard}
              >
                {isSavingCard ? 'Salvando...' : 'Salvar cartão'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Pagamento;
