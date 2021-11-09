import logging
from pathlib import Path
from typing import Callable, Tuple

import tensorflow as tf

CLASS_NAMES = [
    "Achaemenid",
    "American Foursquare",
    "American craftsman style",
    "Ancient Egyptian",
    "Art Deco",
    "Art Nouveau",
    "Baroque",
    "Bauhaus",
    "Beaux-Arts",
    "Byzantine",
    "Chicago school",
    "Colonial",
    "Deconstructivism",
    "Edwardian",
    "Georgian",
    "Gothic",
    "Greek Revival",
    "International style",
    "Novelty",
    "Palladian",
    "Postmodern",
    "Queen Anne",
    "Romanesque",
    "Russian Revival",
    "Tudor Revival",
]


class BaseCNN:
    def __init__(self, name: str, base_model: tf.keras.Model, preprocess: Callable):
        self.name = name
        self.base_model = base_model
        self.preprocess = preprocess


BASE_CNNS = {
    tf.keras.applications.VGG19.__name__: BaseCNN(
        name=tf.keras.applications.VGG19.__name__,
        preprocess=tf.keras.applications.vgg19.preprocess_input,
        base_model=tf.keras.applications.VGG19,
    ),
    tf.keras.applications.ResNet50V2.__name__: BaseCNN(
        name=tf.keras.applications.ResNet50V2.__name__,
        preprocess=tf.keras.applications.resnet.preprocess_input,
        base_model=tf.keras.applications.ResNet50V2,
    ),
    tf.keras.applications.ResNet152V2.__name__: BaseCNN(
        name=tf.keras.applications.ResNet152V2.__name__,
        preprocess=tf.keras.applications.resnet.preprocess_input,
        base_model=tf.keras.applications.ResNet152V2,
    ),
    tf.keras.applications.InceptionV3.__name__: BaseCNN(
        name=tf.keras.applications.InceptionV3.__name__,
        preprocess=tf.keras.applications.inception_v3.preprocess_input,
        base_model=tf.keras.applications.InceptionV3,
    ),
    tf.keras.applications.InceptionResNetV2.__name__: BaseCNN(
        name=tf.keras.applications.InceptionResNetV2.__name__,
        preprocess=tf.keras.applications.inception_resnet_v2.preprocess_input,
        base_model=tf.keras.applications.InceptionResNetV2,
    ),
    tf.keras.applications.MobileNetV2.__name__: BaseCNN(
        name=tf.keras.applications.MobileNetV2.__name__,
        preprocess=tf.keras.applications.mobilenet_v2.preprocess_input,
        base_model=tf.keras.applications.MobileNetV2,
    ),
    tf.keras.applications.DenseNet201.__name__: BaseCNN(
        name=tf.keras.applications.DenseNet201.__name__,
        preprocess=tf.keras.applications.densenet.preprocess_input,
        base_model=tf.keras.applications.DenseNet201,
    ),
    tf.keras.applications.EfficientNetB7.__name__: BaseCNN(
        name=tf.keras.applications.EfficientNetB7.__name__,
        preprocess=tf.keras.applications.efficientnet.preprocess_input,
        base_model=tf.keras.applications.EfficientNetB7,
    ),
}
