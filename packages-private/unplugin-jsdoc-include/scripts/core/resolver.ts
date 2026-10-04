import * as DSFile from "@duplojs/server/file";
import * as DKind from "@duplojs/lang/kind";
import * as DEither from "@duplojs/lang/either";
import { createUnpluginJsDocIncludeKind } from "./kind";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import * as DArray from "@duplojs/lang/array";

export class RecursiveIncludeError extends DKind.parentClass(
	createUnpluginJsDocIncludeKind("recursive-include-error"),
	Error,
) {
	public constructor(
		public readonly path: string & DPath.Path,
	) {
		super({}, `Recursive include detected file: "${path}"`);
	}
}

export class IncludeFileReadError extends DKind.parentClass(
	createUnpluginJsDocIncludeKind("include-file-read-error"),
	Error,
) {
	public constructor(
		public readonly path: string & DPath.Path,
		public readonly error: Exclude<DSFile.ReadTextFileResult, DEither.Right>,
	) {
		super({}, `Failed to read included file: "${path}"`);
	}
}

const includePattern = /^(?<indent>.*)\{@include (?<path>[^\]\s}]+)(?:\[(?<startLine>[0-9]+),(?<endLine>[0-9]+)\])?\}/gm;
export interface ResolveIncludesParams {
	readonly source: string;
	readonly stack?: readonly (string & DPath.Path)[];
	readonly includedPath: string & DPath.Path;
	readonly lineChar: string;
}

export async function resolver(
	{
		source,
		stack = [],
		includedPath,
		lineChar,
	}: ResolveIncludesParams,
): Promise<string> {
	return DCommon.pipe(
		source,
		DString.extractAll(includePattern),
		DGenerator.asyncReduce(
			DGenerator.reduceFrom(source),
			async({ lastValue, item, next }) => {
				const { path, startLine, endLine, indent } = item.namedGroups ?? {};

				if (!path || indent === undefined || !DPath.is(path)) {
					return next(lastValue);
				}

				const resolvedPath = DPath.resolveRelative([includedPath, path]);

				if (DArray.includes(stack, resolvedPath)) {
					throw new RecursiveIncludeError(resolvedPath);
				}

				const resultReadFile = await DSFile.readTextFile(resolvedPath);

				if (DEither.isLeft(resultReadFile)) {
					throw new IncludeFileReadError(resolvedPath, resultReadFile);
				}

				const slicedContent = DCommon.pipe(
					DEither.unwrapRight(resultReadFile),
					DString.split(lineChar),
					(lines) => {
						if (startLine && endLine) {
							const start = Number(startLine) - 1;
							const end = Number(endLine);

							return DArray.slice(lines, start, end);
						}

						return lines;
					},
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
