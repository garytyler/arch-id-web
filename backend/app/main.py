from fastapi import APIRouter, FastAPI

api_router = APIRouter()


@api_router.get("/")
async def root():
    return {"message": "Hello World!"}


def get_app():
    app = FastAPI()
    app.include_router(api_router)
    return app





app = get_app()
