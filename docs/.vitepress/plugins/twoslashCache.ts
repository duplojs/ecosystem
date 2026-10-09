
import { createHash, type Hash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";
import type { TwoslashTypesCache } from "@shikijs/twoslash";
import { removeTsExpectErrorDirectives } from "./publicPackageNames";

export interface CreateTwoslashCacheOptions {
	root: string;
	cacheDir: string;
}

const exampleExtensions = [".ts", ".tsx", ".vue"];
const libsExtensions = [".d.ts", ".json"];

export function createTwoslashCache({
	root,
	cacheDir,
}: CreateTwoslashCacheOptions): TwoslashTypesCache {
	const cache = createFileSystemTypesCache({
		dir: cacheDir,
	});

	const projectRoot = resolve(root);
	const stamp = createCacheStamp(projectRoot);

	function getCacheKey(code: string): string {
		return `${stamp}\n${code}`;
	}

	return {
		...cache,

		preprocess(code) {
			return removeTsExpectErrorDirectives(code);
		},

		read(code) {
			const result = cache.read(getCacheKey(code));

			if (result === undefined && process.env.CI) {
				throw new Error(
					"Twoslash: missing precomputed cache. Generate and commit the cache locally before deploying.",
				);
			}

			return result;
		},

		write(code, data) {
			cache.write(getCacheKey(code), data);
		},
	};
}

function createCacheStamp(root: string): string {
	const hash = createHash("sha256");

	hashDirectory(
		hash,
		root,
		join(root, "examples"),
		exampleExtensions,
	);

	hashDirectory(
		hash,
		root,
		join(root, "libs"),
		libsExtensions,
	);

	return hash.digest("hex");
}

function hashDirectory(
	hash: Hash,
	root: string,
	directory: string,
	extensions: string[],
): void {
	if (!existsSync(directory)) {
		throw new Error(
			`Twoslash: missing directory "${directory}".`,
		);
	}

	const entries = readdirSync(directory, {
		withFileTypes: true,
	}).sort(
		(first, second) => {
			if (first.name < second.name) {
				return -1;
			}
			if (first.name > second.name) {
				return 1;
			}
			return 0;
		},
	);

	for (const entry of entries) {
		const path = join(directory, entry.name);

		if (entry.isDirectory()) {
			hashDirectory(hash, root, path, extensions);
			continue;
		}

		if (
			entry.isFile()
			&& extensions.some((extension) => entry.name.endsWith(extension))
		) {
			hashFile(hash, root, path);
		}
	}
}

function hashFile(
	hash: Hash,
	root: string,
	path: string,
): void {
	const name = relative(root, path).replaceAll("\\", "/");
	const content = readFileSync(path);

	hash.update(name);
	hash.update("\0");
	hash.update(content);
	hash.update("\0");
}
