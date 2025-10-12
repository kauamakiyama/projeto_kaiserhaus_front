import React, { useState, useEffect } from 'react';
import '../styles/Funcionario.css';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../services/api';
import HeaderLogadoColaborador from '../components/HeaderLogadoColaborador';

interface ItemPedido {
  id: string;
  produtoId: string;
  quantidade: number;
  observacoes?: string;
  precoUnitario: number;
  precoTotal: number;
  nomeProduto: string;
  imagemProduto: string;
  produto: {
    nome: string;
    preco: number;
    imagem: string;
    categoria: string;
  };
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

// Removido interface ApiResponse não utilizada

const Funcionario: React.FC = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [useMockData, setUseMockData] = useState(false);
  // Removido paginationInfo não utilizado
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  
  // Opção para forçar uso de dados mock (para debug)
  const FORCE_MOCK_DATA = false;
  
  // Função para calcular contadores de status (excluindo pedidos concluídos)
  const calculateStatusCounts = (pedidosList: Pedido[]) => {
    // Filtrar apenas pedidos que não estão concluídos
    const pedidosAtivos = pedidosList.filter(pedido => pedido.status !== 'concluido');
    
    const counts = {
      pendente: 0,
      em_preparacao: 0,
      saiu_para_entrega: 0,
      concluido: 0,
      total: pedidosAtivos.length // Total de pedidos ativos (não concluídos)
    };
    
    pedidosAtivos.forEach(pedido => {
      switch (pedido.status) {
        case 'pendente':
          counts.pendente++;
          break;
        case 'em_preparacao':
          counts.em_preparacao++;
          break;
        case 'saiu_para_entrega':
          counts.saiu_para_entrega++;
          break;
        case 'concluido':
          counts.concluido++;
          break;
      }
    });
    
    return counts;
  };
  
  // Estados para contadores de status
  const [statusCounts, setStatusCounts] = useState({
    pendente: 0,
    em_preparacao: 0,
    saiu_para_entrega: 0,
    concluido: 0,
    total: 0
  });

