# Injection SQL Bypass login 

## Prérequis

### Environnement Python

- **Python 3.x** : [Télécharger Python](https://www.python.org/downloads/)

### Installation des Dépendances

1. **Créer un environnement virtuel** (optionnel mais recommandé) :

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate
    ```

2. **Installer les dépendances** nécessaires :

    ```bash
    pip install fastapi jinja2 uvicorn sqlite3
    ```

## Démarrage du Projet

1. **Initialisez la base de données** en exécutant le script Python pour la première fois :

    ```bash
    python main.py
    ```

2. **Lancez le serveur** :

    ```bash
    uvicorn main:app --reload
    ```

3. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:8000/`.

## Structure du Projet

### Fichiers

- **main.py** : Contient la logique principale de l'application, y compris la configuration de la base de données et les routes.
- **templates/login.html** : Fichier HTML utilisé pour afficher la page de connexion.

### Routes Disponibles

- **Route `/`** : Affiche la page de connexion où l'utilisateur peut entrer son nom d'utilisateur et son mot de passe.
- **Route `/login`** : Traite la soumission du formulaire de connexion, vérifie les informations d'identification et affiche un message en fonction du succès ou de l'échec de la connexion.

## Comprendre la Faille

### Description de la Faille

Le code contient une vulnérabilité SQL Injection. Dans la route `/login`, les champs `login` et `mot_de_passe` sont directement insérés dans la requête SQL sans aucune validation ni échappement des entrées utilisateur. Cela permet à un attaquant de manipuler la requête SQL en injectant des commandes SQL arbitraires.

### Exploitation de la Faille

Voici comment vous pouvez exploiter cette faille :

1. **Accédez à la route `/`** pour voir le formulaire de connexion.

2. **Soumettez le formulaire** avec une injection SQL. Par exemple, dans le champ `login`, entrez :

    ```sql
    ' OR '1'='1
    ```

    et laissez le champ `mot_de_passe` vide.

3. **Résultat** : Vous serez connecté même si vous n'avez pas fourni de véritables informations d'identification, car la condition `OR '1'='1'` est toujours vraie.

## Corriger la Faille

### Solution 1 : Utiliser des Requêtes Paramétrées

Pour éviter les injections SQL, utilisez des requêtes préparées qui échappent automatiquement les entrées utilisateur.

### Exemple de Correction

Voici comment vous pouvez modifier la route `/login` pour utiliser une requête paramétrée :

```python
@app.post("/login")
async def login(request: Request, login: str = Form(...), mot_de_passe: str = Form(...)):
    # Connexion à la base de données
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    query = "SELECT * FROM utilisateurs WHERE login = ? AND mot_de_passe = ?"
    cursor.execute(query, (login, mot_de_passe))
    result = cursor.fetchone()
    
    conn.close()
    
    if result:
        return templates.TemplateResponse("login.html", {"request": request, "message": "Connexion réussie!"})
    else:
        return templates.TemplateResponse("login.html", {"request": request, "message": "Nom d'utilisateur ou mot de passe incorrect."})
```

Dans cette version, les variables `login` et `mot_de_passe` sont passées comme paramètres à la requête SQL, ce qui empêche toute injection SQL.