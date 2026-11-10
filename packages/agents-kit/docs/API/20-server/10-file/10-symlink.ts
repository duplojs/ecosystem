/**
 * @title DSFile.symlink
 *
 * Créer un lien symbolique vers une cible.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const source: string & DPath.Path;
declare const destination: string & DPath.Path;

// Appel direct
const result = await DSFile.symlink(source, destination);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	source,
	DSFile.symlink(destination),
);

// Les résultats dépendent de l'état du système de fichiers et peuvent échouer.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-symlink-not-found": () => "missing",
			"file-system-symlink-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-symlink-not-found
// file-system-symlink-permission-denied
// file-system-symlink-already-exists
// file-system-symlink-not-directory
// file-system-symlink-read-only
// file-system-symlink-invalid-argument
// file-system-symlink-too-many-open-files
// file-system-symlink-busy
// file-system-symlink-error
