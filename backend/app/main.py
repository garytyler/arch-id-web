import json
from io import BytesIO
from typing import List, Tuple

import httpx
import tensorflow as tf
from fastapi import APIRouter, Depends, FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from .dependencies import base_cnn, input_shape
from .settings import CLASS_NAMES, BaseCNN

api_router = APIRouter()


@api_router.get("/")
async def hello():
    return {"Hello": "World"}


@api_router.post("/predict/{model_name}")
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
        response = await client.post(
            f"http://models:8501/v1/models/{model_name}:predict",
            headers={"content-type": "application/json"},
            data=json.dumps(
                {"signature_name": "serving_default", "instances": img_array}
            ),
            content=img_array,
        )
    predictions = response.json()["predictions"][0]
    probabilities = tf.nn.softmax(predictions).numpy().tolist()
    return {"predictions": predictions, "probabilities": probabilities}
    # return {
    #     "predictions": {
    #         CLASS_NAMES[index]: prediction
    #         for index, prediction in enumerate(predictions)
    #     },
    #     "probabilities": {
    #         CLASS_NAMES[index]: probability
    #         for index, probability in enumerate(probabilities)
    #     },
    # }


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
