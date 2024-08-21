from flask import Flask, request, make_response, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    user_role = request.cookies.get('role', 'guest')
    if user_role == 'admin':
        return 'Tu es admin, tu peux t\'abonner à mon tiktok Tyki6'
    elif user_role == 'user':
        return 'Bonjour, tu es connecté en tant que user, essaye d\'être admin'
    else:
        return 'essaye de te connecter'

@app.route('/login')
def login():
    resp = make_response(redirect(url_for('index')))
    resp.set_cookie('role', "user")
    return resp

# Page de déconnexion
@app.route('/logout')
def logout():
    resp = make_response(redirect(url_for('index')))
    resp.set_cookie('role', '', expires=0)
    return resp

if __name__ == '__main__':
    app.run(debug=True)
