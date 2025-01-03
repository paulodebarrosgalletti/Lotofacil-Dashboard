import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckResult.css';

function CheckResults() {
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState('');
  const [games, setGames] = useState('');
  const [results, setResults] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/draws');
      setDraws(response.data);
    } catch (error) {
      console.error('Error fetching draws:', error);
    }
  };

  const handleSelectDraw = async (e) => {
    const drawId = e.target.value;
    setSelectedDraw(drawId);
    console.log('ID do sorteio selecionado no dropdown:', drawId);
  
    if (drawId) {
      const selectedDrawData = draws.find((draw) => draw.id === parseInt(drawId, 10));
      if (selectedDrawData) {
        const numbers = selectedDrawData.numbers.split(',').map((num) => parseInt(num, 10));
        setWinningNumbers(numbers);
        console.log('Números sorteados do sorteio selecionado:', numbers);
      } else {
        console.log('Sorteio não encontrado localmente para o ID:', drawId);
      }
    } else {
      setWinningNumbers([]);
    }
  };

  const handleCheckResults = async () => {
    console.log('Iniciando a verificação dos resultados...');
    console.log('ID do sorteio selecionado:', selectedDraw);
  
    const parsedGames = games
      .split(/\s*,\s*/)
      .map((num) => parseInt(num, 10))
      .filter((n) => !isNaN(n));
    
    const gamesArray = [];
    while (parsedGames.length) {
      gamesArray.push(parsedGames.splice(0, 15));
    }
  
    try {
      console.log('Enviando requisição ao backend...');
      console.log('Payload:', { drawId: Number(selectedDraw), games: gamesArray });
  
      const response = await axios.post('http://localhost:5000/api/check-results', {
        drawId: Number(selectedDraw), // Converta o drawId para número
        games: gamesArray,
      });
  
      console.log('Resposta do servidor:', response.data);
      setResults(response.data.results);
    } catch (error) {
      console.error('Erro ao verificar os resultados:', error);
      if (error.response) {
        console.error('Detalhes do erro do servidor:', error.response.data);
      }
    }
  };
  
  

  return (
    <div className="check-results">
      <h1>Verificar Jogos</h1>
      <div className="form-group">
        <label>Selecione o Sorteio:</label>
        <select
  value={selectedDraw}
  onChange={handleSelectDraw} // Atualiza com o método correto
>
  <option value="">Selecione</option>
  {draws.map((draw) => (
    <option key={draw.id} value={draw.id}>
      Sorteio {draw.date}
    </option>
  ))}
</select>

      </div>

      {winningNumbers.length > 0 && (
        <div>
          <h2>Números Sorteados</h2>
          <div className="winning-numbers">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
              <span
                key={num}
                className={`circle ${winningNumbers.includes(num) ? 'green' : 'red'}`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Insira os Jogos (15 números por jogo separados por vírgula):</label>
        <textarea
          value={games}
          onChange={(e) => setGames(e.target.value)}
          rows="5"
          cols="50"
          placeholder="Exemplo: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 1,2,3,..."
        />
      </div>

      <button onClick={handleCheckResults}>Verificar Resultados</button>

      {results.length > 0 && (
        <div>
          <h2>Resultados</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Jogo {index + 1}: {result.acertos} acertos
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CheckResults;
