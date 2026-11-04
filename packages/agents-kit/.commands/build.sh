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
pnpm run llms generate-summary --input docs/API/10-lang/10-number --output docs/API/10-lang/10-number/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-object --output docs/API/10-lang/10-object/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-printer --output docs/API/10-lang/10-printer/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-string --output docs/API/10-lang/10-string/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/40-json-web-token/10-tokenHandler --output docs/API/40-json-web-token/10-tokenHandler/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/40-json-web-token/20-signer --output docs/API/40-json-web-token/20-signer/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/40-json-web-token/30-cipher --output docs/API/40-json-web-token/30-cipher/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/40-json-web-token/40-utils --output docs/API/40-json-web-token/40-utils/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/50-form/10-vue/10-construction --output docs/API/50-form/10-vue/10-construction/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/50-form/10-vue/20-layouts --output docs/API/50-form/10-vue/20-layouts/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/50-form/10-vue/30-designSystem --output docs/API/50-form/10-vue/30-designSystem/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/60-playwright/10-construction --output docs/API/60-playwright/10-construction/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/60-playwright/20-actions --output docs/API/60-playwright/20-actions/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/60-playwright/30-assertions --output docs/API/60-playwright/30-assertions/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-table-of-content --input docs/API --output docs/API.llms.md
