import tensorflow as tf


def image_path_to_array(img_path):
    img_file = tf.keras.preprocessing.image.load_img(
        img_path, target_size=(299, 299), interpolation="nearest"
    )
    img_array = tf.keras.preprocessing.image.img_to_array(img_file)
    img_array /= 127.5
    img_array -= 1.0
    img_array = tf.expand_dims(img_array, axis=0).numpy().tolist()
    return img_array
