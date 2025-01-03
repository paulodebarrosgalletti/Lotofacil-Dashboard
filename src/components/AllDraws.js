import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AllDraws() {
  const [draws, setDraws] = useState([]);
  const [newDraw, setNewDraw] = useState({ number: '', numbers: '' });

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/draws');
      const sortedDraws = response.data.sort((a, b) => parseInt(b.date) - parseInt(a.date)); // Ordena decrescentemente pelo número do sorteio
      setDraws(sortedDraws);
    } catch (error) {
      console.error('Error fetching draws:', error);
    }
  };

  const addDraw = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/draws', newDraw);
      setDraws([...draws, { id: response.data.id, ...newDraw }]);
      setNewDraw({ number: '', numbers: '' });
    } catch (error) {
      console.error('Error adding draw:', error);
    }
  };

  return (
    <div>
      <h2>Todos os Sorteios</h2>
      <div>
        <h3>Adicionar Novo Sorteio</h3>
        <input
          type="number"
          placeholder="Número do Sorteio"
          value={newDraw.number}
          onChange={(e) => setNewDraw({ ...newDraw, number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Números (separados por vírgula)"
          value={newDraw.numbers}
          onChange={(e) => setNewDraw({ ...newDraw, numbers: e.target.value })}
        />
        <button onClick={addDraw}>Adicionar Sorteio</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número do Sorteio</th>
            <th>Números</th>
          </tr>
        </thead>
        <tbody>
          {draws.map((draw) => (
            <tr key={draw.id}>
              <td>{draw.id}</td>
              <td>{draw.date}</td>
              <td>{draw.numbers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllDraws;
