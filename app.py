
import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

app = Flask(__name__)

print("APP ROOT:", app.root_path)
print("TEMPLATE FOLDER:", app.template_folder)
print("TEMPLATE PATH:", app.jinja_loader.searchpath)
print("HOME EXISTS:", os.path.exists(
    os.path.join(app.root_path, "templates", "home.html")
))

# ==================== NOXI PAGE ====================

@app.route("/noxi")
def noxi_page():
    return render_template("noxi.html")

    # ==================== NOXI LOGIN PAGE ====================

@app.route("/noxi-login")
def noxi_login():
    return render_template("noxi-login.html")

# ==================== GEMINI CONFIG ====================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini key loaded:", bool(GEMINI_API_KEY))

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-2.5-flash:generateContent"
    "?key=" + GEMINI_API_KEY
)

# ==================== NOTEX SEO HOMEPAGE ====================

@app.route("/")
def home():
    return render_template("home.html")


# ==================== NOTEX LOGIN ====================

@app.route("/login")
def notex_login():
    return render_template("notex-login.html")

# ==================== NOTEX APP ====================

@app.route("/notex")
def notex_app():
    return render_template("index.html")

@app.route("/sw.js")
def service_worker():
    return app.send_static_file("sw.js")

if __name__ == "__main__":
    app.run(debug=True)