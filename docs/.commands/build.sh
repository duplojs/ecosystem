#!/bin/bash

set -euo pipefail

if [[ -z "${CI:-}" ]]; then
    rm -rf .vitepress/cache/twoslash
fi

vitepress build