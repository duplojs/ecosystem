#!/usr/bin/env bash

set -euo pipefail

echo "Config :"
pnpm dlx --package=typescript@7.0.2 tsc -p tsconfig.config.json
echo "Everything is OK."

echo "Test :"
pnpm dlx --package=typescript@7.0.2 tsc -p tests/_utils/tsconfig.json

# core
pnpm dlx --package=typescript@7.0.2 tsc -p tests/core/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/core/tsconfig.json
# client
pnpm dlx --package=typescript@7.0.2 tsc -p tests/client/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/client/tsconfig.json 
# interfaces
pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/node/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/node/tsconfig.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/bun/tsconfig.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/deno/tsconfig.json
# plugins
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/codeGenerator/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/codeGenerator/tsconfig.json 

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/openApiGenerator/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/openApiGenerator/tsconfig.json 

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cacheController/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/cacheController/tsconfig.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/static/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/static/tsconfig.json 

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cors/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/cors/tsconfig.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cookie/tsconfig.json
pnpm dlx --package=typescript@7.0.2 tsc -p integrations/cookie/tsconfig.json

echo "Everything is OK."

echo "Lib :"

pnpm dlx --package=typescript@7.0.2 tsc -p tests/core/tsconfig.lib.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/client/tsconfig.lib.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/node/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/bun/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/interfaces/deno/tsconfig.lib.json

pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/codeGenerator/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/openApiGenerator/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cacheController/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/static/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cors/tsconfig.lib.json
pnpm dlx --package=typescript@7.0.2 tsc -p tests/plugins/cookie/tsconfig.lib.json

echo "Everything is OK."