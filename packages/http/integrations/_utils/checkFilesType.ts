import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import ts from "typescript";

export function assertTypeScriptProject(tsconfigPath: string & DPath.Path) {
	const resolvedTsconfigPath = DPath.resolveRelative([DSCommon.getCurrentWorkDirectoryOrThrow(), tsconfigPath]);
	const tsconfigDirectory = DPath.getParentFolderPath(resolvedTsconfigPath) ?? "";

	const configFileResult = ts.readConfigFile(
		resolvedTsconfigPath,
		ts.sys.readFile,
	);

	if (configFileResult.error) {
		throw new Error(formatTypeScriptDiagnostics([configFileResult.error]));
	}

	const parsedConfig = ts.parseJsonConfigFileContent(
		configFileResult.config,
		ts.sys,
		tsconfigDirectory,
		{
			noEmit: true,
		},
		resolvedTsconfigPath,
	);

	const program = ts.createProgram({
		rootNames: parsedConfig.fileNames,
		options: parsedConfig.options,
		projectReferences: parsedConfig.projectReferences,
	});

	const diagnostics = [
		...parsedConfig.errors,
		...ts.getPreEmitDiagnostics(program),
	];

	if (diagnostics.length > 0) {
		throw new Error(formatTypeScriptDiagnostics(diagnostics));
	}
}

function formatTypeScriptDiagnostics(
	diagnostics: readonly ts.Diagnostic[],
) {
	const formatHost: ts.FormatDiagnosticsHost = {
		getCanonicalFileName: (fileName) => (
			ts.sys.useCaseSensitiveFileNames
				? fileName
				: fileName.toLowerCase()
		),
		getCurrentDirectory: ts.sys.getCurrentDirectory,
		getNewLine: () => ts.sys.newLine,
	};

	return ts.formatDiagnosticsWithColorAndContext(
		diagnostics,
		formatHost,
	);
}
