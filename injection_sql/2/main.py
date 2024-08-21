from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import sqlite3
from pathlib import Path

# Configuration de l'application FastAPI
app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Connexion à la base de données SQLite
DATABASE = "ma_base_de_donnees.db"

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS utilisateurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT,
        mot_de_passe TEXT
    )
    ''')
    conn.commit()
    cursor.execute("INSERT INTO utilisateurs (login, mot_de_passe) VALUES ('admin', 'password')")
    conn.commit()
    conn.close()

# Initialisation de la base de données
if not Path(DATABASE).exists():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "query": "SELECT * FROM utilisateurs WHERE login = '{login}' AND mot_de_passe = '{mot_de_passe}'"})

@app.post("/login")
async def login(request: Request, login: str = Form(...), mot_de_passe: str = Form(...)):
    # Connexion à la base de données
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    query = f"SELECT * FROM utilisateurs WHERE login = '{login}' AND mot_de_passe = '{mot_de_passe}'"
    cursor.execute(query)
    result = cursor.fetchone()
    
    conn.close()
    
    if result:
        return templates.TemplateResponse("login.html", {"request": request, "message": "Connexion réussie!", "query": query})
    else:
        return templates.TemplateResponse("login.html", {"request": request, "message": "Nom d'utilisateur ou mot de passe incorrect.", "query": query})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
