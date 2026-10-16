#!/usr/bin/env bash

set -euo pipefail

rolldown --config "$@"

chmod +x dist/bin/*.mjs

pnpm run generate:llms --input docs/concepts --output docs/concepts.llms.md
pnpm run generate:llms --input docs/API --output docs/API.llms.md
pnpm run generate:llms --input docs/API/10-lang --output docs/API/lang.llms.md
