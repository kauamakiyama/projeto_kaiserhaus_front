import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/GerenciarFuncionarios.css";

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

const MOCK: Funcionario[] = [
  {
    id: "u_001",
    nome: "Marina Costa",
    email: "marina@kaizerhaus.com",
    cargo: "ADMIN",
    status: "ATIVO",
    criadoEm: "2025-06-01T12:30:00Z",
  },
  {
    id: "u_002",
    nome: "Gustavo Andrade",
    email: "gustavo@kaizerhaus.com",
    cargo: "COLABORADOR",
    status: "ATIVO",
    criadoEm: "2025-06-15T09:12:00Z",
  },
  {
    id: "u_003",
    nome: "Bianca Rocha",
    email: "bianca@kaizerhaus.com",
    cargo: "COLABORADOR",
    status: "INATIVO",
    criadoEm: "2025-07-21T18:05:00Z",
  },
];

const USE_MOCK = true; // true até integrar o back

const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const GerenciarFuncionarios: React.FC = () => {
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
  const [fCargo, setFCargo] = useState<Cargo>("COLABORADOR");
  const [fStatus, setFStatus] = useState<Status>("ATIVO");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro("");
      try {
        if (USE_MOCK) {
          await wait(250);
          setLista(MOCK);
        } else {
          setLista([]);
        }
      } catch (e: any) {
        setErro("Não foi possível carregar. Exibindo dados de exemplo.");
        setLista(MOCK);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

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
    if (!fNome.trim() || !fEmail.trim()) return;
    setSalvando(true);
    try {
      if (USE_MOCK) {
        await wait(250);
        if (editando) {
          setLista((prev) =>
            prev.map((p) =>
              p.id === editando.id
                ? { ...p, nome: fNome, email: fEmail, cargo: fCargo, status: fStatus }
                : p
            )
          );
        } else {
          const novo: Funcionario = {
            id: "u_" + Math.random().toString(36).slice(2, 7),
            nome: fNome,
            email: fEmail,
            cargo: fCargo,
            status: fStatus,
            criadoEm: new Date().toISOString(),
          };
          setLista((prev) => [novo, ...prev]);
        }
      } else {
        // TODO back: POST/PUT
      }
      setModalAberto(false);
    } finally {
      setSalvando(false);
    }
  };

  const alternarStatus = async (f: Funcionario) => {
    const novo = f.status === "ATIVO" ? "INATIVO" : "ATIVO";
    if (USE_MOCK) {
      setLista((prev) =>
        prev.map((p) => (p.id === f.id ? { ...p, status: novo } : p))
      );
    } else {
      // TODO back: PATCH status
    }
  };

  const remover = async (id: string) => {
    if (!confirm("Remover este funcionário?")) return;
    if (USE_MOCK) {
      setLista((prev) => prev.filter((p) => p.id !== id));
    } else {
      // TODO back: DELETE
    }
  };

  /* ============= UI ============= */
  return (
    <>
        <Header />
        <main className="gf-page">
        <div className="gf-header">
            <h1 className="gf-title">Gerenciar Funcionários</h1>
            <div className="gf-title-ornament" aria-hidden />
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
                <label className="gf-field">
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
