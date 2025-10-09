import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Entrega.css';
import { ProgressSteps } from '../components/ProgressSteps';

const Entrega: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSpeed, setSelectedSpeed] = useState<'padrao' | 'turbo' | null>(null);
  const [addressLine, setAddressLine] = useState<string>('Endereço não informado');
  const [addressSub, setAddressSub] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [editAddressLine, setEditAddressLine] = useState<string>('');
  const [editAddressSub, setEditAddressSub] = useState<string>('');

  const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8001';

  useEffect(() => {
    // Prefill rápido a partir do snapshot salvo no login
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        const endereco = u.endereco || '';
        const complemento = u.complemento || '';
        if (endereco) setAddressLine(endereco);
        if (complemento) setAddressSub(complemento);
      }
    } catch {}

    // Tenta atualizar via backend (/usuarios/perfil)
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${BASE_URL}/usuarios/perfil`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data?.endereco) setAddressLine(data.endereco);
          if (data?.complemento) setAddressSub(data.complemento);
        }
      } catch {}
    };
    fetchPerfil();
  }, []);

  return (
    <>
      <Header />
      <div className="entrega-page">
        <ProgressSteps current="entrega" />

        <div className="entrega-card">
          <div className="address-card">
            <svg className="pin-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#d94f5c" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z"/>
            </svg>
            <div className="address-content">
              <div className="address-line">{addressLine}</div>
              <div className="address-sub">{addressSub}</div>
            </div>
            <button
              className="address-change"
              onClick={() => {
                setEditAddressLine(addressLine || '');
                setEditAddressSub(addressSub || '');
                setIsEditingAddress((v) => !v);
              }}
            >Trocar</button>
          </div>

          {isEditingAddress && (
            <div className="address-editor">
              <div className="editor-row">
                <label className="editor-label">Endereço</label>
                <input
                  className="editor-input"
                  value={editAddressLine}
                  onChange={(e) => setEditAddressLine(e.target.value)}
                  placeholder="Rua, número"
                />
              </div>
              <div className="editor-row">
                <label className="editor-label">Complemento</label>
                <input
                  className="editor-input"
                  value={editAddressSub}
                  onChange={(e) => setEditAddressSub(e.target.value)}
                  placeholder="Apartamento, bloco, referências"
                />
              </div>
              <div className="editor-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditingAddress(false)}
                >Cancelar</button>
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => {
                    setAddressLine(editAddressLine.trim() || addressLine);
                    setAddressSub(editAddressSub.trim());
                    try {
                      const raw = localStorage.getItem('user');
                      if (raw) {
                        const u = JSON.parse(raw);
                        u.endereco = editAddressLine;
                        u.complemento = editAddressSub;
                        localStorage.setItem('user', JSON.stringify(u));
                      }
                    } catch {}
                    setIsEditingAddress(false);
                  }}
                >Salvar</button>
              </div>
            </div>
          )}

          <section className="forecast">
            <h2 className="title">Previsão</h2>
            <p className="subtitle">Hoje, 30-40 min</p>

            <div className="options">
              <button
                type="button"
                className={`option ${selectedSpeed === 'padrao' ? 'option--selected' : ''}`}
                onClick={() => setSelectedSpeed('padrao')}
                aria-pressed={selectedSpeed === 'padrao'}
              >
                <div className="opt-badge">Padrão</div>
                <div className="opt-line">Hoje, 30-40 min</div>
                <div className="opt-price">R$ 10,99</div>
              </button>
              <button
                type="button"
                className={`option ${selectedSpeed === 'turbo' ? 'option--selected' : ''}`}
                onClick={() => setSelectedSpeed('turbo')}
                aria-pressed={selectedSpeed === 'turbo'}
              >
                <div className="opt-badge">Turbo</div>
                <div className="opt-line">Hoje, 15-20 min</div>
                <div className="opt-price">R$ 17,99</div>
              </button>
            </div>
            <div className="entrega-actions">
              <button 
                className="btn-continue"
                onClick={() => {
                  if (!selectedSpeed) {
                    alert('Por favor, selecione uma opção de entrega.');
                    return;
                  }
                  try {
                    const payload = {
                      tipo: selectedSpeed,
                      endereco: normalizeEndereco(addressLine),
                    } as any;
                    localStorage.setItem('kh-entrega', JSON.stringify(payload));
                  } catch {}
                  navigate('/pagamento');
                }}
              >Continuar</button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Entrega;


function normalizeEndereco(addressLine: string) {
  // Tenta quebrar "Rua X, 123 - Bairro, Cidade - UF" em campos; se não der, retorna todos no logradouro
  const endereco: any = {
    logradouro: addressLine || 'Endereço',
    numero: 's/n',
    bairro: 'Não informado',
    cidade: 'Não informado',
    uf: 'SP',
    cep: '00000-000',
    complemento: '',
  };
  return endereco;
}

