/**
 * @title DSFile.readJsonFile
 *
 * Lire et analyser un fichier JSON.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.readJsonFile(path);

// Le JSON obtenu doit encore être validé selon le contrat applicatif.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-json-file-not-found": () => "missing",
			"file-system-read-json-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-read-json-file-not-found
// file-system-read-json-file-permission-denied
// file-system-read-json-file-is-directory
// file-system-read-json-file-not-directory
// file-system-read-json-file-too-many-open-files
// file-system-read-json-file-busy
// file-system-read-json-file-error
