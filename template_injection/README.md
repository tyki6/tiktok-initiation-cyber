# Template Injection (Injection de Template)

## Prérequis

### Environnement Python

- **Python 3.x** : [Télécharger Python](https://www.python.org/downloads/)
- **pip** : Vient avec Python pour gérer les paquets

### Installation des Dépendances

1. **Cloner ce dépôt** sur votre machine :

    ```bash
    git clone https://github.com/votre-utilisateur/repo-nom.git
    cd repo-nom
    ```

2. **Créer et activer un environnement virtuel** (optionnel, mais recommandé) :

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate
    ```

3. **Installer les dépendances** nécessaires :

    ```bash
    pip install Flask
    ```

## Démarrage du Projet

1. **Lancez le serveur** :

    ```bash
    python main.py
    ```

2. **Accédez à l'application** via votre navigateur à l'adresse suivante : `http://127.0.0.1:5000/`.

## Explication du Code

Le code de l'application Flask est très simple et se compose d'une route principale `/` qui utilise la fonction `render_template_string` pour rendre une chaîne de texte en tant que template Jinja2. Cependant, la chaîne de texte qui est rendue provient directement de l'utilisateur via le paramètre `c` de la requête.

### Route Vulnérable

Voici la route vulnérable :

```python
@app.route("/")
def home():
    return render_template_string(request.args.get('c'))
```

### Comprendre la Faille de Template Injection

#### Étape 1 : Introduction

La vulnérabilité de Template Injection (injection de template) se produit lorsque les données utilisateur sont directement injectées dans un template sans être correctement validées ou filtrées. Flask utilise Jinja2 comme moteur de template, et dans ce cas, l'application utilise la fonction `render_template_string` pour interpréter le contenu fourni par l'utilisateur comme un template.

#### Étape 2 : Exploitation

Puisque l'application interprète et exécute directement ce que l'utilisateur fournit dans le paramètre `c`, un attaquant peut injecter du code Jinja2 malveillant pour accéder à des données sensibles ou exécuter du code sur le serveur.

Par exemple, un attaquant pourrait envoyer une requête comme celle-ci pour accéder aux variables de l'environnement du serveur :

```bash
http://127.0.0.1:5000/?c={{ config.items() }}
```

Ou pour accéder aux fichiers sensibles du serveur (selon la configuration et les permissions) :

```bash
http://127.0.0.1:5000/?c={{ ''.__class__.__mro__[1].__subclasses__()[520]('cat flag.txt',shell=True,stdout=-1).communicate()[0].strip() }}
```
## Corriger la Faille

### Solution : Ne jamais faire confiance aux données utilisateur

Une manière simple de corriger cette faille est de ne pas permettre aux utilisateurs de passer des données directement à `render_template_string`. Si vous devez le faire, assurez-vous de valider ou de filtrer correctement les entrées utilisateur pour empêcher l'injection de code.

Par exemple, au lieu de permettre l'injection de n'importe quel texte, vous pouvez limiter les valeurs acceptées :

```python
@app.route("/")
def home():
    user_input = request.args.get('c')
    
    if not user_input or any(x in user_input for x in ['{{', '{%', '%}']):
        return "Input non autorisé", 400
    
    return render_template_string(user_input)
```

Vous pouvez également utiliser des techniques comme l'échappement de caractères spéciaux ou limiter les fonctionnalités de Jinja2 en créant un environnement plus restreint.