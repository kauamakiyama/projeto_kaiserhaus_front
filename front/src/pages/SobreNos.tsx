import { Link } from "react-router-dom";
import "../styles/SobreNos.css";

/* Reaproveitando imagens que vc já tem na pasta /assets/sobrenos */
import hero from "../assets/sobrenos/sobrenosfundo.png";
import background1 from "../assets/sobrenos/background1.png";
import waiter from "../assets/sobrenos/waiter.png";
import melhordesp from "../assets/sobrenos/melhordesp.png";
import food from "../assets/sobrenos/food.png";
import deutsch from "../assets/sobrenos/deutsch.png";
import chapeu from "../assets/sobrenos/chapeu.png";
import bretz from "../assets/sobrenos/bretz.png";

export default function SobreNos() {
  return (
    <>
      {/* HERO */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="about-hero__overlay" />

        <div className="about-hero__content container">
          {/* Título + linha dourada como no Figma */}
          <h1 className="about-hero__title">Nossa História</h1>

          {/* Subtítulo mais largo e legível */}
          <p className="about-hero__subtitle">
            Nosso compromisso é proporcionar uma vivência alemã completa no
            conforto do seu lar
          </p>

          {/* Medalhas */}
          <ul className="about-pillars" role="list">
            <li className="about-pillars__item">
              <figure className="about-medal">
                <span className="about-medal__ring" aria-hidden />
                <img src={bretz} alt="" loading="eager" />
              </figure>
              <span className="about-medal__caption">Sabor</span>
            </li>

            <li className="about-pillars__item">
              <figure className="about-medal">
                <span className="about-medal__ring" aria-hidden />
                <img src={waiter} alt="" loading="eager" />
              </figure>
              <span className="about-medal__caption">Hospitalidade</span>
            </li>

            <li className="about-pillars__item">
              <figure className="about-medal">
                <span className="about-medal__ring" aria-hidden />
                <img src={chapeu} alt="" loading="eager" />
              </figure>
              <span className="about-medal__caption">Tradição</span>
            </li>
          </ul>
        </div>
      </section>

      {/* TRADIÇÃO */}
      <section
        className="about-section"
        style={{ ["--about-watermark" as any]: `url(${background1})` }}
      >
        <div className="container about-section__inner">
          <header className="about-section__header">
            <h2 className="about-title">
              <span>Tradição há décadas</span>
            </h2>
          </header>

          <div className="about-grid about-grid--2">
            <div className="about-text">
              <p>
                Há mais de <strong>40 anos</strong>, a KaizerHaus preserva a
                culinária alemã no Brooklin. Nossas receitas passaram por gerações
                de cozinheiros e se tornaram referência para quem busca
                <strong> autenticidade</strong> e <strong>qualidade</strong>.
              </p>
              <p>
                O cuidado com os ingredientes, o preparo artesanal e a seleção
                de cervejas fazem parte da nossa essência desde o primeiro dia.
              </p>
            </div>

            <figure className="about-photo">
              <img
                src={deutsch}
                alt="Ambiente interno do restaurante"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* CULINÁRIA DE QUALIDADE */}
      <section className="about-section alt">
        <div className="container about-section__inner">
          <header className="about-section__header">
            <h2 className="about-title">
              <span>Culinária de qualidade</span>
            </h2>
          </header>

          <div className="about-grid about-grid--2">
            <figure className="about-photo">
              <img src={food} alt="Pratos típicos" loading="lazy" />
            </figure>

            <div className="about-text">
              <p>
                Formada no coração do Brooklin, a KaizerHaus se tornou referência
                em pratos clássicos como <em>Eisbein</em>, <em>Schnitzel</em> e
                <em> Currywurst</em>, sempre respeitando técnicas tradicionais.
              </p>
              <p>
                Nossa cozinha valoriza o sabor e a memória afetiva, trazendo
                experiências marcantes para almoços, jantares e celebrações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA EVOLUÇÃO */}
      <section className="about-section">
        <div className="container about-section__inner">
          <header className="about-section__header">
            <h2 className="about-title">
              <span>Nossa Evolução</span>
            </h2>
          </header>

        <div className="about-grid about-grid--2 about-grid--align">
            <figure className="about-poster">
              <img
                src={melhordesp}
                alt="O Melhor de São Paulo — Gastronomia"
                loading="lazy"
              />
            </figure>

            <div className="about-text">
              <p>
                Ao longo da nossa trajetória, fomos reconhecidos pelo público e
                pela crítica. Expandimos a operação e modernizamos processos
                sem perder a alma artesanal que nos acompanha desde o início.
              </p>
              <p>
                Trabalhamos com fornecedores selecionados e uma equipe com mais
                de <strong>10 chefs</strong> especializados para garantir o melhor
                da gastronomia alemã em cada prato.
              </p>
              <div className="about-actions">
                <Link to="/menu" className="btn btn--dark">
                  Ver Cardápio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <h3 className="about-cta__title">KaizerHaus onde você estiver</h3>
          <p className="about-cta__text">
            Da nossa cozinha para a sua mesa: peça online e receba com todo o
            cuidado da KaizerHaus.
          </p>
          <Link to="/menu" className="btn btn--primary">
            Peça Agora
          </Link>
        </div>
      </section>
    </>
  );
}

