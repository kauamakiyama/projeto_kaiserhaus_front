import React from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Cardapio.css';
import douradoImg from '../assets/login/dourado.png';

const CardapioPage: React.FC = () => {
  const handleAdd = (name: string) => {
    console.log(`Adicionado: ${name}`);
  };

  return (
    <div className="menu-page">
      <h1 className="menu-title">Cardápio</h1>
      <img src={douradoImg} alt="divisor dourado" className="menu-divider" />

      <div className="menu-grid">
        <ProductCard
          name="Sauerkraut"
          description="Repolho fermentado, com grãos de mostarda"
          price={27.99}
          imageUrl="https://images.unsplash.com/photo-1604908553721-569ce10b20aa?q=80&w=600&auto=format&fit=crop"
          onAddToBag={() => handleAdd('Sauerkraut')}
        />

        <ProductCard
          name="Bratwurst"
          description="Salsicha alemã grelhada com especiarias"
          price={34.5}
          imageUrl="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
          onAddToBag={() => handleAdd('Bratwurst')}
        />
      </div>
    </div>
  );
};

export default CardapioPage;


