from pathlib import Path

import tensorflow as tf

IMG_HEIGHT = 299
IMG_WIDTH = 299

import httpx


def test_predict():
    path = Path(__file__).parent / "assets" / "sample.jpg"
    img = tf.keras.preprocessing.image.load_img(
        path, target_size=(299, 299), interpolation="nearest"
    )
    print(dir(img))
    print(img.getpixel((10, 10)))
    # img_array = tf.keras.preprocessing.image.img_to_array(img)
    # print(len(img_array))
    # print(img_array[200][200])
    httpx.post(http://predict/)
