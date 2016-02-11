#!/bin/bash

echo 'Telechargement des dependances'

npm install

cd app/

bower install

echo 'Fin du telechargement'