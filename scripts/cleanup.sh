#!/usr/bin/env bash

echo "Removing node_modules..."
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

echo "Removing dist..."
find . -name 'dist' -type d -prune -exec rm -rf '{}' +

echo "Removing exported-workflow..."
find . -name 'exported-workflow' -type d -prune -exec rm -rf '{}' +

