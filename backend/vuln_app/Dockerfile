FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY vuln_app.py default.txt ./
CMD ["python", "vuln_app.py"]