import json

import httpx
import numpy as np
import tensorflow as tf
from app.utils import image_path_to_array


def test_tf_serving(sample_image_path, settings):
    img_path = sample_image_path
    img_array = image_path_to_array(img_path)

    r = httpx.post(
        "http://models:8501/v1/models/InceptionResNetV2-imagenet:predict",
        headers={"content-type": "application/json"},
        data=json.dumps({"signature_name": "serving_default", "instances": img_array}),
        content=img_array,
    )
    predictions = r.json()["predictions"][0]
    scores = tf.nn.softmax(predictions)
    pred_y = settings.classes[np.argmax(scores)]
    true_y = img_path.parent.name
    # print(
    #     f"path: {img_path}"
    #     f"\npred: {pred_y}"
    #     f"\ntrue: {true_y}"
    #     f"\nconf: {100 * np.max(scores):.2f}%",
    #     *(
    #         f"\n\t{n:0>2}-{settings.classes[n]:.<25}{100 * i:.2f}%"
    #         for n, i in enumerate(scores)
    #     ),
    # )
