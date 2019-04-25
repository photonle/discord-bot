#!/bin/bash
declare -r DIR="$(realpath $(dirname "${BASH_SOURCE[0]}"))"
declare -r INST="$( basename "$DIR" )"

docker stop "$INST"
docker rm "$INST"
docker build -t internet/"$INST" "$DIR"
docker run -d --name "$INST" --mount source=photonbot,target=/app --restart always internet/"$INST"
