/**
 * @title DSFile.move
 *
 * Déplacer une ressource vers un chemin de destination.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const source: string & DPath.Path;
declare const destination: string & DPath.Path;

// Appel direct
const result = await DSFile.move(source, destination);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	source,
	DSFile.move(destination),
);

// Les résultats dépendent de l'état du système de fichiers et peuvent échouer.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-move-not-found": () => "missing",
			"file-system-move-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-move-not-found
// file-system-move-permission-denied
// file-system-move-already-exists
// file-system-move-is-directory
// file-system-move-not-directory
// file-system-move-directory-not-empty
// file-system-move-read-only
// file-system-move-invalid-argument
// file-system-move-busy
// file-system-move-cross-device
// file-system-move-error
