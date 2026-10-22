import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { createTypescriptInstance } from "./createTypescriptInstance";
import { createContentRoutesFiles } from "./createContentRoutesFiles";
import * as DCommon from "@duplojs/lang/common";
import { generateRouteIndex } from "./generateRouteIndex";
import { updateTypescriptInstanceSnapshot } from "./updateTypescriptInstanceSnapshot";
import { generateDeclaration } from "./generateDeclaration";

export interface GenerateCodeByInferenceParams {
	tsconfigPath: string & DPath.Absolute;
	isRoutePath: DPath.PathMatcher;
	outputFolder: string & DPath.Absolute;
}

export function generateCodeByInference(params: GenerateCodeByInferenceParams) {
	return DEither.rightAsyncPipe(
		createTypescriptInstance({
			tsconfigPath: params.tsconfigPath,
		}),
		async(typescriptInstance) => {
			const contentRoutesFiles = await DCommon.asyncPipe(
				createContentRoutesFiles(
					typescriptInstance,
					{ isRoutePath: params.isRoutePath },
				),
				DEither.unwrapRight,
			);

			const routesIndexEntry = await DCommon.asyncPipe(
				generateRouteIndex(typescriptInstance, contentRoutesFiles),
				DEither.unwrapRight,
			);

			if (DEither.isLeft(routesIndexEntry)) {
				return routesIndexEntry;
			}

			const updatedTypescriptInstance = await DCommon.asyncPipe(
				updateTypescriptInstanceSnapshot(
					typescriptInstance,
					contentRoutesFiles,
					routesIndexEntry,
				),
				DEither.unwrapRight,
			);

			if (DEither.isLeft(updatedTypescriptInstance)) {
				return updatedTypescriptInstance;
			}

			return generateDeclaration(
				updatedTypescriptInstance,
				{ outputFolder: params.outputFolder },
			);
		},
	);
}
