import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";
import { normalizePublicCode } from "./publicPackageNames";

const generatedLlmsFileNames = new Set(["llms.txt", "llms-full.txt"]);
const frontmatterUrlRegex = /^---\n(?:[\s\S]*?\n)?url:/u;

export interface DuplojsLlmsPluginOptions {
	root: string;
	outDir: string;
}

export function duplojsLlmsPlugin(options: DuplojsLlmsPluginOptions): Plugin {
	const outDir = resolve(options.root, options.outDir);

	return {
		name: "duplojs-llms-public-code",
		enforce: "post",
		writeBundle() {
			for (const filePath of getGeneratedMarkdownFiles(outDir)) {
				const source = readFileSync(filePath, "utf-8");
				const normalized = normalizePublicCode(source);

				if (normalized !== source) {
					writeFileSync(filePath, normalized);
				}
			}
		},
	};
}

function getGeneratedMarkdownFiles(directoryPath: string): string[] {
	return readdirSync(directoryPath, { withFileTypes: true })
		.flatMap((dirent) => {
			const currentPath = join(directoryPath, dirent.name);

			if (dirent.isDirectory()) {
				return getGeneratedMarkdownFiles(currentPath);
			}

			if (!dirent.isFile() || !isGeneratedLlmsFile(currentPath, dirent.name)) {
				return [];
			}

			return [currentPath];
		});
}

function isGeneratedLlmsFile(filePath: string, fileName: string): boolean {
	if (generatedLlmsFileNames.has(fileName)) {
		return true;
	}

	if (!fileName.endsWith(".md")) {
		return false;
	}

	return frontmatterUrlRegex.test(readFileSync(filePath, "utf-8"));
}
