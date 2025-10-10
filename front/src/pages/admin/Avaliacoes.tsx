import React, { useMemo, useState } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/Avaliacoes.css";
import douradoImg from "../../assets/login/dourado.png";

type Review = {
  id: string;
  user: string;
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
};

type RatingFilter = 1 | 2 | 3 | 4 | 5 | "all";
type TimeFilter = "3d" | "1w" | "3w" | "1m" | "3m" | "all";
type SortBy = "time" | "rating";

const MOCK_REVIEWS: Review[] = [ //trocar com o back depois 
  {
    id: "1",
    user: "Guilherme Silva",
    comment:
      "Pedido demorou um pouco para chegar, porém está muito boa a comida",
    rating: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    user: "Julio Neves",
    comment:
      "Comida estava excelente e a entrega foi feita muito rapidamente",
    rating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "3",
    user: "Pedro Aguiar",
    comment:
      "Muita demora para entregar minha comida e ela chegou gelada",
    rating: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: "4",
    user: "Julia Pereira",
    comment:
      "Pratos bem servidos e embalados, só poderiam caprichar mais no molho",
    rating: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "5",
    user: "Ana Luiza",
    comment: "Maravilhoso! Virou meu lugar favorito para pedir no fim de semana",
    rating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
  },
];

function getThresholdMs(filter: TimeFilter): number | null {
  const day = 1000 * 60 * 60 * 24;
  switch (filter) {
    case "3d":
      return 3 * day;
    case "1w":
      return 7 * day;
    case "3w":
      return 21 * day;
    case "1m":
      return 30 * day;
    case "3m":
      return 90 * day;
    default:
      return null;
  }
}

const Star: React.FC<{ filled: boolean; size?: number; title?: string }> = ({
  filled,
  size = 18,
  title = "estrela",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={`kh-star ${filled ? "is-filled" : ""}`}
  >
    <path d="M12 2l2.962 6.001L22 9.173l-5 4.868L18.125 22 12 18.771 5.875 22 7 14.041l-5-4.868 7.038-1.172L12 2z" />
  </svg>
);

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="kh-stars" aria-label={`${value} de 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} filled={n <= value} />
    ))}
  </div>
);

const Avaliacoes: React.FC = () => {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("time");

  const filteredAndSorted = useMemo(() => {
    const now = Date.now();
    const threshold = getThresholdMs(timeFilter);

    let base = [...MOCK_REVIEWS];

    if (ratingFilter !== "all") {
      base = base.filter((r) => r.rating === ratingFilter);
    }

    if (threshold !== null) {
      base = base.filter((r) => now - new Date(r.createdAt).getTime() <= threshold);
    }

    base.sort((a, b) => {
      if (sortBy === "time") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return base;
  }, [ratingFilter, timeFilter, sortBy]);


  return (
    <>
    <Header />
    <main className="ratings-page">
      <div className="ratings-hero">
        <h1 className="ratings-title">Avaliações</h1>
        <img
              src={douradoImg}
              alt=""
              aria-hidden
              className="adm-divider-img"
            />
      </div>

      <section className="ratings-wrap">
        <header className="ratings-controls" aria-label="filtros e ordenação">
          <div className="select-group">
            <label className="sr-only" htmlFor="rating-select">Filtrar por nota</label>
            <select
              id="rating-select"
              className="kh-select"
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(
                  e.target.value === "all" ? "all" : (parseInt(e.target.value, 10) || 0) as RatingFilter
                )
              }
              title="Filtrar por nota"
            >
              <option value="all">Todos</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>

            <label className="sr-only" htmlFor="time-select">Intervalo de tempo</label>
            <select
              id="time-select"
              className="kh-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              title="Filtrar por período"
            >
              <option value="3d">3 dias</option>
              <option value="1w">1 semana</option>
              <option value="3w">3 semanas</option>
              <option value="1m">1 mês</option>
              <option value="3m">3 meses</option>
              <option value="all">Todos</option>
            </select>

            <label className="sr-only" htmlFor="sort-select">Ordenar por</label>
            <select
              id="sort-select"
              className="kh-select small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              title="Ordenar por"
            >
              <option value="time">Tempo</option>
              <option value="rating">Nota</option>
            </select>
          </div>
        </header>

        <ul className="ratings-list">
          {filteredAndSorted.map((r) => (
            <li key={r.id} className="rating-card">
              <div className="rating-card__row">
                <p className="rating-user">
                  <strong>Usuário :</strong> {r.user}
                </p>
                <Stars value={r.rating} />
              </div>
              <p className="rating-comment">
                <strong>Comentário :</strong> {r.comment}
              </p>
            </li>
          ))}

          {filteredAndSorted.length === 0 && (
            <li className="rating-empty">Nenhuma avaliação encontrada com os filtros atuais.</li>
          )}
        </ul>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default Avaliacoes;
