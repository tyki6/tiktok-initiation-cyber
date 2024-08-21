# Vulnérabilité XSS (Cross-Site Scripting)

## Prérequis

### Environnement Node.js

- **Node.js** : [Télécharger Node.js](https://nodejs.org/)
- **npm** : Vient avec Node.js pour gérer les paquets

### Installation des Dépendances

1. **Cloner ce dépôt** sur votre machine :

    ```bash
    git clone https://github.com/tyki6/tiktok-initiation-cyber.git
    cd tiktok-initiation-cyber
    ```

2. **Installer les dépendances** nécessaires :

    ```bash
    npm install
    ```

## Démarrage du Projet

1. **Lancez le serveur** :

    ```bash
    node main.js
    ```

2. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:3000/`.

## Explication du Code

Le code de l'application Express.js ci-dessus est une simple application de commentaires. Elle permet aux utilisateurs de soumettre des commentaires via un formulaire, puis de les afficher sur la même page. Le problème est que les commentaires soumis par les utilisateurs sont directement injectés dans le HTML de la page sans aucune validation ou filtrage.

### Route Vulnérable

Voici les routes vulnérables :

```javascript
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
```

### Comprendre la Faille XSS

#### Étape 1 : Introduction

La vulnérabilité XSS (Cross-Site Scripting) permet à un attaquant d'injecter du code JavaScript malveillant dans la page web visitée par les autres utilisateurs. Ce code est exécuté par le navigateur des utilisateurs, ce qui permet à l'attaquant de voler des informations sensibles, de rediriger l'utilisateur vers d'autres sites, ou d'exécuter d'autres actions malveillantes.

#### Étape 2 : Exploitation

Dans cette application, un attaquant peut exploiter la vulnérabilité en soumettant un commentaire contenant du code JavaScript malveillant. Par exemple, un attaquant peut soumettre le commentaire suivant :

```html
<script>alert('Vous avez été piraté !');</script>
```

Lorsque ce commentaire est affiché sur la page, le script JavaScript sera exécuté par le navigateur de l'utilisateur, affichant une alerte avec le message "Vous avez été piraté !".

#### Étape 3 : Exemple d'Exploitation

Accédez à l'application via `http://127.0.0.1:3000/` et soumettez le commentaire suivant pour voir l'exploitation en action :

```html
<script>alert('XSS')</script>
```

Cela déclenchera une alerte chaque fois que la page sera chargée.

## Corriger la Faille

### Solution : Échapper les Données Utilisateur

Pour corriger cette vulnérabilité, il est essentiel de ne jamais insérer directement des données utilisateur dans le HTML sans les échapper. En JavaScript, cela peut être fait en utilisant des bibliothèques comme `express-validator` ou en échappant manuellement les caractères spéciaux.

Voici comment vous pouvez modifier le code pour éviter l'exécution de scripts injectés :

```javascript
const escapeHtml = (text) => {
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
};

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/comment">
      <input type="text" name="comment" />
      <button type="submit">Envoyer</button>
    </form>
    <div>
      ${comments.map(comment => `<p>${escapeHtml(comment)}</p>`).join('')}
    </div>
  `);
});
```

### Autre Solution : Utilisation de Bibliothèques de Sécurité

Utilisez des bibliothèques comme `helmet` pour renforcer la sécurité de votre application Express en ajoutant des headers de sécurité HTTP :

```bash
npm install helmet
```

Et dans votre application :

```javascript
const helmet = require('helmet');
app.use(helmet());
```