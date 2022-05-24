#!/bin/bash

cd /wae
echo building environment and running server...
pipenv install &> /dev/null
pipenv run python3 launch.py