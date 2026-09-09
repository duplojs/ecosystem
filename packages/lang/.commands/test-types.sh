#!/usr/bin/env bash

set -euo pipefail

tsc -p tsconfig.config.json
tsc -p tsconfig.test.json
tsc -p tsconfig.lib.json