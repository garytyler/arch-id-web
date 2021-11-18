from humps import camelize, decamelize
from pydantic import BaseModel


class BaseModelIn(BaseModel):
    class Config:
        alias_generator = decamelize
        allow_population_by_field_name = True


class BaseModelOut(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True
