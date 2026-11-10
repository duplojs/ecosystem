/**
 * @title DSFile.linkStat
 *
 * Lire les métadonnées d’un lien lui-même.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.linkStat(path);

// Contrairement à stat, cette opération inspecte le lien symbolique lui-même.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-link-stat-not-found": () => "missing",
			"file-system-link-stat-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-link-stat-not-found
// file-system-link-stat-permission-denied
// file-system-link-stat-not-directory
// file-system-link-stat-too-many-open-files
// file-system-link-stat-busy
// file-system-link-stat-error
