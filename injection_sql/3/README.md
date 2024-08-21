# Injection SQL UNION

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
    node app.js
    ```

2. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:3000/`.

## Structure du Projet

### Fichiers

- **app.js** : Contient la logique principale de l'application, y compris la configuration de la base de données et les routes.

### Routes Disponibles

- **Route `/articles`** : Permet d'afficher les articles dont le titre correspond à la recherche spécifiée en tant que paramètre de requête (`search`).
- **Route `/articles/easy`** : version facile affiche en plus la requête.Permet d'afficher les articles dont le titre correspond à la recherche spécifiée en tant que paramètre de requête (`search`).

## Défis
Afficher le mot de passe de l'utilisateur avec le username admin


### Explication du Fonctionnement

Le code actuel configure une base de données SQLite en mémoire, crée deux tables (`articles` et `users`), et insère des données d'exemple. Ensuite, il définit deux routes qui permettent d'afficher les articles en fonction d'une recherche.

## Comprendre la Faille

### Description de la Faille

Le code contient une vulnérabilité SQL Injection. Dans les routes `/articles` et `/articles/easy`, la valeur du paramètre `search` est directement insérée dans la requête SQL sans aucune validation ni échappement des entrées utilisateur. Cela permet à un attaquant de manipuler la requête SQL en injectant des commandes SQL arbitraires.

### Exploitation de la Faille

Voici comment vous pouvez exploiter cette faille :

1. **Accédez à la route `/articles`** avec un paramètre `search` dangereux. Par exemple, essayez :

    ```bash
    http://127.0.0.1:3000/articles?search=' OR 1=1 -- 
    ```

    Cette requête retournera tous les articles, car `OR 1=1` est toujours vrai, ce qui contourne le filtrage normalement effectué par le `LIKE`.

2. **Accédez à la route `/articles`** avec un paramètre `search` dangereux. Par exemple, essayez :

    ```bash
    http://127.0.0.1:3000/articles?search=' UNION SELECT id, username, password from users -- 
    ```

    Cette requête retournera tous les articles et tout les users, car `UNION SELECT` permet de joindre une autre table à la requetes de base.


## Corriger la Faille

### Solution 1 : Utiliser des Requêtes Paramétrées

Pour éviter les injections SQL, utilisez des requêtes préparées qui échappent automatiquement les entrées utilisateur.

### Exemple de Correction

Voici comment vous pouvez modifier les routes pour utiliser une requête préparée :

```javascript
app.get('/articles', (req, res) => {
    const { search } = req.query;
    const query = `SELECT * FROM articles WHERE title LIKE ?`;

    db.all(query, [`%${search}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/articles/easy', (req, res) => {
    const { search } = req.query;
    const query = `SELECT * FROM articles WHERE title LIKE ?`;

    db.all(query, [`%${search}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ query: query, res: rows });
    });
});
```

Dans cette version, le paramètre `search` est passé comme un paramètre de la requête SQL, empêchant ainsi toute injection SQL.