#!/usr/bin/env node

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

const packageJsonPath = require.resolve("@commitlint/cli/package.json");
const packageRoot = dirname(packageJsonPath);

await import(
	pathToFileURL(resolve(packageRoot, "cli.js")).href,
);
