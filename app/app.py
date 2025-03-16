from flask import Flask, request
import sqlite3
import logging

app = Flask(__name__)

# logging setup
logging.basicConfig(filename='exploit.log', level=logging.INFO,
                    format='%(asctime)s - %(message)s')

# only need the login route
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    # log the attempt
    logging.info(f"Attempt: username={username}, password={password}")
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # vulnerablilty = SQL injection
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    try:
        cursor.execute(query)
        result = cursor.fetchone()
    except sqlite3.Error as e:
        logging.error(f"SQL error: {e}")
        result = None
    conn.close()
    
    if result:
        logging.info(f"login success - returned: {result}")
        return "successful login!", 200
    else:
        logging.info(f"login failed - no result")
        return "failed to login", 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)   