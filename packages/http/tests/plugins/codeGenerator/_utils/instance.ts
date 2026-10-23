import * as AST from "@typescript/native-API/ast";
import * as DEither from "@duplojs/lang/either";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DPath from "@duplojs/lang/path";
import * as DArray from "@duplojs/lang/array";
import { createTypescriptInstance, type createContentRoutesFiles } from "@plugin-codeGenerator";

export type TypescriptInstance = DInvocation.GetEvidenceResult<typeof createTypescriptInstance, "typescript-instance">;
export type RoutesFiles = DInvocation.GetEvidenceResult<typeof createContentRoutesFiles, "updated-route-files">;

export function fixturePath(fileName: string) {
	const path = DPath.normalize(new URL(`./project/${fileName}`, import.meta.url).href);
	if (!path || !DPath.isAbsolute(path)) {
		throw new Error("Expected an absolute fixture path");
	}
	return path;
}

export async function openProject() {
	const result = await createTypescriptInstance({ tsconfigPath: fixturePath("tsconfig.json") });
	return DEither.unwrapByInformationOrThrow(result, "success");
}

type RouteEntries = readonly (readonly [string & DPath.Path & DPath.Absolute, readonly string[]])[];

export function routesFiles(entries: RouteEntries = []) {
	const files: RoutesFiles = DInvocation.appendEvidence(new Map(), "updated-route-files");
	for (const [path, names] of entries) {
		files.set(path, {
			content: "",
			variablesName: DArray.map(names, AST.factory.createIdentifier),
		});
	}
	return files;
}
