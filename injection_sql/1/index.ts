const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());


const db = new sqlite3.Database(':memory:');

db.serialize(() => {
 db.run("CREATE TABLE users (id INT, name TEXT, password TEXT)");
 const stmt = db.prepare("INSERT INTO users (id, name, password) VALUES (?, ?, ?)");
 stmt.run(1, "Admin", "admin123");
 stmt.run(2, "tyki6", "password123");
 stmt.run(3, "toto", "password123");
 stmt.finalize();
});


app.get('/users/:id', (req: any, res: any) => {
 let userId = req.params.id;
    if (userId === '1') {
        res.status(401).send("Unauthorized access")
    }
 let sql = `SELECT * FROM users WHERE id = ${userId}`;
 db.all(sql, [], (err: any, rows: any) => {
   if (err) {
     res.status(500).send("Error in database operation");
   } else {
     res.json(rows);
   }
 });
});

const PORT = 4000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
