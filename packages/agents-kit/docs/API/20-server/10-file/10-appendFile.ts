/**
 * @title DSFile.appendFile
 *
 * Ajouter des octets à un fichier.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;
declare const bytes: Uint8Array;

// Appel direct
const result = await DSFile.appendFile(path, bytes);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	path,
	DSFile.appendFile(bytes),
);

// Chaque résultat indique la réussite ou l'échec de l'écriture.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-append-file-not-found": () => "missing",
			"file-system-append-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-append-file-not-found
// file-system-append-file-permission-denied
// file-system-append-file-is-directory
// file-system-append-file-not-directory
// file-system-append-file-no-space
// file-system-append-file-read-only
// file-system-append-file-invalid-argument
// file-system-append-file-too-many-open-files
// file-system-append-file-busy
// file-system-append-file-error
