/**
 * @title DSFile.readFile
 *
 * Lire les octets d’un fichier.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.readFile(path);

// Le Right porte les octets lus ; le Left décrit l’échec d’accès.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-file-not-found": () => "missing",
			"file-system-read-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-read-file-not-found
// file-system-read-file-permission-denied
// file-system-read-file-is-directory
// file-system-read-file-not-directory
// file-system-read-file-too-many-open-files
// file-system-read-file-busy
// file-system-read-file-error
