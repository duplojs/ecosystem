#!/usr/bin/env bash

GREEN='\033[32m'
RESET='\033[0m'

set -euo pipefail

tsc -p tsconfig.config.json

printf "\n${GREEN}@duplojs/code-config${RESET}\n"
pnpm --filter @duplojs/code-config test:types

printf "\n${GREEN}@duplojs/lang${RESET}\n"
pnpm --filter @duplojs/lang test:types

printf "\n${GREEN}@duplojs/server${RESET}\n"
pnpm --filter @duplojs/server test:types

printf "\n${GREEN}@duplojs/tools${RESET}\n"
pnpm --filter @duplojs/tools test:types

printf "\n${GREEN}@duplojs/json-web-token${RESET}\n"
pnpm --filter @duplojs/json-web-token test:types

printf "\n${GREEN}@duplojs/playwright${RESET}\n"
pnpm --filter @duplojs/playwright test:types