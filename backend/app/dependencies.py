import aiohttp

from .settings import get_settings


async def get_metadata(model_name: str):
    url = f"{get_settings().MODELS_SERVER_URL}/v1/models/{model_name}/metadata"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            resp_data = await resp.json()
    return resp_data


async def get_base_cnn(model_name: str):
    return get_settings().base_cnns[model_name.split("-")[0]]


async def get_input_shape(model_name):
    metadata = await get_metadata(model_name)
    dims = metadata
    for k in [
        "metadata",
        "signature_def",
        "signature_def",
        "serving_default",
        "inputs",
        "random_flip_2_input",
        "tensor_shape",
        "dim",
    ]:
        dims = dims[k]
    return tuple(int(d["size"]) for d in dims)
