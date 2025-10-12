import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AcompanharPedido.css';

interface ItemPedido {
  id: string;
  produtoId: string;
  quantidade: number;
  observacoes?: string;
  precoUnitario: number;
  precoTotal: number;
  nomeProduto: string;
  imagemProduto: string;
}

interface Pedido {
  id: number;
  usuarioId: string;
  status: 'pendente' | 'em_preparacao' | 'saiu_para_entrega' | 'concluido';
  total: number;
  metodoPagamento: string;
  criadoEm: string;
  atualizadoEm: string;
  itens: ItemPedido[];
}

interface StatusUpdate {
  timestamp: string;
  status: string;
  descricao: string;
  ativo: boolean;
}

const AcompanharPedido: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para gerar atualizações de status baseadas no pedido
  const gerarAtualizacoesStatus = (pedido: Pedido): StatusUpdate[] => {
    const atualizacoes: StatusUpdate[] = [];
    
    // Pedido Confirmado (sempre presente)
    atualizacoes.push({
      timestamp: new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'confirmado',
      descricao: 'Pedido Confirmado',
      ativo: true
    });

    // Em Preparação
    if (pedido.status === 'em_preparacao' || pedido.status === 'saiu_para_entrega' || pedido.status === 'concluido') {
      const tempoPreparacao = new Date(pedido.criadoEm);
      tempoPreparacao.setMinutes(tempoPreparacao.getMinutes() + 1);
      
      atualizacoes.push({
        timestamp: tempoPreparacao.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'preparacao',
        descricao: 'Seu pedido já está sendo preparado',
        ativo: pedido.status === 'em_preparacao' || pedido.status === 'saiu_para_entrega' || pedido.status === 'concluido'
      });
    }

    // Saiu para Entrega
    if (pedido.status === 'saiu_para_entrega' || pedido.status === 'concluido') {
      const tempoEntrega = new Date(pedido.criadoEm);
      tempoEntrega.setMinutes(tempoEntrega.getMinutes() + 16);
      
      atualizacoes.push({
        timestamp: tempoEntrega.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'entrega',
        descricao: 'Seu pedido está indo até você',
        ativo: pedido.status === 'saiu_para_entrega' || pedido.status === 'concluido'
      });
    }

    // Concluído
    if (pedido.status === 'concluido') {
      const tempoConclusao = new Date(pedido.criadoEm);
      tempoConclusao.setMinutes(tempoConclusao.getMinutes() + 33);
      
      atualizacoes.push({
        timestamp: tempoConclusao.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'concluido',
        descricao: 'Seu pedido chegou',
        ativo: true
      });
    }

    return atualizacoes;
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return '✓';
      case 'preparacao':
        return '🍳';
      case 'entrega':
        return '🏍️';
      case 'concluido':
        return '🎉';
      default:
        return '⏳';
    }
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string, ativo: boolean) => {
    if (!ativo) return '#ccc';
    
    switch (status) {
      case 'confirmado':
        return '#4CAF50';
      case 'preparacao':
        return '#FF9800';
      case 'entrega':
        return '#2196F3';
      case 'concluido':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };


  // Carregar dados do pedido
  useEffect(() => {
    const carregarPedido = async () => {
      if (!pedidoId) {
        setError('ID do pedido não encontrado');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('Token de autenticação não encontrado. Faça login primeiro.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Tentando carregar pedido:', pedidoId);
        console.log('🔑 Token disponível:', token ? 'Sim' : 'Não');
        console.log('🌐 URL base:', import.meta.env.VITE_API_URL || 'http://localhost:8001');
        
        const response = await apiGet(`/pedidos/${pedidoId}`, token);
        console.log('✅ Resposta da API:', response);
        
        if (response && typeof response === 'object') {
          setPedido(response as Pedido);
          console.log('✅ Pedido carregado com sucesso');
        } else {
          setError('Pedido não encontrado na API');
        }
        
      } catch (err: any) {
        console.error('❌ Erro ao carregar pedido:', err);
        console.error('❌ Detalhes do erro:', {
          message: err.message,
          status: err.status,
          response: err.response
        });
        
        // Mostrar erro detalhado para debug
        const errorMessage = err.message || 'Erro desconhecido';
        const statusCode = err.status || 'N/A';
        setError(`Erro ao carregar pedido: ${errorMessage} (Status: ${statusCode})`);
      } finally {
        setLoading(false);
      }
    };

    carregarPedido();
  }, [pedidoId, token]);

  // Atualizar automaticamente a cada 30 segundos
  useEffect(() => {
    if (!pedidoId || !token) return;

    const interval = setInterval(async () => {
      try {
        console.log('🔄 Atualizando pedido automaticamente...');
        const response = await apiGet(`/pedidos/${pedidoId}`, token);
        if (response && typeof response === 'object') {
          setPedido(response as Pedido);
          console.log('✅ Pedido atualizado com sucesso');
        }
      } catch (err) {
        console.error('❌ Erro ao atualizar pedido:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [pedidoId, token]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="acompanhar-page">
          <div className="acompanhar-container">
            <div className="loading">Carregando pedido...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="acompanhar-page">
          <div className="acompanhar-container">
            <div className="error">
              <h3>❌ Erro ao Carregar Pedido</h3>
              <p><strong>Mensagem:</strong> {error}</p>
              <p><strong>ID do Pedido:</strong> {pedidoId}</p>
              <p><strong>Token:</strong> {token ? 'Disponível' : 'Não encontrado'}</p>
              <p><strong>URL Base:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8001'}</p>
              
              <div className="error-actions">
                <button onClick={() => window.location.reload()} className="voltar-btn">
                  🔄 Tentar Novamente
                </button>
                <button onClick={() => navigate('/')} className="voltar-btn">
                  🏠 Voltar ao Início
                </button>
              </div>
              
              <div className="debug-info">
                <h4>Informações para Debug:</h4>
                <ul>
                  <li>Verifique se o backend está rodando</li>
                  <li>Confirme se o endpoint <code>/pedidos/{pedidoId}</code> existe</li>
                  <li>Verifique se o token de autenticação é válido</li>
                  <li>Abra o console do navegador (F12) para mais detalhes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!pedido) {
    return (
      <>
        <Header />
        <div className="acompanhar-page">
          <div className="acompanhar-container">
            <div className="error">
              <p>Pedido não encontrado</p>
              <button onClick={() => navigate('/')} className="voltar-btn">
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const atualizacoes = gerarAtualizacoesStatus(pedido);

  return (
    <>
      <Header />
      <div className="acompanhar-page">
        <div className="acompanhar-container">

        {/* Barra de progresso */}
        <div className="progress-bar">
          <div className="progress-step">
            <div className="step-icon">🛒</div>
            <span>Sacola</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className="step-icon">🏍️</div>
            <span>Entrega</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className="step-icon">💳</div>
            <span>Pagamento</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step active">
            <div className="step-icon">✓</div>
            <span>Conclusão</span>
          </div>
        </div>

        {/* Timeline de status */}
        <div className="timeline-container">
          <div className="timeline">
            {atualizacoes.map((atualizacao, index) => (
              <div key={index} className="timeline-item">
                <div 
                  className="timeline-dot"
                  style={{ 
                    backgroundColor: getStatusColor(atualizacao.status, atualizacao.ativo),
                    color: atualizacao.ativo ? 'white' : '#666'
                  }}
                >
                  {getStatusIcon(atualizacao.status)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-time">{atualizacao.timestamp}</div>
                  <div 
                    className="timeline-description"
                    style={{ 
                      color: atualizacao.ativo ? '#333' : '#999',
                      fontWeight: atualizacao.ativo ? '600' : '400'
                    }}
                  >
                    {atualizacao.descricao}
                  </div>
                </div>
                {index < atualizacoes.length - 1 && (
                  <div 
                    className="timeline-line"
                    style={{ 
                      backgroundColor: atualizacao.ativo ? '#E1C16E' : '#ddd'
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informações do pedido */}
        <div className="pedido-info">
          <h3>Pedido #{pedido.id}</h3>
          <div className="pedido-details">
            <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
            <p><strong>Método de Pagamento:</strong> {pedido.metodoPagamento}</p>
            <p><strong>Criado em:</strong> {new Date(pedido.criadoEm).toLocaleString('pt-BR')}</p>
          </div>
          
          <div className="itens-pedido">
            <h4>Itens do Pedido:</h4>
            {pedido.itens.map((item, index) => (
              <div key={index} className="item-pedido">
                <span>{item.quantidade}x {item.nomeProduto}</span>
                {item.observacoes && (
                  <span className="observacoes">({item.observacoes})</span>
                )}
                <span className="preco">R$ {item.precoTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

          {/* Botão voltar */}
          <div className="voltar-container">
            <button onClick={() => navigate('/')} className="voltar-btn">
              Voltar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AcompanharPedido;
