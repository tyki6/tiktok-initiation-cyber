from flask import Flask, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Page d'accueil
@app.route('/')
def home():
    if session.get("username", "") == "admin":
        return "Vous êtes admin, pensez à vous abonner à mon tiktok Tyki6"
    if session.get("username", "") == "":
        session['username'] = "test"
    return "Vous n'êtes pas admin"

if __name__ == '__main__':
    app.run(debug=True)