  // Dados mock para teste
  const mockPedidos: Pedido[] = [
    {
      id: 1,
      usuarioId: '68e587fd0736d5fdd76909e5',
      status: 'pendente',
      total: 129.97,
      metodoPagamento: 'pix',
      criadoEm: '2024-01-15T10:30:00Z',
      atualizadoEm: '2024-01-15T10:30:00Z',
      itens: [
        {
          id: 'item_73281_0',
          produtoId: '68e4172649baa35c2c95542b',
          quantidade: 3,
          observacoes: 'bem temperado',
          precoUnitario: 12.99,
          precoTotal: 38.97,
          nomeProduto: 'Brezel',
          imagemProduto: 'data:image/png;base64,iVBOR...',
          produto: {
            nome: 'Brezel',
            preco: 12.99,
            imagem: 'data:image/png;base64,iVBOR...',
            categoria: '68e40d366dafd5b8a433c1fb'
          }
        }
      ]
    },
    {
      id: 2,
      usuarioId: '68e587fd0736d5fdd76909e6',
      status: 'em_preparacao',
      total: 45.90,
      metodoPagamento: 'cartao',
      criadoEm: '2024-01-15T11:15:00Z',
      atualizadoEm: '2024-01-15T11:15:00Z',
      itens: [
        {
          id: 'item_73282_0',
          produtoId: '68e4172649baa35c2c95542c',
          quantidade: 2,
          observacoes: 'Sem cebola',
          precoUnitario: 22.95,
          precoTotal: 45.90,
          nomeProduto: 'Hambúrguer Clássico',
          imagemProduto: 'data:image/png;base64,iVBOR...',
          produto: {
            nome: 'Hambúrguer Clássico',
            preco: 22.95,
            imagem: 'data:image/png;base64,iVBOR...',
            categoria: '68e40d366dafd5b8a433c1fc'
          }
        }
      ]
    }
  ];


  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se FORCE_MOCK_DATA está ativo, usar dados mock diretamente
      if (FORCE_MOCK_DATA) {
        console.log('Usando dados mock forçados para debug');
        setPedidos(mockPedidos);
        setStatusCounts(calculateStatusCounts(mockPedidos));
        setUseMockData(true);
        setLoading(false);
        return;
      }
      
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }
      
      console.log('Fazendo requisição para /pedidos/ com token:', token ? 'presente' : 'ausente');
      console.log('URL base:', import.meta.env.VITE_API_URL || 'http://localhost:8001');
      
      // Usar endpoints corretos criados no backend
      let response: any;
      
      try {
        // Tentar endpoint específico para funcionários
        console.log('Tentando endpoint /pedidos/funcionario...');
        response = await apiGet('/pedidos/funcionario', token);
        console.log('✅ Endpoint /pedidos/funcionario funcionou:', response);
      } catch (err) {
        console.log('❌ Endpoint /pedidos/funcionario falhou:', err);
        
        try {
          // Fallback para endpoint geral de pedidos
          console.log('Tentando endpoint /pedidos/...');
          response = await apiGet('/pedidos/', token);
          console.log('✅ Endpoint /pedidos/ funcionou:', response);
        } catch (err2) {
          console.log('❌ Endpoint /pedidos/ também falhou:', err2);
          throw new Error('Todos os endpoints de pedidos falharam');
        }
      }
      
      console.log('Resposta da API:', response);
      console.log('Tipo da resposta:', typeof response);
      console.log('É array?', Array.isArray(response));
      
      // Log detalhado da estrutura dos dados
      if (Array.isArray(response) && response.length > 0) {
        console.log('Primeiro pedido:', response[0]);
        console.log('Estrutura do primeiro pedido:', Object.keys(response[0]));
        if (response[0].itens) {
          console.log('Itens do primeiro pedido:', response[0].itens);
        }
      }
      
      // Processar resposta do backend de forma simplificada
      let pedidosData: Pedido[] = [];
      
      console.log('🔍 Analisando resposta do backend...');
      console.log('Tipo:', typeof response);
      console.log('É array:', Array.isArray(response));
      console.log('Chaves:', response ? Object.keys(response) : 'N/A');
      
      if (Array.isArray(response)) {
        // Resposta é um array direto de pedidos
        pedidosData = response;
        console.log(`✅ Array direto: ${pedidosData.length} pedidos`);
      } else if (response && response.pedidos && Array.isArray(response.pedidos)) {
        // Resposta tem estrutura { pedidos: [...], ... }
        pedidosData = response.pedidos;
        console.log(`✅ Wrapper com pedidos: ${pedidosData.length} pedidos`);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Resposta tem estrutura { data: [...] }
        pedidosData = response.data;
        console.log(`✅ Wrapper com data: ${pedidosData.length} pedidos`);
      } else {
        console.error('❌ Formato de resposta não reconhecido:', response);
        throw new Error(`Formato de resposta inesperado. Recebido: ${typeof response}`);
      }
      
      console.log(`📊 Total de pedidos encontrados: ${pedidosData.length}`);
      
      if (pedidosData.length > 0) {
        setPedidos(pedidosData);
        setStatusCounts(calculateStatusCounts(pedidosData));
        setUseMockData(false);
        console.log(`Carregados ${pedidosData.length} pedidos da API`);
      } else {
        console.log('Nenhum pedido encontrado na API');
        setPedidos([]);
        setStatusCounts(calculateStatusCounts([]));
        setUseMockData(false);
      }
    } catch (err) {
      console.error('Erro ao carregar pedidos da API:', err);
      console.error('Token:', token ? 'presente' : 'ausente');
      
      // Fallback para dados mock em caso de erro
      console.log('Usando dados mock como fallback');
      setPedidos(mockPedidos);
      setStatusCounts(calculateStatusCounts(mockPedidos));
      setUseMockData(true);
      setError(`Erro na API: ${err instanceof Error ? err.message : 'Erro desconhecido'}. Usando dados de exemplo.`);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusPedido = async (pedidoId: number, novoStatus: string) => {
    try {
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      // Indicar que está atualizando este pedido
      setUpdatingStatus(pedidoId);
      console.log(`Atualizando pedido ${pedidoId} para status: ${novoStatus}`);
      
      // Usar endpoint correto para atualizar status do pedido
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      console.log(`🔄 Atualizando status do pedido ${pedidoId} para ${novoStatus}`);
      
      const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: novoStatus
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText}. Detalhes: ${errorText}`);
      }

      const result = await response.json();
      console.log('Status atualizado com sucesso no banco:', result);

      // Atualizar o pedido na lista local APÓS sucesso no banco
      setPedidos(prevPedidos => {
        const updatedPedidos = prevPedidos.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, status: novoStatus as any }
            : pedido
        );
        // Atualizar contadores após mudança de status
        setStatusCounts(calculateStatusCounts(updatedPedidos));
        return updatedPedidos;
      });

      // Não recarregar automaticamente - a atualização local já é suficiente

    } catch (err) {
      console.error('Erro ao atualizar status no banco:', err);
      
      // Mostrar erro para o usuário
      alert(`Erro ao atualizar status: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      
      // NÃO atualizar localmente em caso de erro - deixar o status original
      // Isso força o usuário a tentar novamente
    } finally {
      // Sempre remover o indicador de carregamento
      setUpdatingStatus(null);
    }
  };

  const formatarData = (data: string) => {
    try {
      if (!data) return 'Data não disponível';
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Erro ao formatar data:', err);
      return 'Data inválida';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#FF8C00'; // Laranja
      case 'em_preparacao': return '#4169E1'; // Azul
      case 'saiu_para_entrega': return '#FFD700'; // Amarelo
      case 'concluido': return '#32CD32'; // Verde
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_preparacao': return 'Em Preparação';
      case 'saiu_para_entrega': return 'Saiu para Entrega';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const getProximoStatus = (statusAtual: string) => {
    switch (statusAtual) {
      case 'pendente': return 'em_preparacao';
      case 'em_preparacao': return 'saiu_para_entrega';
      case 'saiu_para_entrega': return 'concluido';
      default: return null;
    }
  };

  // Filtrar pedidos excluindo os concluídos
  const pedidosAtivos = pedidos.filter(pedido => pedido.status !== 'concluido');
  
  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidosAtivos 
    : pedidosAtivos.filter(pedido => pedido.status === filtroStatus);

  useEffect(() => {
    loadPedidos();
    
    // Recarregar pedidos a cada 30 segundos para manter dados atualizados
    const interval = setInterval(() => {
      if (token && !loading) {
        console.log('Recarregando pedidos automaticamente...');
        loadPedidos();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="funcionario-page">
        <div className="loading">Carregando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funcionario-page">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadPedidos} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderLogadoColaborador />
      <div className="funcionario-page">
        <div className="funcionario-container">
        <div className="funcionario-header">
          <h1 className="funcionario-title">Painel de Pedidos</h1>
          {useMockData && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffc107', 
              borderRadius: '8px', 
              padding: '10px', 
              marginBottom: '1rem',
              color: '#856404',
              textAlign: 'center'
            }}>
              ⚠️ Usando dados de exemplo. Verifique a conexão com a API.
            </div>
          )}
          <div className="funcionario-stats">
            <div className="stat-item">
              <span className="stat-number">{statusCounts.pendente}</span>
              <span className="stat-label">Pendentes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts.em_preparacao}</span>
              <span className="stat-label">Em Preparação</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts.saiu_para_entrega}</span>
              <span className="stat-label">Saiu para Entrega</span>
            </div>
          </div>
        </div>

        <div className="filtros-container">
          <button 
            className={`filtro-btn ${filtroStatus === 'todos' ? 'ativo' : ''}`}
            onClick={() => setFiltroStatus('todos')}
          >
            Todos ({pedidosAtivos.length})
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === 'pendente' ? 'ativo' : ''}`}
            onClick={() => setFiltroStatus('pendente')}
          >
            Pendentes ({statusCounts.pendente})
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === 'em_preparacao' ? 'ativo' : ''}`}
            onClick={() => setFiltroStatus('em_preparacao')}
          >
            Em Preparação ({statusCounts.em_preparacao})
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === 'saiu_para_entrega' ? 'ativo' : ''}`}
            onClick={() => setFiltroStatus('saiu_para_entrega')}
          >
            Saiu para Entrega ({statusCounts.saiu_para_entrega})
          </button>
        </div>

        <div className="pedidos-grid">
          {pedidosAtivos.length === 0 ? (
            // Quando não há nenhum pedido ativo, não mostrar nada
            null
          ) : pedidosFiltrados.length === 0 ? (
            <div className="sem-pedidos">
              <p>Nenhum pedido encontrado para o filtro selecionado</p>
            </div>
          ) : (
            pedidosFiltrados
              .sort((a, b) => {
                try {
                  return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
                } catch (err) {
                  console.error('Erro ao ordenar pedidos:', err);
                  return 0;
                }
              })
              .map((pedido, index) => {
                try {
                  return (
                    <div key={pedido.id ? `pedido-${pedido.id}` : `pedido-${index}`} className="pedido-card">
                  <div className="pedido-info">
                    <div className="pedido-numero">#{pedido.id || 'N/A'}</div>
                    <div className="pedido-itens-info">
                      {(pedido.itens || []).map((item, itemIndex) => {
                        try {
                          return (
                            <div key={item.id || `item-${itemIndex}`} className="item-container">
                              <span className="item-linear">
                                {item.quantidade || 0}x {item.nomeProduto || 'Produto não encontrado'}
                              </span>
                              {item.observacoes && (
                                <span className="item-obs">{item.observacoes}</span>
                              )}
                            </div>
                          );
                        } catch (err) {
                          console.error('Erro ao renderizar item:', err, item);
                          return (
                            <span key={`error-${itemIndex}`} className="item-linear">
                              Erro ao carregar item
                            </span>
                          );
                        }
                      })}
                    </div>
                  </div>

                  <div className="pedido-detalhes">
                    <div className="pedido-data">{formatarData(pedido.criadoEm)}</div>
                    <div 
                      className="pedido-status-badge"
                      style={{ backgroundColor: getStatusColor(pedido.status) }}
                    >
                      {getStatusText(pedido.status)}
                    </div>
                    {getProximoStatus(pedido.status) && pedido.id && (
                      <button
                        className="proximo-status-btn"
                        disabled={updatingStatus === pedido.id}
                        onClick={() => {
                          try {
                            const proximoStatus = getProximoStatus(pedido.status);
                            if (proximoStatus && pedido.id) {
                              atualizarStatusPedido(pedido.id, proximoStatus);
                            }
                          } catch (err) {
                            console.error('Erro ao atualizar status:', err);
                          }
                        }}
                      >
                        {updatingStatus === pedido.id ? (
                          'Salvando...'
                        ) : (
                          <>
                            {getProximoStatus(pedido.status) === 'em_preparacao' && 'Iniciar Preparo'}
                            {getProximoStatus(pedido.status) === 'saiu_para_entrega' && 'Saiu para Entrega'}
                            {getProximoStatus(pedido.status) === 'concluido' && 'Marcar Concluído'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                    </div>
                  );
                } catch (err) {
                  console.error('Erro ao renderizar pedido:', err, pedido);
                  return (
                    <div key={`error-${index}`} className="pedido-card">
                      <div className="pedido-header">
                        <div className="pedido-info">
                          <span className="pedido-numero">Erro</span>
                          <span className="pedido-data">Erro ao carregar</span>
                        </div>
                        <div className="pedido-status" style={{ backgroundColor: '#FF6B6B' }}>
                          Erro
                        </div>
                      </div>
                      <div className="pedido-itens">
                        <p>Erro ao carregar dados do pedido</p>
                      </div>
                    </div>
                  );
                }
              })
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default Funcionario;

