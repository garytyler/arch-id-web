from io import BytesIO
from typing import Dict, List, Tuple

import aiohttp
import tensorflow as tf
from fastapi import APIRouter, Depends, File
from PIL import Image

from .dependencies import get_base_cnn, get_input_shape, get_metadata
from .models import BaseModelOut
from .settings import BaseCNN, get_settings

api_router = APIRouter(prefix="/api")


class PredictItemOut(BaseModelOut):
    prediction: float
    probability: float
    name: str
    display_name: str
    wikipedia_url: str


@api_router.post("/metadata/{model_name}", response_model=Dict[str, dict])
async def metadata(
    metadata: dict = Depends(get_metadata),
):
    return metadata


@api_router.post("/predict/{model_name}", response_model=List[PredictItemOut])
async def predict(
    model_name: str,
    base_cnn: BaseCNN = Depends(get_base_cnn),
    files: List[bytes] = File(...),
    input_shape: Tuple[int, int, int, int] = Depends(get_input_shape),
):
    img = Image.open(BytesIO(files[0]))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.image.resize(img_array, input_shape[1:3])
    img_array = base_cnn.preprocess(img_array)
    img_array = tf.expand_dims(img_array, axis=0).numpy().tolist()

    url = f"{get_settings().MODELS_SERVER_URL}/v1/models/{model_name}:predict"
    payload = {"signature_name": "serving_default", "instances": img_array}
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as resp:
            resp_data = await resp.json()

    predictions = resp_data["predictions"][0]
    probabilities: List[float] = tf.nn.softmax(predictions).numpy().tolist()

    results: List[dict] = []
    for n in range(len(get_settings().classes)):
        results.append(
            {
                **get_settings().classes[n],
                "prediction": predictions[n],
                "probability": probabilities[n],
            }
        )

    return results
