const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./lotofacil.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabelas se não existirem
db.run(`
  CREATE TABLE IF NOT EXISTS draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    numbers TEXT NOT NULL
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS saved_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    draw_id INTEGER NOT NULL,
    results TEXT NOT NULL,
    FOREIGN KEY(draw_id) REFERENCES draws(id)
  )
`);

// Endpoints de sorteios
app.get('/api/draws', (req, res) => {
  db.all('SELECT * FROM draws', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/draws', (req, res) => {
  const { date, numbers } = req.body;

  if (!date || !numbers) {
    return res.status(400).json({ error: 'Data e números são obrigatórios.' });
  }

  const stmt = db.prepare('INSERT INTO draws (date, numbers) VALUES (?, ?)');
  stmt.run([date, numbers], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Endpoints de resultados
app.post('/api/check-results', (req, res) => {
  const { drawId, games } = req.body;

  if (!drawId || !games || !Array.isArray(games)) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const parsedDrawId = parseInt(drawId, 10);
  db.get('SELECT numbers FROM draws WHERE id = ?', [parsedDrawId], (err, row) => {
    if (err) {
      console.error('Erro ao buscar sorteio:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      console.error('Sorteio não encontrado para o ID:', parsedDrawId);
      return res.status(404).json({ error: 'Sorteio não encontrado.' });
    }

    const winningNumbers = row.numbers.split(',').map((num) => parseInt(num, 10));
    const results = games.map((game) => {
      const acertos = game.filter((num) => winningNumbers.includes(num)).length;
      return { game, acertos };
    });

    res.json({ winningNumbers, results });
  });
});

app.post('/api/save-results', (req, res) => {
  const { drawId, results } = req.body;

  if (!drawId || !results) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const stmt = db.prepare('INSERT INTO saved_results (draw_id, results) VALUES (?, ?)');
  stmt.run([drawId, JSON.stringify(results)], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Consulta salva com sucesso!' });
  });
});

app.get('/api/saved-results', (req, res) => {
  db.all('SELECT * FROM saved_results', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map((row) => ({
        ...row,
        results: JSON.parse(row.results),
      })));
    }
  });
});

// Endpoint para apagar uma consulta salva
app.delete('/api/saved-results/:id', (req, res) => {
    const { id } = req.params;
  
    db.run('DELETE FROM saved_results WHERE id = ?', [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Consulta salva apagada com sucesso!' });
    });
  });

  // Endpoint para obter estatísticas dos números
app.get('/api/statistics', (req, res) => {
  db.all('SELECT numbers FROM draws', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const numberCounts = Array(25).fill(0);
    rows.forEach((row) => {
      row.numbers.split(',').forEach((num) => {
        numberCounts[parseInt(num, 10) - 1]++;
      });
    });

    const mostFrequent = [...numberCounts]
      .map((count, index) => ({ number: index + 1, count }))
      .sort((a, b) => b.count - a.count);

    const leastFrequent = [...numberCounts]
      .map((count, index) => ({ number: index + 1, count }))
      .sort((a, b) => a.count - b.count);

    res.json({ mostFrequent, leastFrequent });
  });
});


// Inicializar o servidor
app.listen(5000, () => {
  console.log('Servidor backend rodando em http://localhost:5000');
});
