#!/usr/bin/env bash

set -euo pipefail

echo "Config :"
tsc -p tsconfig.config.json
echo "Everything is OK."

echo "Test :"
tsc -p tsconfig.test.json
echo "Everything is OK."

echo "Lib :"
tsc -p tsconfig.lib.json
echo "Everything is OK."