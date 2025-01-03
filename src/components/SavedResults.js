import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SavedResults.css';

function SavedResults() {
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    fetchSavedResults();
  }, []);

  const fetchSavedResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/saved-results');
      setSavedResults(response.data || []); // Garante que será um array
    } catch (error) {
      console.error('Erro ao buscar consultas salvas:', error);
    }
  };

  const handleDeleteResult = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/saved-results/${id}`);
      setSavedResults(savedResults.filter((result) => result.id !== id)); // Remove localmente
    } catch (error) {
      console.error('Erro ao apagar consulta salva:', error);
    }
  };

  return (
    <div className="saved-results">
      <h1>Consultas Salvas</h1>
      {savedResults.length === 0 ? (
        <p>Nenhuma consulta salva disponível.</p>
      ) : (
        savedResults.map((result, index) => (
          <div key={result.id} className="saved-result">
            <h2>
              Consulta {result.id} - Sorteio: {result.draw_id}
            </h2>
            <div className="numbers-display">
              {result.results.map((game, gameIndex) => (
                <div key={gameIndex} className="game-result">
                  <h3>Jogo {gameIndex + 1}</h3>
                  <div className="number-circles">
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                      <span
                        key={num}
                        className={`circle ${
                          game?.game?.includes(num)
                            ? result?.winningNumbers?.includes(num)
                              ? 'green'
                              : 'red'
                            : ''
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <p>{game.acertos || 0} acertos</p>
                </div>
              ))}
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteResult(result.id)}
            >
              Apagar Consulta
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SavedResults;
