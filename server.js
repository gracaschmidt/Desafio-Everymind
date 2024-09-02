const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'nunes_sports'
});

// Função para executar consultas
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Endpoints CRUD
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await query('SELECT * FROM produtos');
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/produtos', async (req, res) => {
    const { nome, codigo, descricao, preco } = req.body;
    try {
        const result = await query('INSERT INTO produtos (nome, codigo, descricao, preco) VALUES (?, ?, ?, ?)', [nome, codigo, descricao, preco]);
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/produtos/:id', async (req, res) => {
    const { nome, codigo, descricao, preco } = req.body;
    const { id } = req.params;
    try {
        await query('UPDATE produtos SET nome = ?, codigo = ?, descricao = ?, preco = ? WHERE id = ?', [nome, codigo, descricao, preco, id]);
        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM produtos WHERE id = ?', [id]);
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
