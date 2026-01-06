#!/bin/bash

# Process a single package.json file
FILE="$1"

if [ ! -f "$FILE" ]; then
  echo "Error: File $FILE does not exist"
  exit 1
fi

node scripts/codemod.js "$FILE"
