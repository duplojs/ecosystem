#!/usr/bin/env bash

set -euo pipefail

GREEN='\033[32m'
RESET='\033[0m'

printf "\n${GREEN}oxlint${RESET}\n"
## duplojs-oxlint --quiet "$@"
echo "oxlint is disable"

printf "\n${GREEN}eslint${RESET}\n"
## duplojs-eslint --quiet "$@"
echo "eslint is disable"