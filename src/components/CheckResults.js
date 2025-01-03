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

  const handleSelectDraw = async (drawId) => {
    setSelectedDraw(drawId);

    if (drawId) {
      const selectedDrawData = draws.find((draw) => draw.id === parseInt(drawId, 10));
      if (selectedDrawData) {
        const numbers = selectedDrawData.numbers.split(',').map((num) => parseInt(num, 10));
        setWinningNumbers(numbers);
      }
    } else {
      setWinningNumbers([]);
    }
  };

  const handleCheckResults = async () => {
    const parsedGames = games
      .split(/\s*,\s*/)
      .map((num) => parseInt(num, 10))
      .filter((n) => !isNaN(n));

    const gamesArray = [];
    while (parsedGames.length) {
      gamesArray.push(parsedGames.splice(0, 15));
    }

    try {
      const response = await axios.post('http://localhost:5000/api/check-results', {
        drawId: Number(selectedDraw), // Converta o drawId para número
        games: gamesArray,
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error checking results:', error);
    }
  };

  

  const handleSaveResults = async () => {
    try {
      await axios.post('http://localhost:5000/api/save-results', {
        drawId: selectedDraw,
        results,
      });
      alert('Consulta salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
    }
  };

  return (
    <div className="check-results">
      <h1>Verificar Jogos</h1>
      <div className="form-group">
        <label>Selecione o Sorteio:</label>
        <select
          value={selectedDraw}
          onChange={(e) => handleSelectDraw(e.target.value)}
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
          {results.map((result, index) => (
            <div key={index} className="game-result">
              <h3>Jogo {index + 1}</h3>
              <div className="game-numbers">
                {result.game.map((num) => (
                  <span
                    key={num}
                    className={`circle ${winningNumbers.includes(num) ? 'green' : 'red'}`}
                  >
                    {num}
                  </span>
                ))}
              </div>
              <p>{result.acertos} acertos</p>
            </div>
          ))}
          <button onClick={handleSaveResults}>Salvar Consulta</button>
        </div>
      )}
    </div>
  );
}

export default CheckResults;
