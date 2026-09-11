#!/usr/bin/env bash

set -euo pipefail

TSX_TSCONFIG_PATH='tsconfig.config.json' \
duplojs-oxlint --quiet "$@"