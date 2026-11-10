/**
 * @title DSFile.truncate
 *
 * Tronquer ou étendre un fichier à une taille en octets.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.truncate(path, 128);

// Le résultat indique si la modification a réussi.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-truncate-not-found": () => "missing",
			"file-system-truncate-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-truncate-not-found
// file-system-truncate-permission-denied
// file-system-truncate-is-directory
// file-system-truncate-not-directory
// file-system-truncate-no-space
// file-system-truncate-read-only
// file-system-truncate-invalid-argument
// file-system-truncate-too-many-open-files
// file-system-truncate-busy
// file-system-truncate-error
