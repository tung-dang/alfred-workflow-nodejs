#!/usr/bin/env bash

has_typescript_compiler() {
	command -v tsc >/dev/null 2>&1
}

if ! has_typescript_compiler; then
  echo "Cannot find typescript compiler in npm global!"
  exit 1
fi

rm -rf ./dist
tsc -p ./tsconfig.json
