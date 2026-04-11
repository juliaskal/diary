cd /d %~dp0

start cmd /k "cd backend && py -m uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"