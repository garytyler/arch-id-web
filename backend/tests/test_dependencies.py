import pytest
from app.dependencies import get_input_shape, get_metadata


@pytest.mark.asyncio
async def test_get_metadata(model_name: str):
    metadata = await get_metadata(model_name)
    print(type(metadata))
    assert len(metadata) == 2
    assert metadata.get("model_spec")


@pytest.mark.asyncio
async def test_get_input_shape(model_name: str):
    input_shape = await get_input_shape(model_name)
    assert input_shape == (-1, 299, 299, 3)
