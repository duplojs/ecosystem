#!/usr/bin/env bash

set -euo pipefail

vue-tsc -p tsconfig.app.json
vue-tsc -p tsconfig.config.json
