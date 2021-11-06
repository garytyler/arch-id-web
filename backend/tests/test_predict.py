from pathlib import Path

import tensorflow as tf

IMG_HEIGHT = 299
IMG_WIDTH = 299


def test_predict():
    path = Path(__file__).parent / "assets" / "sample.jpg"
    img = tf.keras.preprocessing.image.load_img(path, target_size=(299, 299))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    print(img_array)
