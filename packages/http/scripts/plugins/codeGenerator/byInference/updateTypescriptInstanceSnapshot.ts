import * as DObject from "@duplojs/lang/object";
import * as DInvocation from "@duplojs/lang/invocation";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import { type createContentRoutesFiles } from "./createContentRoutesFiles";
import { type generateRouteIndex } from "./generateRouteIndex";
import * as DGenerator from "@duplojs/lang/generator";
import * as DEither from "@duplojs/lang/either";

export function updateTypescriptInstanceSnapshot(
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
) {
	return DEither.rightAsyncPipe(
		files,
		DGenerator.map(([path, { content }]) => DObject.entry(path, content)),
		DGenerator.concat([routeIndexEntry]),
		DObject.fromEntries,
		(files) => typescriptInstance.snapshot.update({
			fileSystem: {
				kind: "layer",
				files,
			},
			ensurePrograms: true,
		}),
		async(newSnapshot) => {
			if (newSnapshot === typescriptInstance.snapshot) {
				return typescriptInstance;
			}

			await typescriptInstance.snapshot.dispose();

			const newProject = newSnapshot.getConfiguredProject(typescriptInstance.tsconfigPath);

			if (!newProject) {
				return DEither.left("missingNewProject");
			}

			return DObject.override(
				typescriptInstance,
				{
					snapshot: newSnapshot,
					project: newProject,
				},
			);
		},
		DInvocation.appendEvidence("updated-snapshot-typescript-instance"),
	);
}
