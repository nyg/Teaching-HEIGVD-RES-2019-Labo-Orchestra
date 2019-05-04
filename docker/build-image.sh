#!/usr/bin/env sh

docker build -t res/"$1" -f image-"$1"/Dockerfile image-"$1"
