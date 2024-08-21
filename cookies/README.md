# Cookies

Comment faire des `session hijacking`.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

### Environnement Python

- **Python 3.x** : [Télécharger Python](https://www.python.org/downloads/)
- **Flask** : Framework web léger pour Python

### Installation des dépendances

Vous pouvez installer les dépendances nécessaires en utilisant `pip`. Pour ce faire, suivez ces étapes :

1. Créez un environnement virtuel (optionnel mais recommandé) :

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate
    ```

2. Installez Flask :

    ```bash
    pip install Flask
    ```

## Démarrage du Projet

Voici comment démarrer le projet pour voir la faille en action :

1. Clonez ce dépôt sur votre machine :

    ```bash
    git clone https://github.com/votre-utilisateur/repo-nom.git
    cd repo-nom
    ```

2. Assurez-vous que votre environnement virtuel est activé, puis lancez le serveur Flask :

    ```bash
    python cookies/main.py
    ```

3. Accédez à l'application via votre navigateur à l'adresse suivante : `http://127.0.0.1:5000/`.

## Structure du Projet

Voici un aperçu des routes disponibles dans cette application :

- **Route `/`** : Affiche un message en fonction du rôle de l'utilisateur (guest, user, admin).
- **Route `/login`** : Simule la connexion d'un utilisateur en définissant un cookie de rôle avec la valeur `user`.
- **Route `/logout`** : Supprime le cookie de rôle pour simuler la déconnexion.

## Comprendre la Faille

### Description de la Faille

La vulnérabilité de cette application réside dans la gestion non sécurisée des cookies, en particulier le cookie `role`. Ce cookie détermine le rôle de l'utilisateur (`guest`, `user`, `admin`). Actuellement, il est possible de manipuler ce cookie pour accéder à des privilèges élevés sans aucune vérification d'identité.

### Exploitation de la Faille

Voici comment vous pouvez exploiter cette faille :

1. **Connectez-vous** en tant qu'utilisateur normal en accédant à `http://127.0.0.1:5000/login`.
   
2. **Accédez à la page principale** (`http://127.0.0.1:5000/`) et observez le message affiché. Vous êtes connecté en tant qu'`user`.

3. **Modifiez le cookie** :
    - Ouvrez les outils de développement de votre navigateur (`F12` sur Chrome/Firefox).
    - Allez dans l'onglet **Application** (ou **Storage**).
    - Sous la section **Cookies**, trouvez le cookie `role`.
    - Changez la valeur de `user` à `admin`.

4. **Rechargez la page** et observez que vous êtes maintenant identifié comme `admin`.

## Corriger la Faille

La solution pour corriger cette vulnérabilité est de ne pas faire confiance aux données stockées côté client (comme les cookies). Une approche plus sécurisée consiste à utiliser des sessions côté serveur pour gérer les rôles des utilisateurs.

### Exemple de Correction

Voici comment vous pouvez modifier l'application pour éviter cette faille :

```python
from flask import Flask, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'votre_cle_secrete'

@app.route('/')
def index():
    user_role = session.get('role', 'guest')
    if user_role == 'admin':
        return 'Tu es admin, tu peux t\'abonner à mon tiktok Tyki6'
    elif user_role == 'user':
        return 'Bonjour, tu es connecté en tant que user, essaye d\'être admin'
    else:
        return 'essaye de te connecter'

@app.route('/login')
def login():
    session['role'] = 'user'
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('role', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
```

Dans cette version, les rôles sont stockés dans la session, ce qui empêche leur manipulation par le client.