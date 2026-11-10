/**
 * @title DSFile.stat
 *
 * Lire les métadonnées d’une entrée.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.stat(path);

// Le Right décrit notamment la nature, la taille et les dates de l’entrée.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-stat-not-found": () => "missing",
			"file-system-stat-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-stat-not-found
// file-system-stat-permission-denied
// file-system-stat-not-directory
// file-system-stat-too-many-open-files
// file-system-stat-busy
// file-system-stat-error
