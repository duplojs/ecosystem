import * as DEither from "@duplojs/lang/either";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import type * as DInvocation from "@duplojs/lang/invocation";
import * as DSFile from "@duplojs/server/file";
import * as DPattern from "@duplojs/lang/pattern";
import { type createContentRoutesFiles } from "./createContentRoutesFiles";
import { type generateRouteIndex } from "./generateRouteIndex";
import * as DObject from "@duplojs/lang/object";

export interface GenerateDeclarationParams {
	outputFolder: string & DPath.Absolute;
}

export async function generateDeclaration(
	typescriptInstance: DInvocation.GetEvidenceResult<
		typeof createTypescriptInstance,
		"typescript-instance"
	>,
	files: DInvocation.GetEvidenceResult<
		typeof createContentRoutesFiles,
		"updated-route-files"
	>,
	routeIndexEntry: DInvocation.GetEvidenceResult<
		typeof generateRouteIndex,
		"generated-route-index-entry"
	>,
	params: GenerateDeclarationParams,
) {
	const virtualTsconfigPath = DPath.resolveFrom(
		typescriptInstance.workDirectory,
		[DCommon.cast("tsconfig.temp.build.json")],
	);

	const routeFiles = DCommon.pipe(
		files,
		DGenerator.map(([path, { content }]) => DObject.entry(path, content)),
		DGenerator.concat([routeIndexEntry]),
		DObject.fromEntries,
	);

	const buildSnapshot = await typescriptInstance.snapshot.update({
		fileSystem: {
			kind: "layer",
			files: {
				...routeFiles,
				[virtualTsconfigPath]: JSON.stringify({
					extends: typescriptInstance.tsconfigPath,
					compilerOptions: {
						outDir: params.outputFolder,
						declarationDir: params.outputFolder,
						emitDeclarationOnly: true,
						declaration: true,
						noEmit: false,
					},
				}),
			},
		},
		openProjects: [virtualTsconfigPath],
		ensurePrograms: true,
	});
	const buildProject = buildSnapshot.getConfiguredProject(virtualTsconfigPath);

	if (!buildProject) {
		return DEither.left("notfoundBuildProject");
	}

	const result = await buildProject.program.emitToString();

	if (result.emitSkipped) {
		return DEither.left("emitSkipped", result);
	}

	const deleteOutputDirectoryResult = await DCommon.asyncPipe(
		DSFile.remove(params.outputFolder, { recursive: true }),
		DCommon.when(
			DEither.isLeft,
			DCommon.innerPipe(
				DEither.extractErrorInLeft("file-system-remove-not-found"),
				DEither.keepAsRightByInformation("file-system-remove-not-found"),
			),
		),
		DEither.unwrapRight,
	);

	if (DEither.isLeft(deleteOutputDirectoryResult)) {
		return deleteOutputDirectoryResult;
	}

	return DCommon.pipe(
		result.outputFiles,
		DGenerator.asyncReduce(
			DGenerator.reduceFrom(DEither.ok()),
			async({ item: [path, content], lastValue, exit, next }) => {
				const normalizedPath = DPath.normalize(path);
				if (!normalizedPath) {
					return exit(DEither.left("invalidPath", path));
				}

				const parentPath = DPath.getParentFolderPath(normalizedPath);

				if (!parentPath) {
					return exit(DEither.left("invalidParentPath", normalizedPath));
				}

				const parentResult = await DCommon.asyncPipe(
					DSFile.makeDirectory(parentPath, { recursive: true }),
					DCommon.when(
						DEither.isLeft,
						DCommon.innerPipe(
							DEither.extractErrorInLeft("file-system-make-directory-already-exists"),
							DEither.keepAsRightByInformation("file-system-make-directory-already-exists"),
						),
					),
					DEither.unwrapRight,
				);

				if (DEither.isLeft(parentResult)) {
					return exit(parentResult);
				}

				const result = await DSFile.writeTextFile(normalizedPath, content.text);

				if (DEither.isLeft(result)) {
					return exit(result);
				}

				return next(lastValue);
			},
		),
	);
}
