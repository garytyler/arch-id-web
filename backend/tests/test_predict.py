import json
from pathlib import Path

import httpx
import tensorflow as tf

IMG_HEIGHT = 299
IMG_WIDTH = 299


def test_predict():
    tf.config.run_functions_eagerly(False)
    path = Path(__file__).parent / "assets" / "sample.jpg"
    img = tf.keras.preprocessing.image.load_img(
        path, target_size=(299, 299), interpolation="nearest"
    )
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.keras.applications.inception_resnet_v2.preprocess_input(img_array)
    img_array = tf.expand_dims(img_array, axis=0)
    r = httpx.post(
        "http://models:8501/v1/models/InceptionResNet:predict",
        headers={"content-type": "application/json"},
        data=json.dumps(
            {
                "signature_name": "serving_default",
                # "instances": img_array.numpy().tolist(),
                "instances": img_array.numpy().tolist(),
            }
        ),
        content=img_array,
    )
    print(r.json())
    n = 0
    for i in r.json()["predictions"][0]:
        if round(i, 2) == 1.0:
            print(n)
        n += 1
