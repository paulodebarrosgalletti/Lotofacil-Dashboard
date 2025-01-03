import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  <div>
    <h1>Bem-vindo, {username}!</h1>
    <p>
      Último sorteio cadastrado,
      {draws.length > 0 
        ? ` Sorteio ${draws[draws.length - 1].date}: ${draws[draws.length - 1].numbers}` 
        : 'Nenhum sorteio disponível.'}
    </p>
  </div>
);
}

export default Home;
