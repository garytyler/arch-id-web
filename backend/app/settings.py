from functools import lru_cache
from typing import Dict, List

import pydantic
import tensorflow as tf

from .utils import BaseCNN


class _BaseSettings(pydantic.BaseSettings):
    class Config:
        case_sensitive = True
        env_prefix = "BACKEND_"


class Settings(_BaseSettings):
    PROJECT_TITLE: str
    ALLOWED_HOSTS: str
    CORS_ORIGINS: str
    MODELS_SERVER_URL: str


    classes: List[Dict[str, str]] = [
        {
            "name": "Achaemenid architecture",
            "display_name": "Achaemenid",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Achaemenid_architecture",
        },
        {
            "name": "American craftsman style",
            "display_name": "American Craftsman",
            "wikipedia_url": "https://en.wikipedia.org/wiki/American_Craftsman",
        },
        {
            "name": "American Foursquare architecture",
            "display_name": "American Foursquare",
            "wikipedia_url": "https://en.wikipedia.org/wiki/American_Foursquare",
        },
        {
            "name": "Ancient Egyptian architecture",
            "display_name": "Ancient Egyptian",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Ancient_Egyptian_architecture",
        },
        {
            "name": "Art Deco architecture",
            "display_name": "Art Deco",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Art_Deco",
        },
        {
            "name": "Art Nouveau architecture",
            "display_name": "Art Nouveau",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Art_Nouveau",
        },
        {
            "name": "Baroque architecture",
            "display_name": "Baroque",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Baroque_architecture",
        },
        {
            "name": "Bauhaus architecture",
            "display_name": "Bauhaus",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Bauhaus",
        },
        {
            "name": "Beaux-Arts architecture",
            "display_name": "Beaux-Arts",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Beaux-Arts_architecture",
        },
        {
            "name": "Byzantine architecture",
            "display_name": "Byzantine",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Byzantine_architecture",
        },
        {
            "name": "Chicago school architecture",
            "display_name": "Chicago school",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Chicago_school_(architecture)",
        },
        {
            "name": "Colonial architecture",
            "display_name": "Colonial",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Colonial_architecture",
        },
        {
            "name": "Deconstructivism",
            "display_name": "Deconstructivism",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Deconstructivism",
        },
        {
            "name": "Edwardian architecture",
            "display_name": "Edwardian",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Edwardian_architecture",
        },
        {
            "name": "Georgian architecture",
            "display_name": "Georgian",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Georgian_architecture",
        },
        {
            "name": "Gothic architecture",
            "display_name": "Gothic",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Gothic_architecture",
        },
        {
            "name": "Greek Revival architecture",
            "display_name": "Greek Revival",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Greek_Revival_architecture",
        },
        {
            "name": "International style",
            "display_name": "International Style",
            "wikipedia_url": "https://en.wikipedia.org/wiki/International_Style_(architecture)",
        },
        {
            "name": "Novelty architecture",
            "display_name": "Novelty",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Novelty_architecture",
        },
        {
            "name": "Palladian architecture",
            "display_name": "Palladian",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Palladian_architecture",
        },
        {
            "name": "Postmodern architecture",
            "display_name": "Postmodern",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Postmodern_architecture",
        },
        {
            "name": "Queen Anne architecture",
            "display_name": "Queen Anne",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Queen_Anne_style_architecture",
        },
        {
            "name": "Romanesque architecture",
            "display_name": "Romanesque",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Romanesque_architecture",
        },
        {
            "name": "Russian Revival architecture",
            "display_name": "Russian Revival",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Russian_Revival_architecture",
        },
        {
            "name": "Tudor Revival architecture",
            "display_name": "Tudor Revival",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Tudor_Revival_architecture",
        },
    ]

    base_cnns: Dict[str, BaseCNN] = {
        tf.keras.applications.InceptionResNetV2.__name__: BaseCNN(
            name=tf.keras.applications.InceptionResNetV2.__name__,
            preprocess=tf.keras.applications.inception_resnet_v2.preprocess_input,
            base_model=tf.keras.applications.InceptionResNetV2,
        ),
        tf.keras.applications.InceptionV3.__name__: BaseCNN(
            name=tf.keras.applications.InceptionV3.__name__,
            preprocess=tf.keras.applications.inception_v3.preprocess_input,
            base_model=tf.keras.applications.InceptionV3,
        ),
        tf.keras.applications.ResNet152V2.__name__: BaseCNN(
            name=tf.keras.applications.ResNet152V2.__name__,
            preprocess=tf.keras.applications.resnet.preprocess_input,
            base_model=tf.keras.applications.ResNet152V2,
        ),
        tf.keras.applications.VGG19.__name__: BaseCNN(
            name=tf.keras.applications.VGG19.__name__,
            preprocess=tf.keras.applications.vgg19.preprocess_input,
            base_model=tf.keras.applications.VGG19,
        ),
    }


@lru_cache()
def get_settings():
    settings = Settings()
    return settings
