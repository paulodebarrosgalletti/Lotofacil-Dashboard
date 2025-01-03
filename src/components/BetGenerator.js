import React from 'react';

function BetGenerator() {
  const generateBet = () => {
    const numbers = Array.from({ length: 15 }, () => Math.floor(Math.random() * 25) + 1);
    return [...new Set(numbers)].slice(0, 15).join(', ');
  };

  return (
    <div>
      <h2>Gerador de Apostas</h2>
      <button onClick={() => alert(`Aposta gerada: ${generateBet()}`)}>Gerar Aposta</button>
    </div>
  );
}

export default BetGenerator;
