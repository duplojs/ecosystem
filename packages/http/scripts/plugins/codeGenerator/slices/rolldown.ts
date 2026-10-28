import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DPath from "@duplojs/lang/path";
import type { Plugin } from "rolldown";
import { createIndexSlice } from "./createIndexSlice";
import * as DSCommon from "@duplojs/server/common";
import * as DEither from "@duplojs/lang/either";
import * as DObject from "@duplojs/lang/object";
import { createMainIndex } from "./createMainIndex";
import type * as DString from "@duplojs/lang/string";

export interface SlicesParams {
	name: string & DPath.Segment & DString.AllowedCharacters<"a-z" | "A-Z">;
	pattern: string | string[];
}

export interface GenerateSlicesRolldownParams {
	slices: SlicesParams[];
	workDirectory?: string & DPath.Path;
}

export function generateSlicesRolldown(
	params: GenerateSlicesRolldownParams,
): Plugin {
	const files = new Map<string, string>();
	const workDirectory = DPath.resolveFrom(
		DSCommon.getCurrentWorkDirectoryOrThrow(),
		[params.workDirectory ?? DCommon.cast(".")],
	);

	return {
		name: "@duplojs/http/codeGenerator:slices",
		async options(options) {
			const mainIndexPath = DPath.resolveFrom(workDirectory, [DCommon.cast("index.ts")]);

			const result = await DEither.rightAsyncPipe(
				params.slices,
				DArray.map(
					({ name, pattern }) => DEither.rightAsyncPipe(
						createIndexSlice({
							isInSlice: DPath.createMatcher(pattern),
							workDirectory,
						}),
						(content) => {
							const filePath = DPath.resolveFrom(
								workDirectory,
								[DPath.concatSegment(name, DCommon.cast(".ts"))],
							);
							files.set(filePath, content);
							return DObject.entry(
								name,
								filePath,
							);
						},
					),
				),
				DCommon.promiseAll,
				DEither.group,
				DArray.concat([
					DObject.entry(
						"index",
						mainIndexPath,
					),
				]),
				DObject.fromEntries,
			);

			const input = DEither.unwrapRightOrThrow(result);

			const mainIndexContent = await DCommon.pipe(
				params.slices,
				DArray.map(({ name }) => name),
				createMainIndex,
			);

			files.set(mainIndexPath, mainIndexContent);

			return {
				...options,
				input,
			};
		},
		resolveId(id, from) {
			if (from === undefined) {
				return files.has(id) ? id : null;
			}

			const normalizedPath = DPath.normalize(id);
			const normalizedFrom = DCommon.pipe(
				DEither.rightPipe(
					from,
					DPath.normalize,
					DEither.toMaybe,
					DPath.createAbsolute,
					DPath.getParentFolderPath,
					DEither.toMaybe,
				),
				DEither.unwrapRight,
			);

			if (!normalizedPath || DEither.isLeft(normalizedFrom)) {
				return null;
			}

			const resolvedId = DPath.resolveFrom(
				normalizedFrom,
				[normalizedPath],
			);

			if (files.has(resolvedId)) {
				return resolvedId;
			}

			return undefined;
		},
		load(id) {
			return files.get(id) ?? null;
		},
	};
}
