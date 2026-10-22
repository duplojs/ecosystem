#!/bin/bash

set -euo pipefail

rolldown --config $@

chmod +x dist/bin/*.mjs