import * as DEither from "@duplojs/lang/either";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import type * as DInvocation from "@duplojs/lang/invocation";
import * as DSFile from "@duplojs/server/file";

export interface GenerateDeclarationParams {
	outputFolder: string & DPath.Absolute;
}

export async function generateDeclaration(
	typescriptInstance: DInvocation.GetEvidenceResult<
		typeof createTypescriptInstance,
		"typescript-instance"
	>,
	params: GenerateDeclarationParams,
) {
	const virtualTsconfigPath = DPath.resolveFrom(
		typescriptInstance.workDirectory,
		[DCommon.cast("tsconfig.temp.build.json")],
	);
	const buildSnapshot = await typescriptInstance.snapshot.update({
		fileSystem: {
			kind: "layer",
			files: {
				[virtualTsconfigPath]: JSON.stringify({
					extends: typescriptInstance.tsconfigPath,
					compilerOptions: {
						outDir: params.outputFolder,
						declarationDir: params.outputFolder,
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

	return DCommon.pipe(
		result.outputFiles,
		DGenerator.asyncReduce(
			DGenerator.reduceFrom(DEither.ok()),
			async({ item: [path, content], lastValue, exit, next }) => {
				const normalizedPath = DPath.normalize(path);
				if (!normalizedPath) {
					return exit(DEither.left("invalidPath", path));
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
