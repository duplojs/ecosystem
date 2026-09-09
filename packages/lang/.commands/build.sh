#!/bin/bash

set -euo pipefail

rolldown --config $@
pnpm pack --pack-destination ./integrations
pnpm -C integrations install