/**
 * @title DSFile.relocate
 *
 * Déplacer une entrée dans un autre dossier en conservant son nom.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const source: string & DPath.Path;
declare const destination: string & DPath.Path;

// Appel direct
const result = await DSFile.relocate(source, destination);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	source,
	DSFile.relocate(destination),
);

// Les résultats dépendent de l'état du système de fichiers et peuvent échouer.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-relocate-not-found": () => "missing",
			"file-system-relocate-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-relocate-not-found
// file-system-relocate-permission-denied
// file-system-relocate-already-exists
// file-system-relocate-is-directory
// file-system-relocate-not-directory
// file-system-relocate-directory-not-empty
// file-system-relocate-read-only
// file-system-relocate-invalid-argument
// file-system-relocate-busy
// file-system-relocate-cross-device
// file-system-relocate-error
