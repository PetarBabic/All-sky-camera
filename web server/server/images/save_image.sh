#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <image>"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "Error: '$1' is not a file."
    exit 1
fi

modify_date=$(exiftool -s3 -ModifyDate "$1")

date_folder=$(echo "$modify_date" | cut -d' ' -f1 | tr : -)
time_created=$(echo "$modify_date" | cut -d' ' -f2)

filename=$(basename "$1")

mkdir -p "images/$date_folder/full"
mkdir -p "images/$date_folder/medium"
mkdir -p "images/$date_folder/thumbnail"

magick "$1" -resize 100x -quality 50 \
    "images/$date_folder/thumbnail/$filename"

magick "$1" -resize 1000x -quality 50 \
    "images/$date_folder/medium/$filename"

mv "$1" "images/$date_folder/full/"

sqlite3 pictures.db "
INSERT INTO images (
    date,
    time,
    filepath_full,
    filepath_medium,
    filepath_thumbnail
) VALUES (
    '$date_folder',
    '$time_created',
    'images/$date_folder/full/$filename',
    'images/$date_folder/medium/$filename',
    'images/$date_folder/thumbnail/$filename'
);"