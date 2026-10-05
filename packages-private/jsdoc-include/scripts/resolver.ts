import { readFile } from "node:fs/promises";

export class RecursiveIncludeError extends Error {
	public constructor(
		public readonly path: string,
	) {
		super(`Recursive include detected file: "${path}"`);
		this.name = "RecursiveIncludeError";
	}
}

export class IncludeFileReadError extends Error {
	public constructor(
		public readonly path: string,
		public readonly error: unknown,
	) {
		super(`Failed to read included file: "${path}"`);
		this.name = "IncludeFileReadError";
	}
}

const includePattern = /^(?<indent>.*)\{@include (?<path>[^\]\s}]+)(?:\[(?<startLine>[0-9]+),(?<endLine>[0-9]+)\])?\}/gm;

export interface ResolverParams {
	readonly source: string;
	readonly stack?: readonly string[];
	readonly includedPath: string;
	readonly lineChar: string;
}

export async function resolver(
	{
		source,
		stack = [],
		includedPath,
		lineChar,
	}: ResolverParams,
): Promise<string> {
	let resolvedSource = source;

	for (const item of source.matchAll(includePattern)) {
		const [matchedValue] = item;
		const { path, startLine, endLine, indent } = item.groups ?? {};

		if (!path || indent === undefined) {
			continue;
		}

		let hasAbsolutePath = false;
		const segments: string[] = [];

		for (const pathPart of [includedPath, path]) {
			if (pathPart === ".") {
				continue;
			}

			if (pathPart.startsWith("/")) {
				hasAbsolutePath = true;
				segments.length = 0;
			}

			for (const segment of pathPart.split("/")) {
				if (segment === "") {
					continue;
				}

				if (segment === "..") {
					if (segments.length && segments.at(-1) !== "..") {
						segments.pop();
					} else if (!hasAbsolutePath) {
						segments.push("..");
					}
				} else {
					segments.push(segment);
				}
			}
		}

		const resolvedPath = hasAbsolutePath
			? `/${segments.join("/")}`
			: segments.join("/") || ".";

		if (stack.includes(resolvedPath)) {
			throw new RecursiveIncludeError(resolvedPath);
		}

		let fileContent = "";

		try {
			fileContent = await readFile(resolvedPath, { encoding: "utf-8" });
		} catch (error) {
			throw new IncludeFileReadError(resolvedPath, error);
		}

		let lines = fileContent.split(lineChar);

		if (startLine && endLine) {
			lines = lines.slice(Number(startLine) - 1, Number(endLine));
		}

		const expandedContent = await resolver({
			source: lines.join(lineChar),
			stack: [...stack, resolvedPath],
			includedPath,
			lineChar,
		});

		const indentedContent = expandedContent
			.split(lineChar)
			.map((value) => `${indent}${value}`)
			.join(lineChar);

		resolvedSource = resolvedSource.replace(
			matchedValue,
			() => indentedContent,
		);
	}

	return resolvedSource;
}
