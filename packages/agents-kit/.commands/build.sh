#!/usr/bin/env bash

set -euo pipefail

rolldown --config "$@"

chmod +x dist/bin/*.mjs

pnpm run generate:llms --input docs/concepts --output docs/concepts.llms.md
