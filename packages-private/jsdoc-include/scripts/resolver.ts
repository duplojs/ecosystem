import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DSFile from "@duplojs/server/file";

type AnyPath = string & (DPath.Path | DPath.Absolute | DPath.Segment);

export class InvalidIncludePathError extends DCommon.DuploJSError.parentClass("invalid-include-path-error") {
	public constructor(public readonly path: string) {
		super(`Invalid included file path: "${path}"`);
		this.name = "InvalidIncludePathError";
	}
}

export class RecursiveIncludeError extends DCommon.DuploJSError.parentClass("recursive-include-error") {
	public constructor(public readonly path: string) {
		super(`Recursive include detected file: "${path}"`);
		this.name = "RecursiveIncludeError";
	}
}

export class IncludeFileReadError extends DCommon.DuploJSError.parentClass("include-file-read-error") {
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
	readonly includedPath: AnyPath;
	readonly lineChar: string;
}

export async function resolver(
	{ source, stack = [], includedPath, lineChar }: ResolverParams,
): Promise<string> {
	return DCommon.pipe(
		source,
		DString.extractAll(includePattern),
		DGenerator.asyncReduce(
			DGenerator.reduceFrom(source),
			async({ lastValue, item, next }) => {
				const { path, startLine, endLine, indent } = item.namedGroups;

				if (!path || indent === undefined) {
					return next(lastValue);
				}

				const parsedPath = DPath.create(path);
				if (DEither.isLeft(parsedPath)) {
					throw new InvalidIncludePathError(DEither.unwrapLeft(parsedPath));
				}

				const resolvedPath = DPath.resolveRelative([includedPath, DEither.unwrapRight(parsedPath)]);
				if (DArray.includes(stack, resolvedPath)) {
					throw new RecursiveIncludeError(resolvedPath);
				}

				const result = await DSFile.readTextFile(resolvedPath);
				if (DEither.isLeft(result)) {
					throw new IncludeFileReadError(resolvedPath, DEither.unwrapLeft(result));
				}

				const slicedContent = DCommon.pipe(
					DEither.unwrapRight(result),
					DString.split(lineChar),
					(lines) => startLine && endLine
						? DArray.slice(
							lines,
							Number(startLine) - 1,
							Number(endLine),
						)
						: lines,
					DString.join(lineChar),
				);
				const expandedContent = await resolver({
					source: slicedContent,
					stack: DArray.push(stack, resolvedPath),
					includedPath,
					lineChar,
				});

				return DCommon.pipe(
					expandedContent,
					DString.split(lineChar),
					DArray.map((value) => `${indent}${value}`),
					DString.join(lineChar),
					(content) => DString.replace(
						lastValue,
						item.matchedValue,
						() => content,
					),
					next,
				);
			},
		),
	);
}
