import "../styles/SobreNos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import hero from "../assets/sobrenos/sobrenosfundo.png";
import background1 from "../assets/sobrenos/background1.png";
import melhordesp from "../assets/sobrenos/melhordesp.png";
import food from "../assets/sobrenos/food.png";
import deutsch from "../assets/sobrenos/deutsch.png";
import waiter from "../assets/sobrenos/waiter.png";
import chapeu from "../assets/sobrenos/chapeu.png";
import bretz from "../assets/sobrenos/bretz.png";
import cookers from "../assets/sobrenos/cookers.png";
import delivery from "../assets/sobrenos/delivery.png";

export default function SobreNos() {
  return (
    <>
      <Header />
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="about-hero__overlay" />

        <div className="about-hero__content container">
          <h1 className="about-hero__title">Nossa História</h1>

          <p className="about-hero__subtitle">
            Nosso compromisso é proporcionar uma vivência alemã completa no
            conforto do seu lar
          </p>

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

      <section
        className="about-band"
        style={{ ["--band-bg" as any]: `url(${background1})` }}
      >
        <section className="about-section in-band">
          <div className="container about-section__inner">
            <header className="about-section__header">
              <h2 className="about-title"><span>Tradição há décadas</span></h2>
            </header>

            <div className="about-grid about-grid--2">
              <div className="about-text">
                <p>
                  Há mais de <strong>40 anos</strong>, a KaizerHaus preserva a culinária alemã no Brooklin.
                  Nossas receitas passaram por gerações de cozinheiros e se tornaram referência para quem busca
                  <strong> autenticidade</strong> e <strong>qualidade</strong>.
                </p>
                <p>
                  O cuidado com os ingredientes, o preparo artesanal e a seleção de cervejas fazem parte da nossa essência desde o primeiro dia.
                </p>
              </div>

              <figure className="about-photo">
                <img src={deutsch} alt="Ambiente interno do restaurante" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section className="about-section in-band alt">
          <div className="container about-section__inner">
            <header className="about-section__header">
              <h2 className="about-title"><span>Culinária de qualidade</span></h2>
            </header>

            <div className="about-grid about-grid--2">
              <figure className="about-photo">
                <img src={food} alt="Pratos típicos" loading="lazy" />
              </figure>

              <div className="about-text">
                <p>
                  Formada no coração do Brooklin, a KaizerHaus se tornou referência em pratos clássicos como
                  <em> Eisbein</em>, <em> Schnitzel</em> e <em> Currywurst</em>, sempre respeitando técnicas tradicionais.
                </p>
                <p>
                  Nossa cozinha valoriza o sabor e a memória afetiva, trazendo experiências marcantes para almoços, jantares e celebrações.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>


      <section
        className="about-evolution"
        style={{ ["--evo-bg" as any]: `url(${background1})` }}
      >
        <div className="container">
          <header className="evo-header">
            <h2 className="evo-title">Nossa Evolução</h2>
            <span className="evo-divider" aria-hidden />
          </header>

          <div className="evo-grid">
            <div className="evo-text">
              <p>
                Ao longo da nossa trajetória, a KaizerHaus evoluiu constantemente,
                sempre preservando a essência da verdadeira culinária alemã. Hoje,
                contamos com uma equipe de mais de <strong>10 chefs</strong> especializados,
                que unem tradição e técnica para entregar pratos autênticos e memoráveis.
              </p>
            </div>

            <figure className="evo-media-cookers">
              <img src={cookers} alt="Chefs preparando pratos" loading="lazy" />
            </figure>
          </div>

          <div className="evo-grid">
            <figure className="evo-media-melhordesp">
              <img src={melhordesp} alt="O Melhor de São Paulo — Gastronomia" loading="lazy" />
            </figure>

            <div className="evo-text">
              <p>
                Trabalhamos apenas com ingredientes selecionados a dedo de fornecedores
                de confiança, mantendo o padrão de excelência que nos tornou referência.
                Essa dedicação já nos rendeu reconhecimentos importantes: fomos eleitos
                por duas vezes no prêmio <strong>Melhor de São Paulo</strong>, reflexo do
                nosso compromisso em oferecer qualidade, sabor e hospitalidade em cada detalhe.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section
        className="about-delivery"
        style={{ ["--delivery-bg" as any]: `url(${background1})` }}
      >
        <div className="container">
          <header className="delivery-header">
            <h2 className="delivery-title">KaizerHaus onde você estiver</h2>
            <span className="delivery-divider">
              <img src={bretz} alt="" aria-hidden />
            </span>
          </header>

          <div className="delivery-grid">
            <figure className="delivery-media">
              <img src={delivery} alt="Entrega KaizerHaus" loading="lazy" />
            </figure>

            <div className="delivery-text">
              <p>
                Com a chegada da pandemia, a KaizerHaus passou por um período de 
                transformação e adaptação. Hoje, oferecemos a autêntica gastronomia 
                alemã também de forma 100% online, garantindo praticidade sem abrir 
                mão do padrão de excelência que sempre foi marca do nosso restaurante.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

