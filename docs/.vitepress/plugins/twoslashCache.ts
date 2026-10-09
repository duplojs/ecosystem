import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";
import type { TwoslashTypesCache } from "@shikijs/twoslash";
import Typescript from "typescript";
import { removeTsExpectErrorDirectives } from "./publicPackageNames";

export interface CreateTwoslashCacheOptions {
	root: string;
	version: string;
	tsconfig: string;
	cacheDir: string;
}

export function createTwoslashCache(options: CreateTwoslashCacheOptions): TwoslashTypesCache {
	const cache = createFileSystemTypesCache({ dir: options.cacheDir });
	const cachePrefix = `// @duplojs-doc-cache: ${createTwoslashCacheStamp(options)}\n`;

	return {
		...cache,
		preprocess(code) {
			return removeTsExpectErrorDirectives(code);
		},
		read(code) {
			return cache.read(`${cachePrefix}${code}`);
		},
		write(code, data) {
			cache.write(`${cachePrefix}${code}`, data);
		},
	};
}

function createTwoslashCacheStamp(options: CreateTwoslashCacheOptions): string {
	return createHash("SHA256")
		.update(Typescript.version)
		.update(readFileSync(join(options.root, options.tsconfig), "utf-8"))
		.update(hashDirectory(options.root, join(options.root, "examples", options.version), [".ts"]))
		.update(hashDirectory(options.root, join(options.root, "libs", options.version), [".d.ts", "package.json"]))
		.digest("hex")
		.slice(0, 12);
}

function hashDirectory(root: string, directoryPath: string, extensions: string[]): string {
	if (!existsSync(directoryPath)) {
		return "";
	}

	return readdirSync(directoryPath, { withFileTypes: true })
		.sort((left, right) => left.name.localeCompare(right.name))
		.map((dirent) => {
			const currentPath = join(directoryPath, dirent.name);

			if (dirent.isDirectory()) {
				return hashDirectory(root, currentPath, extensions);
			}

			if (!dirent.isFile() || !extensions.some((extension) => dirent.name.endsWith(extension))) {
				return "";
			}

			return `${relative(root, currentPath)}\n${readFileSync(currentPath, "utf-8")}`;
		})
		.join("\n");
}
