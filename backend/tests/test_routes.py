from pathlib import Path

import httpx
import pytest


@pytest.mark.asyncio
async def test_post_metadata(client, model_name: str):
    resp = client.post(f"/api/metadata/{model_name}")
    assert resp.status_code == 200
    assert resp.json().get("model_spec")


@pytest.mark.asyncio
async def test_post_predict(app, sample_image_path: Path, model_name: str):
    with open(sample_image_path, "rb") as f:
        async with httpx.AsyncClient(app=app, base_url="http://test") as ac:
            resp = await ac.post(
                f"/api/predict/{model_name}",
                files={"files": f},
            )
            data = resp.json()
        assert resp.status_code == 200
        assert len(data) == 25
        for i in data:
            assert 0.0 < i["probability"] < 1.0
