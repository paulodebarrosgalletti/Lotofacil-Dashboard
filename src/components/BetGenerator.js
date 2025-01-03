import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BetGenerator.css';

function BetGenerator() {
  const [numGames, setNumGames] = useState(1);
  const [generatedGames, setGeneratedGames] = useState([]);
  const [allNumbersFrequency, setAllNumbersFrequency] = useState([]);
  const [savedResults, setSavedResults] = useState([]);
  const [selectedSaved, setSelectedSaved] = useState('');

  useEffect(() => {
    fetchDraws();
    fetchSavedResults();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/draws');
      const numbersFrequency = Array(25).fill(0);

      response.data.forEach((draw) => {
        draw.numbers.split(',').forEach((num) => {
          numbersFrequency[parseInt(num, 10) - 1]++;
        });
      });

      setAllNumbersFrequency(numbersFrequency);
    } catch (error) {
      console.error('Erro ao buscar sorteios:', error);
    }
  };

  const fetchSavedResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/saved-results');
      setSavedResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar consultas salvas:', error);
    }
  };

  const generateGames = (algorithm) => {
    const games = [];
    const uniqueGames = new Set(); // Para garantir que os jogos sejam únicos
  
    // Obter os números mais ou menos frequentes
    const sortedByFrequency = allNumbersFrequency
      .map((count, index) => ({ number: index + 1, count }))
      .sort((a, b) => (algorithm === 'mostFrequent' ? b.count - a.count : a.count - b.count));
  
    let attempts = 0; // Limitar tentativas para evitar loops infinitos
  
    while (games.length < numGames && attempts < 1000) {
      let game = [];
  
      if (algorithm === 'mostFrequent' || algorithm === 'leastFrequent') {
        // Adicionar os números mais/menos frequentes
        const selectedNumbers = sortedByFrequency.slice(0, 10).map((entry) => entry.number);
  
        game = [...selectedNumbers];
  
        // Adicionar números aleatórios para completar os 15
        while (game.length < 15) {
          const randomNumber = Math.floor(Math.random() * 25) + 1;
          if (!game.includes(randomNumber)) {
            game.push(randomNumber);
          }
        }
      } else if (algorithm === 'random') {
        // Geração totalmente aleatória
        while (game.length < 15) {
          const num = Math.floor(Math.random() * 25) + 1;
          if (!game.includes(num)) game.push(num);
        }
      } else if (algorithm === 'basedOnSaved') {
        if (!selectedSaved) {
          alert('Selecione uma consulta salva antes de gerar jogos!');
          return;
        }
        const savedGame = savedResults.find((result) => result.id === parseInt(selectedSaved, 10));
        if (savedGame) {
          const winningNumbers = savedGame.winningNumbers || [];
          game = [...winningNumbers];
          while (game.length < 15) {
            const num = Math.floor(Math.random() * 25) + 1;
            if (!game.includes(num)) game.push(num);
          }
        }
      }
  
      game.sort((a, b) => a - b); // Ordenar os números do jogo em ordem crescente
      const gameKey = game.join(',');
  
      // Garantir que o jogo seja único
      if (!uniqueGames.has(gameKey)) {
        uniqueGames.add(gameKey);
        games.push(game);
      }
  
      attempts++; // Incrementar as tentativas
    }
  
    if (attempts >= 1000) {
      console.warn('Número de tentativas excedido. Algoritmo interrompido.');
    }
  
    setGeneratedGames(games);
  };
  
  
  return (
    <div className="bet-generator">
      <h1>Gerador de Apostas</h1>

      <div className="form-group">
        <label>Quantidade de jogos a gerar:</label>
        <input
          type="number"
          value={numGames}
          min="1"
          max="25"
          onChange={(e) => setNumGames(Math.min(Math.max(parseInt(e.target.value, 10), 1), 25))}
        />
      </div>

      <div className="form-group">
        <button onClick={() => generateGames('mostFrequent')}>Gerar Baseado nos Mais Frequentes</button>
        <button onClick={() => generateGames('leastFrequent')}>Gerar Baseado nos Menos Frequentes</button>
        <button onClick={() => generateGames('random')}>Gerar Aleatoriamente</button>
      </div>

      <div className="form-group">
        <label>Escolha uma consulta salva:</label>
        <select
          value={selectedSaved}
          onChange={(e) => setSelectedSaved(e.target.value)}
        >
          <option value="">Selecione</option>
          {savedResults.map((result) => (
            <option key={result.id} value={result.id}>
              Consulta {result.id}
            </option>
          ))}
        </select>
        <button onClick={() => generateGames('basedOnSaved')}>Gerar Baseado em Jogos Salvos</button>
      </div>

      <div>
        <h2>Jogos Gerados</h2>
        {generatedGames.map((game, index) => (
          <p key={index}>{game.join(', ')}</p>
        ))}
      </div>
    </div>
  );
}

export default BetGenerator;
