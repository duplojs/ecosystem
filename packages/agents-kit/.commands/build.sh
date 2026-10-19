#!/usr/bin/env bash

set -euo pipefail

rolldown --config "$@"

chmod +x dist/bin/*.mjs

pnpm run llms generate-summary --input docs/concepts --output docs/concepts.llms.md

pnpm run llms generate-summary --input docs/API/10-lang/10-array --output docs/API/10-lang/10-array/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-chrono --output docs/API/10-lang/10-chrono/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-common --output docs/API/10-lang/10-common/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-dataStructure --output docs/API/10-lang/10-dataStructure/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-either --output docs/API/10-lang/10-either/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-generator --output docs/API/10-lang/10-generator/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-table-of-content --input docs/API --output docs/API.llms.md
