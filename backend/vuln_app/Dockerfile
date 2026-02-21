FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY vuln_app.py default.txt ./
COPY secret.txt /secret.txt
CMD ["python", "vuln_app.py"]
