#!/usr/bin/env bash

set -euo pipefail

tsc -p tsconfig.config.json
pnpm --filter @duplojs/code-config test:types