import * as DEither from "@duplojs/lang/either";
import type { Plugin } from "rolldown";
import { createTypescriptInstance } from "./createTypescriptInstance";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import { createContentRoutesFiles } from "./createContentRoutesFiles";
import { generateRouteIndex } from "./generateRouteIndex";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DObject from "@duplojs/lang/object";

export interface GenerateRoutesTypesRolldownParams {
	tsconfig: string & DPath.Path;
	pattern: DCommon.MaybeArray<string>;
}

export function generateRoutesTypesRolldown(
	params: GenerateRoutesTypesRolldownParams,
): Plugin {
	const routeFileMatcher = DPath.createMatcher(params.pattern);
	let files = new Map<string, string>();
	return {
		name: "@duplojs/http/codeGenerator:routesTypes",
		async options(options) {
			const resolvedTsconfig = DPath.resolveFrom(
				DSCommon.getCurrentWorkDirectoryOrThrow(),
				[params.tsconfig],
			);
			const result = await DEither.rightAsyncPipe(
				createTypescriptInstance({
					tsconfigPath: resolvedTsconfig,
				}),
				async(typescriptInstance) => {
					const contentRoutesFiles = await DCommon.asyncPipe(
						createContentRoutesFiles(
							typescriptInstance,
							{ isRoutePath: routeFileMatcher },
						),
						DEither.unwrapRight,
					);

					const routesIndexEntry = await DCommon.asyncPipe(
						generateRouteIndex(typescriptInstance, contentRoutesFiles),
						DEither.unwrapRight,
					);

					await typescriptInstance.api.close();

					if (DEither.isLeft(routesIndexEntry)) {
						return routesIndexEntry;
					}

					return {
						contentRoutesFiles,
						routesIndexEntry,
					};
				},
			);

			const { contentRoutesFiles, routesIndexEntry } = DEither.unwrapRightOrThrow(result);

			files = DCommon.pipe(
				contentRoutesFiles,
				DGenerator.map(([path, { content }]) => DObject.entry(path, content)),
				DGenerator.concat([routesIndexEntry]),
				(fileEntries) => new Map(fileEntries),
			);

			return {
				...options,
				input: {
					routes: routesIndexEntry[0],
				},
			};
		},
		resolveId(id) {
			if (files.has(id)) {
				return id;
			}

			return undefined;
		},
		load(id) {
			return files.get(id) ?? null;
		},
	};
}
