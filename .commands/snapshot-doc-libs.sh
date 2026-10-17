#!/usr/bin/env bash

set -euo pipefail

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
  printf "Usage: %s <version>\n" "$0" >&2
  exit 1
fi

SNAPSHOT_ROOT="docs/libs/$VERSION"

if [ ! -d "$SNAPSHOT_ROOT" ]; then
  printf "Snapshot directory not found: %s\n" "$SNAPSHOT_ROOT" >&2
  exit 1
fi

pnpm build

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/duplojs-doc-libs.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

for SNAPSHOT_PACKAGE in "$SNAPSHOT_ROOT"/*; do
  [ -d "$SNAPSHOT_PACKAGE" ] || continue

  PACKAGE_NAME="$(basename "$SNAPSHOT_PACKAGE")"
  SOURCE_PACKAGE="packages/$PACKAGE_NAME"
  SOURCE_DIST="$SOURCE_PACKAGE/dist"
  TARGET_DIST="$TMP_DIR/$PACKAGE_NAME/dist"

  if [ ! -f "$SNAPSHOT_PACKAGE/package.json" ]; then
    printf "Snapshot package.json not found: %s/package.json\n" "$SNAPSHOT_PACKAGE" >&2
    exit 1
  fi

  if [ ! -d "$SOURCE_PACKAGE" ]; then
    printf "Source package not found: %s\n" "$SOURCE_PACKAGE" >&2
    exit 1
  fi

  if [ ! -d "$SOURCE_DIST" ]; then
    printf "Source dist not found: %s\n" "$SOURCE_DIST" >&2
    exit 1
  fi

  mkdir -p "$TMP_DIR/$PACKAGE_NAME"
  cp -R "$SOURCE_DIST" "$TARGET_DIST"
  find "$TARGET_DIST" -type f ! \( -name "*.d.ts" -o -name "*.d.mts" -o -name "*.d.cts" -o -name "*.d.ts.map" -o -name "*.d.mts.map" -o -name "*.d.cts.map" \) -delete
  find "$TARGET_DIST" -type d -empty -delete

  if [ -z "$(find "$TARGET_DIST" -type f \( -name "*.d.ts" -o -name "*.d.mts" -o -name "*.d.cts" \) -print -quit)" ]; then
    printf "No declaration files copied for package: %s\n" "$PACKAGE_NAME" >&2
    exit 1
  fi

  sed -n 's/^[[:space:]]*"types": "\([^"]*\)".*/\1/p' "$SNAPSHOT_PACKAGE/package.json" | sort -u | while read -r TYPES_FILE; do
    if [ ! -f "$TMP_DIR/$PACKAGE_NAME/$TYPES_FILE" ]; then
      printf "Missing declaration referenced by package.json: %s/%s\n" "$SNAPSHOT_PACKAGE" "$TYPES_FILE" >&2
      exit 1
    fi
  done

  find "$TARGET_DIST" -type f \( -name "*.d.ts" -o -name "*.d.mts" -o -name "*.d.cts" \) | while read -r DECLARATION_FILE; do
    perl -0pi -e "s#(['\"])\\@duplojs/(code-config|eslint|form|http|json-web-token|lang|playwright|server|tools)(?=['\"/])#\${1}\\@duplojs-$VERSION/\${2}#g" "$DECLARATION_FILE"
  done

  rm -rf "$SNAPSHOT_PACKAGE/dist"
  mv "$TARGET_DIST" "$SNAPSHOT_PACKAGE/dist"
done
