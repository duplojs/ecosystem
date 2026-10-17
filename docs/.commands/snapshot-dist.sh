#!/usr/bin/env bash

set -euo pipefail

exec tsx ./bin/snapshotDist/index.ts \
  --inputPattern '**/dist/' \
  --output ./libs/v1 \
  --rootDir ../packages
