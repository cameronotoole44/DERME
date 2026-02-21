from flask import Flask, request, jsonify, g
import os
import html
import sqlite3
import logging
from urllib.parse import unquote

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

mitigations = {
    "xss": False,
    "sqli": False,
    "csrf": False,
    "lfi": False,
}


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(":memory:")
        cursor = g.db.cursor()
        cursor.execute("CREATE TABLE users (username TEXT, password TEXT, balance INT)")
        cursor.execute("INSERT INTO users VALUES ('admin', 'password123', 1000)")
        cursor.execute("INSERT INTO users VALUES ('user', 'pass', 500)")
        g.db.commit()
    return g.db


@app.teardown_appcontext
def close_db(error):
    if "db" in g:
        g.db.close()


@app.route("/login", methods=["GET"])
def login():
    username = request.args.get("username", "")
    if mitigations["xss"]:
        username = html.escape(username)
    return f"<h1>Welcome, {username}</h1>"


@app.route("/login_sql", methods=["POST"])
def login_sql():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")
    db = get_db()
    cursor = db.cursor()
    
    if mitigations["sqli"]:
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            (username, password),
        )
    else:
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        app.logger.debug(f"Executing: {query}")
        try:
            cursor.execute(query)
        except sqlite3.OperationalError as e:
            return jsonify({"status": "SQL error", "error": str(e)}), 400
    
    result = cursor.fetchall()
    if result:
        return jsonify({"status": "Login successful"})
    return jsonify({"status": "Login failed"}), 401


@app.route("/transfer", methods=["POST"])
def transfer():
    data = request.get_json()
    if data is None:
        return jsonify({"status": "Invalid JSON"}), 400
    
    if mitigations["csrf"]:
        token = data.get("csrf_token")
        if not token or token != "valid_token_123":
            return jsonify({"status": "CSRF token invalid"}), 403
    
    amount = data.get("amount", 0)
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET balance = balance - ? WHERE username = 'user'", (amount,))
    cursor.execute("UPDATE users SET balance = balance + ? WHERE username = 'admin'", (amount,))
    db.commit()
    return jsonify({"status": "Transfer successful", "amount": amount})


@app.route("/file", methods=["GET"])
def file_include():
    filename = request.args.get("file", "default.txt")
    filename = unquote(filename)
    
    if mitigations["lfi"]:
        safe_name = os.path.basename(filename)
        if safe_name not in ["default.txt"]:
            return jsonify({"status": "File not allowed", "error": "Access denied"}), 403
        file_path = os.path.join("/app", safe_name)
    else:
        file_path = os.path.normpath(os.path.join("/app", filename))
    
    app.logger.debug(f"Attempting to read: {file_path}")
    
    try:
        with open(file_path, "r") as f:
            content = f.read()
        return jsonify({"status": "File included", "content": content})
    except Exception as e:
        return jsonify({"status": "File error", "error": str(e)}), 400


@app.route("/mitigate/<vuln_type>", methods=["POST"])
def mitigate_single(vuln_type: str):
    if vuln_type not in mitigations:
        return jsonify({"status": "Unknown vulnerability type"}), 400
    mitigations[vuln_type] = True
    return jsonify({"status": f"{vuln_type} mitigation applied", "mitigations": mitigations})


@app.route("/mitigate", methods=["POST"])
def mitigate_all():
    for key in mitigations:
        mitigations[key] = True
    return jsonify({"status": "All mitigations applied", "mitigations": mitigations})


@app.route("/reset", methods=["POST"])
def reset():
    for key in mitigations:
        mitigations[key] = False
    return jsonify({"status": "Reset to vulnerable", "mitigations": mitigations})


@app.route("/status", methods=["GET"])
def status():
    return jsonify({"mitigations": mitigations})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
