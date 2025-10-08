import React from "react";
import { useCart } from "../contexts/CartContext";
import "../styles/ProductCard.css";

export type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  /** "card" (padrão) ou "row" para lista em linha (mock do Figma) */
  variant?: "card" | "row";
  onAdded?: () => void;
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  variant = "card",
  onAdded,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image: imageUrl,
      category,
    });
    if (onAdded) onAdded();
  };
  return (
    <div className={`product-card ${variant === "row" ? "is-row" : ""}`}>
      <div className="product-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">{name}</h3>
        </div>
        <p className="product-description">{description}</p>
        <span className="product-price">{formatBRL(price)}</span>
      </div>

      <button
        className="product-add"
        aria-label={`Adicionar ${name} à sacola`}
        onClick={handleAddToCart}
        type="button"
      >
        <svg
          className="product-add-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </button>
    </div>
  );
};

export default ProductCard;
