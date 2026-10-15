#!/usr/bin/env bash

set -euo pipefail

rolldown --config "$@"

chmod +x dist/bin/*.mjs

duplojs-agents-kit generate-llms --input docs/concepts --output docs/concepts.llms.md
