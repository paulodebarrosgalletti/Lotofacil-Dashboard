import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [draws, setDraws] = useState([]);
  const [username] = useState('Paulo');

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

  return (
    <div className="home">
      <h1>Bem-vindo, {username}!</h1>
      <div className="last-draw">
        {draws.length > 0 ? (
          <>
            <p>Último Sorteio:</p>
            <h2>Sorteio {draws[draws.length - 1].date}</h2>
            <div className="numbers-container">
              {draws[draws.length - 1].numbers.split(',').map((number, index) => (
                <span key={index} className="number-circle">
                  {number}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p>Nenhum sorteio disponível.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
