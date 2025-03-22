from flask import Flask, request, jsonify, g
import os
import html
import sqlite3
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
mitigated = False

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(':memory:')
        cursor = g.db.cursor()
        cursor.execute('''CREATE TABLE users (username TEXT, password TEXT, balance INT)''')
        cursor.execute("INSERT INTO users VALUES ('admin', 'password123', 1000)")
        cursor.execute("INSERT INTO users VALUES ('user', 'pass', 500)")
        g.db.commit()
    return g.db

@app.teardown_appcontext
def close_db(error):
    if 'db' in g:
        g.db.close()

@app.route('/login', methods=['GET'])
def login():
    username = request.args.get('username', '')
    if mitigated:
        username = html.escape(username) # sanitize input
    return f"<h1>Welcome, {username}</h1>" # vulnerablity = XSS

@app.route('/login_sql', methods=['POST'])
def login_sql():
    app.logger.debug("Received request to /login_sql")
    data = request.get_json()
    app.logger.debug(f"Request data: {data}")
    username = data.get('username', '')
    password = data.get('password', '')
    db = get_db()
    cursor = db.cursor()
    if mitigated:
        app.logger.debug("Using mitigated query")
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    else:
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        app.logger.debug(f"Executing vulnerable query: {query}")
        try:
            cursor.execute(query)
        except sqlite3.OperationalError as e:
            app.logger.error(f"SQL error: {e}")
            return jsonify({"status": "SQL error", "error": str(e)}), 400
    result = cursor.fetchall()
    app.logger.debug(f"Query result: {result}")
    if result:
        return jsonify({"status": "Login successful"})
    else:
        return jsonify({"status": "Login failed"}), 401

@app.route('/transfer', methods=['POST'])
def transfer():
    app.logger.debug("Received request to /transfer")
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"status": "Invalid JSON", "error": "Request must be JSON"}), 400
        amount = data.get('amount', 0)
        db = get_db()
        cursor = db.cursor()
        if mitigated:
            if 'csrf_token' not in data:
                return jsonify({"status": "CSRF token missing"}), 403
        cursor.execute("UPDATE users SET balance = balance - ? WHERE username = 'user'", (amount,))
        cursor.execute("UPDATE users SET balance = balance + ? WHERE username = 'admin'", (amount,))
        db.commit()
        return jsonify({"status": "Transfer successful", "amount": amount})
    except Exception as e:
        app.logger.error(f"Transfer failed: {str(e)}")
        return jsonify({"status": "Transfer error", "error": str(e)}), 500

@app.route('/file', methods=['GET'])
def file_include():
    filename = request.args.get('file', 'default.txt')
    if mitigated:
        safe_path = '/app/default.txt'  # force default.txt when mitigated
    else:
        safe_path = os.path.join('/app', os.path.basename(filename))
    try:
        with open(safe_path, 'r') as f:
            content = f.read()
        return jsonify({"status": "File included", "content": content})
    except Exception as e:
        return jsonify({"status": "File error", "error": str(e)}), 400

@app.route('/mitigate', methods=['POST'])
def mitigate():
    global mitigated
    mitigated = True
    return jsonify({"status": "Mitigation applied"})

@app.route('/reset', methods=['POST'])
def reset():
    global mitigated
    mitigated = False
    return jsonify({"status": "Reset to vulnerable"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)