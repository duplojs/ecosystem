/**
 * @title DSFile.appendTextFile
 *
 * Ajouter du texte à un fichier.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

// Appel direct
const result = await DSFile.appendTextFile(path, "nouvelle ligne\n");

// Forme curifiée
const pipedResult = await DCommon.pipe(
	path,
	DSFile.appendTextFile("nouvelle ligne\n"),
);

// Chaque résultat indique la réussite ou l'échec de l'écriture.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-append-text-file-not-found": () => "missing",
			"file-system-append-text-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-append-text-file-not-found
// file-system-append-text-file-permission-denied
// file-system-append-text-file-is-directory
// file-system-append-text-file-not-directory
// file-system-append-text-file-no-space
// file-system-append-text-file-read-only
// file-system-append-text-file-invalid-argument
// file-system-append-text-file-too-many-open-files
// file-system-append-text-file-busy
// file-system-append-text-file-error
