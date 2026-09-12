#!/bin/bash

GREEN='\033[32m'
RESET='\033[0m'

set -euo pipefail

printf "\n${GREEN}@duplojs/code-config${RESET}\n"
pnpm --filter @duplojs/code-config build

printf "\n${GREEN}@duplojs/lang${RESET}\n"
pnpm --filter @duplojs/lang build

printf "\n${GREEN}@duplojs/server${RESET}\n"
pnpm --filter @duplojs/server build

printf "\n${GREEN}@duplojs/tools${RESET}\n"
pnpm --filter @duplojs/tools build

printf "\n${GREEN}@duplojs/json-web-token${RESET}\n"
pnpm --filter @duplojs/json-web-token build

printf "\n${GREEN}@duplojs/playwright${RESET}\n"
pnpm --filter @duplojs/playwright build
