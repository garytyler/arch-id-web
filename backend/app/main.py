from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from .routes import api_router
from .settings import get_settings


def get_app():
    app = FastAPI()
    app.include_router(api_router)
    app.add_middleware(
        TrustedHostMiddleware, allowed_hosts=get_settings().ALLOWED_HOSTS
    ),
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


app = get_app()
