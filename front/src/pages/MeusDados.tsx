import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MeusDados.css';
import douradoImg from '../assets/login/dourado.png';

type Usuario = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  complemento?: string;
  data_nascimento?: string;
  cpf?: string;
};

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8001';

const MeusDados: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    complemento: '',
    data_nascimento: '',
    cpf: '',
  });

  useEffect(() => {
    // Prefill imediato com snapshot salvo no login
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUsuario({
          nome: u.nome || '',
          email: u.email || '',
          telefone: u.telefone || '',
          endereco: u.endereco || '',
          complemento: u.complemento || '',
          data_nascimento: u.data_nascimento || u.dataNascimento || '',
          cpf: u.cpf || u.cpf_hash || '',
        });
      }
    } catch {}

    // Tenta atualizar com o backend (endpoint /usuarios/perfil)
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/usuarios/perfil`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUsuario({
            nome: data.nome || usuario.nome,
            email: data.email || usuario.email,
            telefone: data.telefone || usuario.telefone,
            endereco: data.endereco || usuario.endereco,
            complemento: data.complemento || usuario.complemento,
            data_nascimento: data.data_nascimento || data.dataNascimento || usuario.data_nascimento,
            cpf: data.cpf || data.cpf_hash || usuario.cpf,
          });
        }
      } catch {}
    };
    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <div className="dados-page">
        <div className="dados-header">
          <h1 className="dados-title">Dados pessoais</h1>
          <img src={douradoImg} alt="" className="dados-divider" />
        </div>

        <section className="dados-card">
          <div className="col">
            <label className="dados-label">Nome Completo:</label>
            <input className="dados-input" value={usuario.nome} readOnly />

            <label className="dados-label">CPF:</label>
            <input className="dados-input" value={usuario.cpf || 'Não informado'} readOnly />

            <label className="dados-label">Email:</label>
            <input className="dados-input" value={usuario.email} readOnly />

            <label className="dados-label">Senha:</label>
            <div className="dados-password">**********</div>
          </div>

          <div className="col">
            <label className="dados-label">Telefone:</label>
            <input className="dados-input" value={usuario.telefone} readOnly />

            <label className="dados-label">Endereço:</label>
            <input className="dados-input" value={usuario.endereco} readOnly />

            <label className="dados-label">Complemento</label>
            <input className="dados-input" value={usuario.complemento} readOnly />

            <label className="dados-label">Data de Nascimento:</label>
            <input className="dados-input" value={usuario.data_nascimento} readOnly />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default MeusDados;
