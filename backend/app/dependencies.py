import httpx

from .settings import BASE_CNNS, BaseCNN


async def get_metadata(model_name):
    r = httpx.get(f"http://models:8501/v1/models/{model_name}/metadata")
    return r.json()


async def base_cnn(model_name):
    return BASE_CNNS[model_name.split("-")[0]]


async def input_shape(model_name):
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
