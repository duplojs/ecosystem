#!/bin/bash

set -euo pipefail

pnpm --filter @duplojs/code-config build
pnpm --filter @duplojs/lang build
pnpm --filter @duplojs/server build
pnpm --filter @duplojs/tools build