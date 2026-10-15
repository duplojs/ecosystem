#!/usr/bin/env node

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

const packageJsonPath = require.resolve("oxlint/package.json");
const packageRoot = dirname(packageJsonPath);
const cliPath = resolve(packageRoot, "dist/cli.js");

await import(pathToFileURL(cliPath).href);
