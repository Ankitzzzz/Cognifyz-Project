# Fullstack Forms Demo (frontend / backend)

This repository is split into two folders:
- frontend/ — static UI (index.html, main.js, styles.css)
- backend/ — Express API, Sequelize models, background worker

Quick start (local, SQLite, no Docker)
1. Copy .env.example to .env and edit at least JWT_SECRET:
   - On Windows PowerShell:
     copy .env.example .env

2. Start backend:
   cd backend
   npm install
   npm run dev
   (backend listens on http://localhost:3000)

3. Start frontend (separate terminal):
   cd frontend
   npm install
   npm start
   (frontend served at http://localhost:5000)

4. Open http://localhost:5000 and use the UI.
   - Register and log in to obtain a token stored in localStorage.
   - Create submissions — they will appear in Recent Submissions.
   - If Redis & worker are running, enrichment jobs will run and update submissions.

Full stack with Docker Compose (Redis + Postgres + worker)
1. Edit docker-compose.yml to set OPENWEATHER_API_KEY.
2. From repo root:
   docker compose up --build
3. Backend → http://localhost:3000, Frontend served separately (or run frontend locally).

