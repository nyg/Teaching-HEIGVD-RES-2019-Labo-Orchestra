#!/usr/bin/env sh

if [ "$1" = "auditor" ] ; then
    docker run --rm -d -p 2205:2205 res/"$1"
else
    docker run --rm -d res/"$1" $2
fi
