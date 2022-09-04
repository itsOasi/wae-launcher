#!/bin/bash

echo updating apt...
apt update &> /dev/null
echo installing pipenv...
pip install pipenv &> /dev/null
echo installing git...  
echo "Y" | apt install git &> /dev/null
echo cloning WAE repo
git clone dev https://github.com/itsOasi/portfolio wae
