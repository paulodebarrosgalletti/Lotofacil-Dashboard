import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllDraws.css';

function AllDraws() {
  const [draws, setDraws] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const drawsPerPage = 50;

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/draws');
      const sortedDraws = response.data.sort((a, b) => parseInt(b.date) - parseInt(a.date)); // Ordena decrescentemente
      setDraws(sortedDraws);
    } catch (error) {
      console.error('Error fetching draws:', error);
    }
  };

  const totalPages = Math.ceil(draws.length / drawsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo
  };

  const currentDraws = draws.slice(
    (currentPage - 1) * drawsPerPage,
    currentPage * drawsPerPage
  );

  return (
    <div className="all-draws">
      <h2>Todos os Sorteios</h2>
      <div className="draws-container">
        {currentDraws.map((draw) => (
          <div key={draw.id} className="draw-item">
            <h3>Sorteio {draw.date}</h3>
            <div className="numbers">
              {draw.numbers.split(',').map((number, index) => (
                <span key={index} className="number-circle">
                  {number}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &larr;
        </button>
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Página {i + 1}
            </option>
          ))}
        </select>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default AllDraws;
