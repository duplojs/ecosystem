#!/usr/bin/env bash

set -euo pipefail

GREEN='\033[32m'
RESET='\033[0m'

printf "\n${GREEN}oxlint${RESET}\n"
duplojs-oxlint --quiet "$@"

printf "\n${GREEN}eslint${RESET}\n"
duplojs-eslint --quiet "$@"