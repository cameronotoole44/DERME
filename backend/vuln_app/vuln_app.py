from flask import Flask, request, jsonify, g
import html
import sqlite3
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
mitigated = False

# thread-local database connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(':memory:')
        cursor = g.db.cursor()
        cursor.execute('''CREATE TABLE users (username TEXT, password TEXT)''')
        cursor.execute("INSERT INTO users VALUES ('admin', 'password123')")
        cursor.execute("INSERT INTO users VALUES ('user', 'pass')")
        g.db.commit()
    return g.db

# close the connection at the end of the request
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