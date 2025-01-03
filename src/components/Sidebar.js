import React from 'react';
import { NavLink } from 'react-router-dom';



function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li>
          <NavLink to="/" activeclassname="active">Página Inicial</NavLink>
        </li>
        <li>
          <NavLink to="/all-draws" activeclassname="active">Todos os Sorteios</NavLink>
        </li>
        <li>
          <NavLink to="/bet-generator" activeclassname="active">Gerador de Apostas</NavLink>
        </li>
        <li>
          <NavLink to="/check-results" activeclassname="active">Verificar Jogos</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
