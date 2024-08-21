const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
let comments = [];

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/comment">
      <input type="text" name="comment" />
      <button type="submit">Envoyer</button>
    </form>
    <div>
      ${comments.map(comment => `<p>${comment}</p>`).join('')}
    </div>
  `);
});

app.post('/comment', (req, res) => {
  comments.push(req.body.comment);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
