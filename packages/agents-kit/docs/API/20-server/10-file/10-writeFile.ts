/**
 * @title DSFile.writeFile
 *
 * Écrire des octets dans un fichier.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;
declare const bytes: Uint8Array;

// Appel direct
const result = await DSFile.writeFile(path, bytes);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	path,
	DSFile.writeFile(bytes),
);

// Chaque résultat indique la réussite ou l'échec de l'écriture.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-write-file-not-found": () => "missing",
			"file-system-write-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-write-file-not-found
// file-system-write-file-permission-denied
// file-system-write-file-is-directory
// file-system-write-file-not-directory
// file-system-write-file-no-space
// file-system-write-file-read-only
// file-system-write-file-invalid-argument
// file-system-write-file-too-many-open-files
// file-system-write-file-busy
// file-system-write-file-error
