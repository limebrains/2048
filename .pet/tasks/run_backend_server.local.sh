#!/bin/sh

cd backend
. env/bin/activate
python src/manage.py runserver
