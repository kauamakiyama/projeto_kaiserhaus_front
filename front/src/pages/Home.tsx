import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiGet } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import hero from "../assets/home/Imagem principal.png";
import emblem from "../assets/home/Logo da KaizerHaus.png";
import imgSalao from "../assets/home/Restaurante interno.png";
import imgPrato from "../assets/home/image 95.png";
import posterSP from "../assets/home/O melhor de sp.png";
import chefWatermark from "../assets/home/Chef.png";
import bandeira from "../assets/home/Bandeira da Alemanha de fundo.png";

interface Produto {
  _id: string;
  titulo: string;
  imagem?: string;
  categoria?: string;
  ativo: boolean;
}

interface Especialidade {
  title: string;
  img: string;
}

export default function Home() {
  const { token } = useAuth();
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar produtos da API
  const carregarEspecialidades = async () => {
    try {
      setLoading(true);
      
      // Tentar buscar produtos da API
      const produtos = await apiGet<Produto[]>('/produtos/', token);
      
      if (produtos && Array.isArray(produtos)) {
        // Filtrar produtos ativos e pegar os primeiros 6
        const produtosAtivos = produtos
          .filter(produto => produto.ativo)
          .slice(0, 6);
        
        // Converter para formato de especialidades
        const especialidadesFormatadas = produtosAtivos.map(produto => ({
          title: produto.titulo,
          img: produto.imagem || imgPrato // Fallback para imagem padrão
        }));
        
        setEspecialidades(especialidadesFormatadas);
      } else {
        // Fallback para dados estáticos se API falhar
        setEspecialidades([
          { title: "Eisbein", img: imgPrato },
          { title: "Schnitzel", img: imgPrato },
          { title: "Salsicha Currywurst", img: imgPrato },
          { title: "Schwarzbrot", img: imgPrato },
          { title: "Strudel de Maçã", img: imgPrato },
          { title: "Strudel de Queijo", img: imgPrato },
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar especialidades da API:', error);
      
      // Fallback para dados estáticos em caso de erro
      setEspecialidades([
        { title: "Eisbein", img: imgPrato },
        { title: "Schnitzel", img: imgPrato },
        { title: "Salsicha Currywurst", img: imgPrato },
        { title: "Schwarzbrot", img: imgPrato },
        { title: "Strudel de Maçã", img: imgPrato },
        { title: "Strudel de Queijo", img: imgPrato },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEspecialidades();
  }, [token]);

  return (
    <>
      <Header />
      <section className="kh-hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="kh-hero__overlay" />

        <div className="kh-hero__content container">
          <img
            src={emblem}
            className="kh-hero__emblem"
            alt="KaizerHaus – Brasão"
            loading="eager"
          />
          <h1 className="kh-hero__title">Tradição que viaja até sua casa</h1>

          <div className="kh-hero__cta">
            <Link to="/cardapio" className="btn btn--primary">
              Peça Já
            </Link>
          </div>
        </div>
      </section>

      <section
        className="kh-welcome-figma"
        style={{ ["--kh-flag-url" as any]: `url(${bandeira})` }}
      >
        <div className="container">
          <header className="kh-welcome-figma__header">
            <h2 className="kh-welcome-figma__title">
              Bem-Vindo a KaizerHaus
            </h2>
            <p className="kh-welcome-figma__lead">
              Há mais de <strong>40 anos</strong> mantendo viva a tradição alemã no Brooklin
            </p>
          </header>

          <div className="kh-welcome-figma__photos">
            <figure className="kh-photo">
              <img src={imgSalao} alt="Ambiente interno do restaurante" loading="lazy" />
            </figure>
            <figure className="kh-photo">
              <img src={imgPrato} alt="Pratos típicos da culinária alemã" loading="lazy" />
            </figure>
          </div>
        </div>
        <div className="kh-welcome-figma__actions">
          <Link to="/sobre" className="btn btn--history">
            Nossa História
          </Link>
        </div>
      </section>


      <section
        className="kh-press"
        style={{ ["--kh-chef-url" as any]: `url(${chefWatermark})` }}
      >
        <div className="container kh-press__inner">
          <div className="kh-press__rule" aria-hidden />
          <figure className="kh-press__poster">
            <img src={posterSP} alt="O Melhor de São Paulo — Gastronomia" loading="lazy" />
          </figure>
          <h3 className="kh-press__headline">
            Com uma equipe de mais de <strong>10 chefs</strong> especializados, a KaizerHaus
            garante o melhor da autêntica gastronomia alemã em cada prato.
          </h3>
        </div>
      </section>

      <section className="kh-specialties kh-specialties--figma" id="especialidades">
        <div className="container">
          <header className="kh-spec__header">
            <h2 className="kh-spec__title">
              <span>Especialidades</span>
            </h2>
          </header>

          {loading ? (
            <div className="kh-spec__loading">
              <p>Carregando especialidades...</p>
            </div>
          ) : (
            <ul className="kh-spec__grid" role="list">
              {especialidades.map((item) => (
                <li key={item.title} className="kh-spec__card">
                  <figure className="kh-spec__figure">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      loading="lazy"
                      onError={(e) => {
                        // Fallback para imagem padrão se a imagem da API falhar
                        (e.target as HTMLImageElement).src = imgPrato;
                      }}
                    />
                  </figure>
                  <figcaption className="kh-spec__caption">{item.title}</figcaption>
                </li>
              ))}
            </ul>
          )}

          <div className="kh-spec__actions">
            <Link to="/cardapio" className="btn btn--history">
              Cardápio Completo
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
