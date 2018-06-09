#!/usr/bin/env bash

CONFIG_FILE="./nodemon.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Cannot find nodemon.json file at ${pwd}"
  exit 1
fi

has_nodemon() {
	command -v nodemon >/dev/null 2>&1
}

if ! has_nodemon; then
  echo "Cannot find nodemon in npm global!"
  exit 1
fi

nodemon --config $CONFIG_FILE --exec "yarn build"
