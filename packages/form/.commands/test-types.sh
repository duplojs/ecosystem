#!/usr/bin/env bash

set -euo pipefail

vue-tsc -p tsconfig.config.json

# vue
vue-tsc -p tests/vue/tsconfig.json
vue-tsc -p integrations/vue/tsconfig.json
vue-tsc -p dev/vue/tsconfig.json
