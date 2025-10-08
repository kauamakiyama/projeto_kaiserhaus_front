import React from 'react';
import '../styles/ProgressSteps.css';

type StepKey = 'sacola' | 'entrega' | 'pagamento' | 'conclusao';

export type ProgressStepsProps = {
  current: StepKey;
};

const iconMap: Record<StepKey, string> = {
  sacola: '/src/assets/niveis/basket.png',
  entrega: '/src/assets/niveis/delivery-bike.png',
  pagamento: '/src/assets/niveis/money.png',
  conclusao: '/src/assets/niveis/check-mark.png',
};

const labels: Record<StepKey, string> = {
  sacola: 'Sacola',
  entrega: 'Entrega',
  pagamento: 'Pagamento',
  conclusao: 'Conclusão',
};

const order: StepKey[] = ['sacola', 'entrega', 'pagamento', 'conclusao'];

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ current }) => {
  const currentIndex = order.indexOf(current);

  return (
    <div className="kh-progress">
      {order.map((key, idx) => {
        const state = idx < currentIndex ? 'done' : idx === currentIndex ? 'active' : 'pending';
        return (
          <React.Fragment key={key}>
            <div className={`kh-progress__step ${state}`}>
              <span className="kh-progress__icon">
                <img src={iconMap[key]} alt="" />
              </span>
              <span className="kh-progress__label">{labels[key]}</span>
            </div>
            {idx < order.length - 1 && (
              <div className={`kh-progress__line ${idx < currentIndex ? 'active' : ''}`} />)
            }
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressSteps;


