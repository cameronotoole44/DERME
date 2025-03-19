from flask import Flask, request
import html

app = Flask(__name__)
mitigated = False

@app.route('/login', methods=['GET'])
def login():
    username = request.args.get('username', '')
    if mitigated:
        username = html.escape(username)  # sanitize input
    return f"<h1>Welcome, {username}</h1>"  # vulnerableity = XSS

@app.route('/mitigate', methods=['POST'])
def mitigate():
    global mitigated
    mitigated = True
    return {"status": "Mitigation applied"}

@app.route('/reset', methods=['POST'])
def reset():
    global mitigated
    mitigated = False
    return {"status": "Reset to vulnerable"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)