#!/usr/bin/env bash

set -euo pipefail

tsc -p tsconfig.app.json
tsc -p tsconfig.config.json
