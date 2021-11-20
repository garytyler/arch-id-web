#!/usr/bin/env bash

set -e

THIS_DIR="$(dirname "$(readlink -e "$0")")"
LOCAL_REPO_DIR="$(dirname "${THIS_DIR}")"
REMOTE_REPO_DIR="~/repos/arch-id-web/"

cd "${LOCAL_REPO_DIR}"
msg "Changed to dir ${PWD}"

# Create dest directory
ssh -t ${EC2_USER}@${EC2_HOST} "mkdir -p ${REMOTE_REPO_DIR}"

# Make a list of all files not ignored by .gitignore
UNIGNORED_FILE_LIST=/tmp/arch-id-unignored-file-list
(git status --short | grep '^?' | cut -d\  -f2- && git ls-files) | sort -u >"${UNIGNORED_FILE_LIST}"

# Sync non-gitignored files with remote repo
rsync -av --progress \
    --files-from="${UNIGNORED_FILE_LIST}" \
    "${LOCAL_REPO_DIR}" \
    "${EC2_USER}@${EC2_HOST}:${REMOTE_REPO_DIR}"

# Build and start services
ssh ${EC2_USER}@${EC2_HOST} " \
    export FRONTEND_AWS_ACCESS_KEY_ID=${FRONTEND_AWS_ACCESS_KEY_ID} && \
    export FRONTEND_AWS_SECRET_ACCESS_KEY=${FRONTEND_AWS_SECRET_ACCESS_KEY} && \
    export FRONTEND_AWS_DEFAULT_REGION=${FRONTEND_AWS_DEFAULT_REGION} && \
    export FRONTEND_S3_BUCKET_NAME=${FRONTEND_S3_BUCKET_NAME} && \
    export MODELS_AWS_ACCESS_KEY_ID=${MODELS_AWS_ACCESS_KEY_ID} && \
    export MODELS_AWS_SECRET_ACCESS_KEY=${MODELS_AWS_SECRET_ACCESS_KEY} && \
    export MODELS_AWS_LOG_LEVEL=${MODELS_AWS_LOG_LEVEL} && \
    export MODELS_AWS_REGION=${MODELS_AWS_REGION} && \
    export MODELS_S3_ENDPOINT=${MODELS_S3_ENDPOINT} && \
    cd ${REMOTE_REPO_DIR} && \
    docker compose -f docker-compose.yml -f docker-compose.prod.yml down && \
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d && \
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
