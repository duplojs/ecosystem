/**
 * @title DSFile.writeTextFile
 *
 * Écrire du texte dans un fichier.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

// Appel direct
const result = await DSFile.writeTextFile(path, "configuration");

// Forme curifiée
const pipedResult = await DCommon.pipe(
	path,
	DSFile.writeTextFile("configuration"),
);

// Chaque résultat indique la réussite ou l'échec de l'écriture.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-write-text-file-not-found": () => "missing",
			"file-system-write-text-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-write-text-file-not-found
// file-system-write-text-file-permission-denied
// file-system-write-text-file-is-directory
// file-system-write-text-file-not-directory
// file-system-write-text-file-no-space
// file-system-write-text-file-read-only
// file-system-write-text-file-invalid-argument
// file-system-write-text-file-too-many-open-files
// file-system-write-text-file-busy
// file-system-write-text-file-error
