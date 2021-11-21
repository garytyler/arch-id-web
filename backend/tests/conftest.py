from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def settings():
    from app.settings import Settings

    return Settings()


@pytest.fixture
def app():
    from app.main import app

    yield app


@pytest.fixture
def client(app):
    with TestClient(app) as client:
        yield client


@pytest.fixture
def sample_image_path():
    return Path(__file__).parent / "assets" / "sample.jpg"


@pytest.fixture
def model_name():
    return "InceptionResNetV2-imagenet"
