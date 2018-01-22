#!/bin/bash

echo "Removing node_modules..."
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
