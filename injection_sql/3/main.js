const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connexion à la base de données SQLite
const db = new sqlite3.Database(':memory:');

// Création des tables et insertion des données d'exemple
db.serialize(() => {
    db.run("CREATE TABLE articles (id INTEGER PRIMARY KEY, title TEXT, content TEXT)");
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

    db.run("INSERT INTO articles (title, content) VALUES ('Article 1', 'python est génial')");
    db.run("INSERT INTO articles (title, content) VALUES ('Article 2', 'rust c est nul')");

    db.run("INSERT INTO users (username, password) VALUES ('admin', 'password123')");
    db.run("INSERT INTO users (username, password) VALUES ('guest', 'guestpassword')");
});

// Middleware pour parser les paramètres URL
app.use(express.urlencoded({ extended: true }));

// Route vulnérable pour afficher les articles
app.get('/articles', (req, res) => {
    const { search } = req.query;
    const query = `SELECT * FROM articles WHERE title LIKE '%${search}%'`;

    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/articles/easy', (req, res) => {
    const { search } = req.query;
    const query = `SELECT * FROM articles WHERE title LIKE '%${search}%'`;

    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({query: `SELECT * FROM articles WHERE title LIKE '%${search}%'`, res: rows});
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
