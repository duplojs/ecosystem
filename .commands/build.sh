#!/bin/bash

set -euo pipefail

pnpm --filter @duplojs/code-config build
pnpm --filter @duplojs/lang build