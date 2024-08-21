# LFI (local file inclusion)

## Prérequis

### Environnement Node.js

- **Node.js** : [Télécharger Node.js](https://nodejs.org/)
- **npm** : Vient avec Node.js pour gérer les paquets

### Installation des Dépendances

1. **Cloner ce dépôt** sur votre machine :

    ```bash
    git clone https://github.com/votre-utilisateur/repo-nom.git
    cd repo-nom
    ```

2. **Installer les dépendances** nécessaires :

    ```bash
    npm install
    ```

## Démarrage du Projet

1. **Lancez le serveur** :

    ```bash
    npm dev
    ```

2. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:3000/`.

## Défis
Afficher le contenu du fichier `secret/flag.txt` grâce à la route `http://localhost:3000/file/read?file=XXXXXX`


## Explication du Code

### Description du Fonctionnement

L'application comprend une route `/file/read` qui permet de lire et d'afficher le contenu d'un fichier en spécifiant son chemin via un paramètre de requête (`file`). L'idée est de permettre la lecture de certains fichiers spécifiques, mais si la validation des entrées utilisateur est insuffisante, cela peut exposer l'application à une vulnérabilité de type LFI.

### Route Vulnérable

La route suivante est vulnérable à l'inclusion de fichiers locaux :

```javascript
readFile(@Query('file') filePath: string, @Res() res: Response) {
    if (!filePath) {
      return res.send('<p>essaye d afficher le fichier flag.txt dans le dossier secret :)</p>');
    }

    const fullPath = path.join(__dirname, filePath);
    console.log(fullPath)
    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
      res.send(data);
    });
  }
```

### Exploitation de la Faille

#### Étape 1 : Comprendre la Route

La route `/file/read` attend un paramètre `file` indiquant le chemin d'un fichier à lire. Cependant, comme le chemin du fichier est fourni directement par l'utilisateur sans vérification adéquate, un attaquant peut essayer de manipuler ce paramètre pour accéder à des fichiers sensibles du serveur.

#### Étape 2 : Exploiter la Faille LFI

Pour afficher le contenu du fichier `secret/flag.txt`, vous pouvez utiliser une requête telle que :

```bash
http://localhost:3000/file/read?file=../secret/flag.txt
```

Si l'application ne restreint pas correctement l'accès aux fichiers en dehors des dossiers autorisés, vous pouvez également essayer des chemins relatifs pour accéder à d'autres fichiers, comme le fichier de configuration du serveur ou les fichiers système :

```bash
http://localhost:3000/file/read?file=../../etc/passwd
```

## Corriger la Faille

### Solution 1 : Limiter les Chemins d'Accès

Pour éviter les inclusions de fichiers non autorisés, vous pouvez limiter l'accès à un répertoire spécifique et interdire les chemins relatifs. Voici une façon de sécuriser la route :

```javascript
app.get('/file/read', (req, res) => {
    const filePath = req.query.file;
    if (!filePath) {
        return res.status(400).send("File path is required");
    }

    // Vérifier que le fichier est dans le répertoire autorisé
    const safePath = path.normalize(path.join(__dirname, 'safe_directory', filePath));

    if (!safePath.startsWith(path.join(__dirname, 'safe_directory'))) {
        return res.status(403).send("Access denied");
    }

    res.sendFile(safePath, (err) => {
        if (err) {
            res.status(500).send("Error reading file");
        }
    });
});
```

### Solution 2 : Utiliser un Mapping de Fichiers

Au lieu de permettre aux utilisateurs de fournir des chemins de fichiers, vous pouvez implémenter un mapping où chaque fichier accessible est identifié par une clé, ce qui réduit le risque d'accès non autorisé.

```javascript
const fileMap = {
    'flag': 'secret/flag.txt',
    'readme': 'README.md'
};

app.get('/file/read', (req, res) => {
    const fileKey = req.query.file;
    const filePath = fileMap[fileKey];

    if (!filePath) {
        return res.status(404).send("File not found");
    }

    res.sendFile(path.join(__dirname, filePath), (err) => {
        if (err) {
            res.status(500).send("Error reading file");
        }
    });
});
```