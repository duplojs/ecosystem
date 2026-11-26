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
pnpm run llms generate-summary --input docs/API/10-lang/10-invocation --output docs/API/10-lang/10-invocation/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-modeling --output docs/API/10-lang/10-modeling/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-number --output docs/API/10-lang/10-number/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-object --output docs/API/10-lang/10-object/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-path --output docs/API/10-lang/10-path/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-pattern --output docs/API/10-lang/10-pattern/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-printer --output docs/API/10-lang/10-printer/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-string --output docs/API/10-lang/10-string/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/10-lang/10-tuple --output docs/API/10-lang/10-tuple/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/20-server/10-file --output docs/API/20-server/10-file/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/20-server/20-common --output docs/API/20-server/20-common/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/20-server/30-dataStructure --output docs/API/20-server/30-dataStructure/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/20-server/40-command --output docs/API/20-server/40-command/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/20-server/50-path --output docs/API/20-server/50-path/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/30-http/10-hub --output docs/API/30-http/10-hub/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/20-route/10-builder --output docs/API/30-http/20-route/10-builder/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/20-route/20-steps --output docs/API/30-http/20-route/20-steps/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/20-route/30-body --output docs/API/30-http/20-route/30-body/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/30-checker --output docs/API/30-http/30-checker/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/40-process --output docs/API/30-http/40-process/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/50-preflight --output docs/API/30-http/50-preflight/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/60-hooks --output docs/API/30-http/60-hooks/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/10-construction --output docs/API/30-http/70-client/10-construction/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/20-request --output docs/API/30-http/70-client/20-request/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/30-response --output docs/API/30-http/70-client/30-response/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/40-hooks --output docs/API/30-http/70-client/40-hooks/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/50-streaming --output docs/API/30-http/70-client/50-streaming/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/70-client/60-cache --output docs/API/30-http/70-client/60-cache/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/80-connectors/10-node --output docs/API/30-http/80-connectors/10-node/index.llms.md --ignore '*.llms.md'

pnpm run llms generate-summary --input docs/API/30-http/90-plugins/10-code-generator --output docs/API/30-http/90-plugins/10-code-generator/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/20-cors --output docs/API/30-http/90-plugins/20-cors/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/30-cookie --output docs/API/30-http/90-plugins/30-cookie/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/40-open-api --output docs/API/30-http/90-plugins/40-open-api/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/50-static --output docs/API/30-http/90-plugins/50-static/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/60-cache-controller --output docs/API/30-http/90-plugins/60-cache-controller/index.llms.md --ignore '*.llms.md'
pnpm run llms generate-summary --input docs/API/30-http/90-plugins/70-create-plugin --output docs/API/30-http/90-plugins/70-create-plugin/index.llms.md --ignore '*.llms.md'

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
