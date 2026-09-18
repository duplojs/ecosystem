#!/usr/bin/env bash

set -euo pipefail

echo "Config :"
tsc -p tsconfig.config.json
echo "Everything is OK."

echo "Test :"
tsc -p tests/_utils/tsconfig.json

# core
tsc -p tests/core/tsconfig.json
tsc -p integrations/core/tsconfig.json
# client
tsc -p tests/client/tsconfig.json
tsc -p integrations/client/tsconfig.json 
# interfaces
tsc -p tests/interfaces/node/tsconfig.json
tsc -p integrations/node/tsconfig.json

tsc -p tests/interfaces/bun/tsconfig.json

tsc -p tests/interfaces/deno/tsconfig.json
# plugins
tsc -p tests/plugins/codeGenerator/tsconfig.json
tsc -p integrations/codeGenerator/tsconfig.json 

tsc -p tests/plugins/openApiGenerator/tsconfig.json
tsc -p integrations/openApiGenerator/tsconfig.json 

tsc -p tests/plugins/cacheController/tsconfig.json
tsc -p integrations/cacheController/tsconfig.json

tsc -p tests/plugins/static/tsconfig.json
tsc -p integrations/static/tsconfig.json 

tsc -p tests/plugins/cors/tsconfig.json
tsc -p integrations/cors/tsconfig.json

tsc -p tests/plugins/cookie/tsconfig.json
tsc -p integrations/cookie/tsconfig.json

echo "Everything is OK."

echo "Lib :"

tsc -p tests/core/tsconfig.lib.json

tsc -p tests/client/tsconfig.lib.json

tsc -p tests/interfaces/node/tsconfig.lib.json
tsc -p tests/interfaces/bun/tsconfig.lib.json
tsc -p tests/interfaces/deno/tsconfig.lib.json

tsc -p tests/plugins/codeGenerator/tsconfig.lib.json
tsc -p tests/plugins/openApiGenerator/tsconfig.lib.json
tsc -p tests/plugins/cacheController/tsconfig.lib.json
tsc -p tests/plugins/static/tsconfig.lib.json
tsc -p tests/plugins/cors/tsconfig.lib.json
tsc -p tests/plugins/cookie/tsconfig.lib.json

echo "Everything is OK."