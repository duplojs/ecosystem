import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { Plugin } from "vite";

const markdownIncludeRegex = /<!--\s*@include:\s*(?<path>.*?)\s*-->/g;

export interface DuplojsMarkdownIncludePluginOptions {
	root: string;
}

export function duplojsMarkdownIncludePlugin(options: DuplojsMarkdownIncludePluginOptions): Plugin {
	return {
		name: "duplojs-markdown-include",
		enforce: "pre",
		transform(code: string, id: string) {
			const markdownPath = id.split("?")[0] ?? id;

			if (!markdownPath.endsWith(".md")) {
				return;
			}

			return code.replace(markdownIncludeRegex, (_match, rawPath: string) => {
				const includePath = rawPath.startsWith("@/")
					? join(options.root, rawPath.slice(2))
					: resolve(dirname(markdownPath), rawPath);

				return readFileSync(includePath, "utf-8").trimEnd();
			});
		},
	};
}
