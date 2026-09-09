#!/bin/bash

set -euo pipefail

rolldown --config $@
pnpm pack --out integrations/package.tgz
pnpm install