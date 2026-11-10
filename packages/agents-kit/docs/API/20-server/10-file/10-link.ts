/**
 * @title DSFile.link
 *
 * Créer un lien physique vers une entrée existante.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const source: string & DPath.Path;
declare const destination: string & DPath.Path;

// Appel direct
const result = await DSFile.link(source, destination);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	source,
	DSFile.link(destination),
);

// Les résultats dépendent de l'état du système de fichiers et peuvent échouer.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-link-not-found": () => "missing",
			"file-system-link-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-link-not-found
// file-system-link-permission-denied
// file-system-link-already-exists
// file-system-link-not-directory
// file-system-link-no-space
// file-system-link-read-only
// file-system-link-invalid-argument
// file-system-link-too-many-open-files
// file-system-link-busy
// file-system-link-cross-device
// file-system-link-error
