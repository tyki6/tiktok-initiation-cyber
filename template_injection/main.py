from flask import Flask, request, render_template_string
import subprocess
app = Flask(__name__)

@app.route("/")
def home():
    command = request.args.get('c', "")
    if command == "":
        return "Ajoute le param c avec ta command par exemple http://localhost:5000/?c='test'"
    return render_template_string(request.args.get('c'))

if __name__ == "__main__":
    app.run()