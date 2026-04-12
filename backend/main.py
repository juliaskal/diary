from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import posts, folders


app = FastAPI()

app.include_router(posts)
app.include_router(folders)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
