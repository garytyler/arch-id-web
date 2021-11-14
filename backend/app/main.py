from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import api_router


def get_app():
    app = FastAPI()
    app.include_router(api_router)
    return CORSMiddleware(
        app,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app = get_app()
