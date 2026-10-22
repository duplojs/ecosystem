import { API, type Snapshot, type Project } from "@typescript/native-API/async";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DInvocation from "@duplojs/lang/invocation";

export interface CreateTypescriptInstanceParams {
	tsconfigPath: string & DPath.Absolute;
}

export async function createTypescriptInstance(
	params: CreateTypescriptInstanceParams,
) {
	const workDirectory = DPath.getParentFolderPath(params.tsconfigPath);

	if (!workDirectory) {
		return DEither.left("invalidTsconfigPath");
	}

	const api = new API({
		cwd: workDirectory,
	});

	const snapshot = await api.createSnapshot({
		openProjects: [params.tsconfigPath],
	});

	const project = snapshot.getConfiguredProject(params.tsconfigPath);

	if (!project) {
		return DEither.left("missingProject");
	}

	return DCommon.pipe(
		{
			snapshot,
			api,
			project,
			workDirectory,
			tsconfigPath: params.tsconfigPath,
		},
		DInvocation.appendEvidence("typescript-instance"),
		DEither.success,
	);
}
