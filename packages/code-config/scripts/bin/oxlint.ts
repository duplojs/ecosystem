#!/usr/bin/env node

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

const oxlintRoot = dirname(require.resolve("oxlint/package.json"));
const tsgolintRoot = dirname(require.resolve("oxlint-tsgolint/package.json"));

process.env.OXLINT_TSGOLINT_PATH = resolve(
	tsgolintRoot,
	"bin/tsgolint.js",
);

await import(pathToFileURL(resolve(oxlintRoot, "dist/cli.js")).href);
