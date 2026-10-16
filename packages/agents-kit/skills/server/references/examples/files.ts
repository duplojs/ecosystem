/**
 * @title Conserver les erreurs des opérations de fichiers.
 *
 * Tolérer uniquement l'absence attendue et séquencer une écriture dépendante.
 */
import * as DSFile from "@duplojs/server/file";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

export async function readTextOrEmpty(path: string & DPath.Path) {
	const result = await DSFile.readTextFile(path);

	if (DEither.isRight(result)) {
		const text = DEither.unwrapRight(result);

		type _CheckText = DCommon.ExpectType<typeof text, string, "strict">;
		return result;
	}

	const error = DEither.unwrapLeft(result);

	type _CheckError = DCommon.ExpectType<typeof error, DSFile.ReadTextFileErrors, "strict">;

	return DPattern.matchWithErrorOtherwise(
		error,
		{
			// L'absence est le seul cas pour lequel ce scénario choisit un défaut.
			"file-system-read-text-file-not-found": () => DEither.right("file-system-read-text-file", ""),
		},
		() => result,
	);
}

export async function writeReport(directory: string & DPath.Path, text: string) {
	const target = DPath.resolveRelative([directory, DPath.declarePath("report.txt")]);
	const result = await DEither.rightAsyncPipe(
		DSFile.ensureDirectory(directory),
		// Cette écriture ne s'exécute pas si la préparation du dossier échoue.
		() => DSFile.writeTextFile(target, text),
	);

	type _CheckResult = DCommon.ExpectType<
		typeof result,
		| DSFile.WriteTextFileResult
		| Extract<DSFile.EnsureDirectoryResult, DEither.Left>,
		"strict"
	>;

	return result;
}
