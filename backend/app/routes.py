import json
from io import BytesIO
from typing import List, Tuple

import httpx
import tensorflow as tf
from fastapi import APIRouter, Depends, File
from PIL import Image

from .dependencies import base_cnn, input_shape
from .models import BaseModelOut
from .settings import CLASSES, BaseCNN

api_router = APIRouter(prefix="/api")


class PredictItemOut(BaseModelOut):
    prediction: float
    probability: float
    name: str
    display_name: str
    wikipedia_url: str


@api_router.post("/predict/{model_name}", response_model=List[PredictItemOut])
async def predict(
    model_name: str,
    base_cnn: BaseCNN = Depends(base_cnn),
    files: List[bytes] = File(...),
    input_shape: Tuple[int, int, int, int] = Depends(input_shape),
):
    img = Image.open(BytesIO(files[0]))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.image.resize(img_array, input_shape[1:3])
    img_array = base_cnn.preprocess(img_array)
    img_array = tf.expand_dims(img_array, axis=0).numpy().tolist()
    async with httpx.AsyncClient() as client:
        predict_response = await client.post(
            f"http://models:8501/v1/models/{model_name}:predict",
            headers={"content-type": "application/json"},
            data=json.dumps(
                {"signature_name": "serving_default", "instances": img_array}
            ),
        )
    predictions: List[float] = predict_response.json()["predictions"][0]
    probabilities: List[float] = tf.nn.softmax(predictions).numpy().tolist()

    results: List[dict] = []
    for n in range(len(CLASSES)):
        results.append(
            {
                **CLASSES[n],
                "prediction": predictions[n],
                "probability": probabilities[n],
            }
        )

    return results
