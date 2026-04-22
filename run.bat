cd /d %~dp0

start cmd /k "call venv\Scripts\activate.bat && cd backend && py -m uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"
