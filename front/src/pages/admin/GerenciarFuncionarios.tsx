
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/GerenciarFuncionarios.css";
import douradoImg from "../../assets/login/dourado.png";
import { apiGet, apiPut, apiDelete } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

type Cargo = "ADMIN" | "COLABORADOR";
type Status = "ATIVO" | "INATIVO";

type Funcionario = {
  id: string;
  nome: string;
  email: string;
  cargo: Cargo;
  status: Status;
  criadoEm: string;
};

const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const GerenciarFuncionarios: React.FC = () => {
  const { token } = useAuth();
  const [lista, setLista] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [q, setQ] = useState("");
  const [filCargo, setFilCargo] = useState<"" | Cargo>("");
  const [filStatus, setFilStatus] = useState<"" | Status>("");
  const [ordem, setOrdem] = useState<"nome" | "recente">("nome");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [fNome, setFNome] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fSenha, setFSenha] = useState("");
  const [fTelefone, setFTelefone] = useState("");
  const [fDataNascimento, setFDataNascimento] = useState("");
  const [fEndereco, setFEndereco] = useState("");
  const [fComplemento, setFComplemento] = useState("");
  const [fCpf, setFCpf] = useState("");
  const [fCargo, setFCargo] = useState<Cargo>("COLABORADOR");
  const [fStatus, setFStatus] = useState<Status>("ATIVO");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarFuncionarios = async () => {
      setLoading(true);
      setErro("");
      try {
        // Buscar funcionários (usuários com hierarquia admin ou funcionario)
        const funcionariosApi = await apiGet<any[]>('/usuarios/', token || undefined);
        
        const funcionariosFormatados = funcionariosApi
          .filter((usuario: any) => 
            usuario.hierarquia === 'admin' || usuario.hierarquia === 'funcionario' || usuario.hierarquia === 'colaborador'
          )
          .map((usuario: any) => ({
            id: usuario._id || usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: (usuario.hierarquia === 'admin' ? 'ADMIN' : 'COLABORADOR') as Cargo,
            status: (usuario.ativo !== false ? 'ATIVO' : 'INATIVO') as Status,
            criadoEm: usuario.created_at || usuario.criadoEm || new Date().toISOString(),
          }));
        
        setLista(funcionariosFormatados);
      } catch (e: any) {
        console.error("Erro ao carregar funcionários:", e);
        setErro("Não foi possível carregar funcionários do banco de dados.");
        setLista([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      carregarFuncionarios();
    }
  }, [token]);

  const filtrados = useMemo(() => {
    let base = [...lista];

    if (q.trim()) {
      const n = normalize(q);
      base = base.filter(
        (f) => normalize(f.nome).includes(n) || normalize(f.email).includes(n)
      );
    }
    if (filCargo) base = base.filter((f) => f.cargo === filCargo);
    if (filStatus) base = base.filter((f) => f.status === filStatus);

    if (ordem === "nome") {
      base.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      base.sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      );
    }
    return base;
  }, [lista, q, filCargo, filStatus, ordem]);

  /* ============= Ações ============= */
  const abrirCriar = () => {
    setEditando(null);
    setFNome("");
    setFEmail("");
    setFSenha("");
    setFTelefone("");
    setFDataNascimento("");
    setFEndereco("");
    setFComplemento("");
    setFCpf("");
    setFCargo("COLABORADOR");
    setFStatus("ATIVO");
    setModalAberto(true);
  };

  const abrirEditar = (f: Funcionario) => {
    setEditando(f);
    setFNome(f.nome);
    setFEmail(f.email);
    setFCargo(f.cargo);
    setFStatus(f.status);
    setModalAberto(true);
  };

  const salvar = async () => {
    if (!fNome.trim() || !fEmail.trim()) {
      setErro("Nome e E-mail são obrigatórios.");
      return;
    }
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fEmail.trim())) {
      setErro("Por favor, insira um email válido (exemplo: usuario@exemplo.com).");
      return;
    }
    
    // Para novos funcionários, validar todos os campos obrigatórios
    if (!editando) {
      if (!fSenha.trim()) {
        setErro("Senha é obrigatória para novos funcionários.");
        return;
      }
      if (!fTelefone.trim()) {
        setErro("Telefone é obrigatório.");
        return;
      }
      if (!fDataNascimento.trim()) {
        setErro("Data de nascimento é obrigatória.");
        return;
      }
      if (!fEndereco.trim()) {
        setErro("Endereço é obrigatório.");
        return;
      }
      if (!fCpf.trim()) {
        setErro("CPF é obrigatório.");
        return;
      }
    }
    setSalvando(true);
    try {
      if (editando) {
        // Editar funcionário existente
        await apiPut(`/usuarios/${editando.id}`, {
          nome: fNome,
          email: fEmail,
          hierarquia: fCargo === 'ADMIN' ? 'admin' : 'colaborador',
          ativo: fStatus === 'ATIVO'
        }, token || undefined);
        
        // Atualizar lista local
        setLista((prev) =>
          prev.map((p) =>
            p.id === editando.id
              ? { ...p, nome: fNome, email: fEmail, cargo: fCargo, status: fStatus }
              : p
          )
        );
      } else {
        // Criar novo funcionário
        // Tentar usar 'colaborador' em vez de 'funcionario'
        const hierarquia = fCargo === 'ADMIN' ? 'admin' : 'colaborador';
        console.log('Criando funcionário com hierarquia:', hierarquia);
        console.log('Cargo selecionado:', fCargo);
        
        const requestData = {
          nome: fNome,
          email: fEmail,
          data_nascimento: fDataNascimento,
          telefone: fTelefone.replace(/\D/g, ''), // Remover formatação
          endereco: fEndereco,
          complemento: fComplemento,
          senha: fSenha,
          cpf: fCpf.replace(/\D/g, ''), // Remover formatação
          hierarquia: hierarquia,
          ativo: fStatus === 'ATIVO'
        };
        
        console.log('Dados enviados para API:', requestData);
        console.log('Hierarquia que será enviada:', hierarquia);
        
        // Tentar com fetch direto para ter mais controle
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        
        const response = await fetch(`${BASE_URL}/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro da API:', errorText);
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log('Resposta da API:', responseData);
        
        // Sempre tentar atualizar a hierarquia após criação
        console.log('Verificando hierarquia após criação...');
        console.log('Hierarquia esperada:', hierarquia);
        console.log('Hierarquia recebida:', responseData.hierarquia);
        
        // Sempre fazer uma segunda requisição para garantir a hierarquia correta
        console.log('Atualizando hierarquia para:', hierarquia);
        
        const updateResponse = await fetch(`${BASE_URL}/usuarios/${responseData._id || responseData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            hierarquia: hierarquia,
          }),
        });
        
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log('Hierarquia atualizada com sucesso:', updateData);
        } else {
          const errorText = await updateResponse.text();
          console.error('Erro ao atualizar hierarquia:', errorText);
        }
        
        // Recarregar lista para incluir o novo funcionário
        const funcionariosApi = await apiGet<any[]>('/usuarios/', token || undefined);
        const funcionariosFormatados = funcionariosApi
          .filter((usuario: any) => 
            usuario.hierarquia === 'admin' || usuario.hierarquia === 'funcionario' || usuario.hierarquia === 'colaborador'
          )
          .map((usuario: any) => ({
            id: usuario._id || usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: (usuario.hierarquia === 'admin' ? 'ADMIN' : 'COLABORADOR') as Cargo,
            status: (usuario.ativo !== false ? 'ATIVO' : 'INATIVO') as Status,
            criadoEm: usuario.created_at || usuario.criadoEm || new Date().toISOString(),
          }));
        setLista(funcionariosFormatados);
        alert(`Funcionário criado com sucesso!\n\nEmail: ${fEmail}\nSenha: ${fSenha}\n\nAnote essas informações para o funcionário.`);
      }
      setModalAberto(false);
    } catch (error: any) {
      console.error("Erro ao salvar funcionário:", error);
      setErro(`Erro ao salvar funcionário: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const alternarStatus = async (f: Funcionario) => {
    const novo = f.status === "ATIVO" ? "INATIVO" : "ATIVO";
    try {
      await apiPut(`/usuarios/${f.id}`, {
        ativo: novo === 'ATIVO'
      }, token || undefined);
      
      setLista((prev) =>
        prev.map((p) => (p.id === f.id ? { ...p, status: novo } : p))
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      setErro(`Erro ao alterar status: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const remover = async (id: string) => {
    if (!confirm("Remover este funcionário?")) return;
    try {
      await apiDelete(`/usuarios/${id}`, token || undefined);
      setLista((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Erro ao remover funcionário:", error);
      setErro(`Erro ao remover funcionário: ${error.message || 'Erro desconhecido'}`);
    }
  };

  /* ============= UI ============= */
  return (
    <>
        <Header />
        <main className="gf-page">
        <div className="gf-header">
            <h1 className="gf-title">Gerenciar Funcionários</h1>
            <img
              src={douradoImg}
              alt=""
              aria-hidden
              className="adm-divider-img"
            />
        </div>

        <section className="gf-panel">
            <div className="gf-search-row">
            <div className="gf-search">
                <span className="gf-search-icon" aria-hidden>🔍</span>
                <input
                type="text"
                placeholder="Buscar por nome ou e-mail"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                />
            </div>

            <div className="gf-filters">
                <label className="gf-select">
                <span>Cargo</span>
                <select
                    value={filCargo}
                    onChange={(e) => setFilCargo((e.target.value as Cargo) || "")}
                >
                    <option value="">Todos</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="COLABORADOR">Colaborador</option>
                </select>
                </label>

                <label className="gf-select">
                <span>Status</span>
                <select
                    value={filStatus}
                    onChange={(e) => setFilStatus((e.target.value as Status) || "")}
                >
                    <option value="">Todos</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                </select>
                </label>

                <label className="gf-select">
                <span>Ordenar</span>
                <select
                    value={ordem}
                    onChange={(e) => setOrdem(e.target.value as "nome" | "recente")}
                >
                    <option value="nome">Nome (A–Z)</option>
                    <option value="recente">Mais recente</option>
                </select>
                </label>

                <button className="gf-add" onClick={abrirCriar} aria-label="Adicionar funcionário">
                <span className="gf-add-plus">+</span>
                </button>
            </div>
            </div>

            {erro && <div className="gf-alert">{erro}</div>}

            {loading ? (
            <div className="gf-loading">Carregando…</div>
            ) : (
            <div className="gf-grid">
                {filtrados.map((f) => (
                <article key={f.id} className="gf-card">
                    <header className="gf-card-head">
                    <h3 className="gf-card-name">{f.nome}</h3>
                    <span
                        className={`gf-badge ${f.cargo === "ADMIN" ? "is-admin" : "is-colab"}`}
                        title={f.cargo === "ADMIN" ? "Administrador" : "Colaborador"}
                    >
                        {f.cargo === "ADMIN" ? "Admin" : "Colaborador"}
                    </span>
                    </header>

                    <p className="gf-card-email">{f.email}</p>

                    <div className="gf-card-foot">
                    <button
                        className={`gf-status ${f.status === "ATIVO" ? "on" : "off"}`}
                        onClick={() => alternarStatus(f)}
                        title="Alternar status"
                    >
                        {f.status === "ATIVO" ? "Ativo" : "Inativo"}
                    </button>

                    <div className="gf-actions">
                        <button className="gf-btn ghost" onClick={() => abrirEditar(f)}>
                        Editar
                        </button>
                        <button className="gf-btn danger" onClick={() => remover(f.id)}>
                        Remover
                        </button>
                    </div>
                    </div>
                </article>
                ))}

                <button className="gf-card add-card" onClick={abrirCriar} aria-label="Adicionar">
                <span>+</span>
                </button>
            </div>
            )}
        </section>

        {modalAberto && (
            <div className="gf-modal" role="dialog" aria-modal="true">
            <div className="gf-modal-box">
                <div className="gf-modal-head">
                <h2>{editando ? "Editar funcionário" : "Novo funcionário"}</h2>
                <button className="gf-close" onClick={() => setModalAberto(false)} aria-label="Fechar">×</button>
                </div>

                <div className="gf-modal-body">
                <label className="gf-field full-width">
                    <span>Nome</span>
                    <input
                    type="text"
                    value={fNome}
                    onChange={(e) => setFNome(e.target.value)}
                    placeholder="Nome completo"
                    />
                </label>

                <label className="gf-field">
                    <span>E-mail</span>
                    <input
                    type="email"
                    value={fEmail}
                    onChange={(e) => setFEmail(e.target.value)}
                    placeholder="email@kaizerhaus.com"
                    />
                </label>

                {!editando && (
                <label className="gf-field">
                    <span>Senha</span>
                    <input
                    type="password"
                    value={fSenha}
                    onChange={(e) => setFSenha(e.target.value)}
                    placeholder="Senha para o funcionário"
                    />
                </label>
                )}

                {!editando && (
                <>
                <label className="gf-field">
                    <span>Telefone</span>
                    <input
                    type="tel"
                    value={fTelefone}
                    onChange={(e) => setFTelefone(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    />
                </label>

                <label className="gf-field">
                    <span>Data de Nascimento</span>
                    <input
                    type="date"
                    value={fDataNascimento}
                    onChange={(e) => setFDataNascimento(e.target.value)}
                    />
                </label>

                <label className="gf-field full-width">
                    <span>Endereço</span>
                    <input
                    type="text"
                    value={fEndereco}
                    onChange={(e) => setFEndereco(e.target.value)}
                    placeholder="Rua, número, bairro"
                    />
                </label>

                <label className="gf-field">
                    <span>Complemento</span>
                    <input
                    type="text"
                    value={fComplemento}
                    onChange={(e) => setFComplemento(e.target.value)}
                    placeholder="Apartamento, casa, etc. (opcional)"
                    />
                </label>

                <label className="gf-field">
                    <span>CPF</span>
                    <input
                    type="text"
                    value={fCpf}
                    onChange={(e) => setFCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    />
                </label>
                </>
                )}

                <label className="gf-field">
                    <span>Cargo</span>
                    <select
                    value={fCargo}
                    onChange={(e) => setFCargo(e.target.value as Cargo)}
                    >
                    <option value="COLABORADOR">Colaborador</option>
                    <option value="ADMIN">Administrador</option>
                    </select>
                </label>

                <label className="gf-field">
                    <span>Status</span>
                    <select
                    value={fStatus}
                    onChange={(e) => setFStatus(e.target.value as Status)}
                    >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    </select>
                </label>

                </div>

                <div className="gf-modal-foot">
                <button className="gf-btn ghost" onClick={() => setModalAberto(false)}>
                    Cancelar
                </button>
                <button className="gf-btn primary" onClick={salvar} disabled={salvando}>
                    {salvando ? "Salvando…" : "Salvar"}
                </button>
                </div>
            </div>
            </div>
        )}
        </main>
        <Footer />
    </>
  );
};

export default GerenciarFuncionarios;

