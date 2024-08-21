# Injection SQL

## Prérequis

### Environnement Node.js

- **Node.js** : [Télécharger Node.js](https://nodejs.org/)
- **bun** : Vient avec Node.js pour gérer les paquets

### Installation des Dépendances

1. **Cloner ce dépôt** sur votre machine :

    ```bash
    git clone https://github.com/votre-utilisateur/repo-nom.git
    cd repo-nom
    ```

2. **Installer les dépendances** nécessaires :

    ```bash
    bun install
    ```

## Démarrage du Projet

1. **Lancez le serveur** :

    ```bash
    bun index.ts
    ```

2. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:4000/`.

## Structure du Projet

### Routes Disponibles

- **Route `/users/:id`** : Cette route permet d'afficher les informations d'un utilisateur en fonction de son ID. Par exemple, en accédant à `/users/2`, vous récupérerez les informations de l'utilisateur avec l'ID 2.

### Explication du Fonctionnement

Le code actuel configure une base de données SQLite en mémoire et insère quelques utilisateurs pour illustrer l'exemple. Ensuite, il définit une route `/users/:id` qui récupère les informations de l'utilisateur dont l'ID est spécifié dans l'URL.

## Comprendre la Faille

### Description de la Faille

Le code contient une vulnérabilité SQL Injection. Dans la route `/users/:id`, l'ID de l'utilisateur est directement inséré dans la requête SQL sans aucune validation ni échappement des entrées utilisateur. Cela permet à un attaquant de manipuler la requête SQL en injectant des commandes SQL arbitraires.

### Exploitation de la Faille

Voici comment vous pouvez exploiter cette faille :

1. **Accédez à la route `/users/2`** pour voir les informations de l'utilisateur avec l'ID 2.

2. **Modifiez l'URL** pour injecter du SQL. Par exemple, accédez à :

    ```bash
    http://127.0.0.1:4000/users/2 OR 1=1
    ```

    Cette requête récupérera tous les utilisateurs, car `OR 1=1` est toujours vrai.

## Corriger la Faille

### Solution 1 : Utiliser des Requêtes Préparées

Pour éviter les injections SQL, utilisez des requêtes préparées qui échappent automatiquement les entrées utilisateur.

### Exemple de Correction

Voici comment vous pouvez modifier la route `/users/:id` pour utiliser une requête préparée :

```javascript
app.get('/users/:id', (req, res) => {
    let userId = req.params.id;
    if (userId === '1') {
        res.status(401).send("Unauthorized access")
    }

    let sql = `SELECT * FROM users WHERE id = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(500).send("Error in database operation");
        } else {
            res.json(rows);
        }
    });
});
```

Dans cette version, l'ID de l'utilisateur est passé en paramètre dans la requête préparée, empêchant ainsi toute injection SQL.