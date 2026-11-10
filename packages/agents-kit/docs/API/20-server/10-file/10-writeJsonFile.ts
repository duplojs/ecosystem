/**
 * @title DSFile.writeJsonFile
 *
 * Sérialiser une valeur en JSON et l’écrire dans un fichier.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.writeJsonFile(path, { enabled: true });

// Le résultat peut signaler une erreur de sérialisation ou d’écriture.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-write-json-file-not-found": () => "missing",
			"file-system-write-json-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-write-json-file-not-found
// file-system-write-json-file-permission-denied
// file-system-write-json-file-is-directory
// file-system-write-json-file-not-directory
// file-system-write-json-file-no-space
// file-system-write-json-file-read-only
// file-system-write-json-file-invalid-argument
// file-system-write-json-file-too-many-open-files
// file-system-write-json-file-busy
// file-system-write-json-file-error
