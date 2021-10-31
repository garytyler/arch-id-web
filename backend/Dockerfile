FROM python:3.9-buster AS python

FROM python AS base-stage

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=${POETRY_VERSION}

ARG WORKDIR=/srv/backend

COPY ./pyproject.toml ./poetry.lock* $WORKDIR/

WORKDIR $WORKDIR

ENV PATH="/root/.local/bin:${PATH}"

RUN command python

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python3 - &&
    poetry config --no-interaction virtualenvs.create false

FROM base-stage AS prod-stage

RUN poetry install --no-interaction --no-root --no-dev

FROM prod-stage AS dev-stage

RUN poetry install --no-interaction --no-root
