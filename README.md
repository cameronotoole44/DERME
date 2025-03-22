# DERME 2.0 - Dynamic Exploit Replay and Mitigation Engine

## Overview

DERME is a web security demonstration tool showcasing four common vulnerabilities: XSS, SQLi, CSRF, and LFI with real-time exploit execution and mitigation. Built to educate and impress, it simulates attacks on a vulnerable Flask app running in a Docker container, controlled via a sleek React frontend..

### Features

- **Exploits**:
  - **XSS**: Injects `<script>alert('XSS')</script>` into a welcome message.
  - **SQLi**: Bypasses login with `admin' --`.
  - **CSRF**: Transfers funds between users without authorization.
  - **LFI**: Attempts to include `secret.txt`, mitigated to a safe file.
- **Mitigation**: Toggle sanitization/parameterization to block exploits.
- **Reset**: Restore vulnerable state for replay.

### Tech Stack

- **Frontend**: React, TypeScript, Vite, CSS
- **Backend**: Flask (Python), SQLite in-memory DB
- **Containerization**: Docker
- **Orchestration**: Custom Flask engine (`exploit_engine.py`)

## Demo

### XSS Exploit

![XSS Demo](gifs/xss.gif)

- Unmitigated: Script executes. Mitigated: Script is escaped.

### SQLi Exploit

![SQLi Demo](gifs/sqli.gif)

- Unmitigated: Login succeeds. Mitigated: Login fails.

### CSRF Exploit

![CSRF Demo](gifs/csrf.gif)

- Unmitigated: Funds transfer. Mitigated: Token required.

### LFI Exploit

![LFI Demo](gifs/lfi.gif)

- Unmitigated: File error. Mitigated: Safe file returned.

## Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/yourusername/derme.git
   cd derme
   ```
2. **Backend**:
   ```bash
   cd backend/vuln_app
   docker build -t vuln-app .
   cd ../exploit_engine
   python exploit_engine.py
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open http://localhost:5173 and start the exploits!
