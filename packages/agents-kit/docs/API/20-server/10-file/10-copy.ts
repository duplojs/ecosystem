/**
 * @title DSFile.copy
 *
 * Copier une ressource, récursivement pour un dossier.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const source: string & DPath.Path;
declare const destination: string & DPath.Path;

// Appel direct
const result = await DSFile.copy(source, destination);

// Forme curifiée
const pipedResult = await DCommon.pipe(
	source,
	DSFile.copy(destination),
);

// Les résultats dépendent de l'état du système de fichiers et peuvent échouer.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-copy-not-found": () => "missing",
			"file-system-copy-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-copy-not-found
// file-system-copy-permission-denied
// file-system-copy-already-exists
// file-system-copy-not-directory
// file-system-copy-no-space
// file-system-copy-read-only
// file-system-copy-invalid-argument
// file-system-copy-too-many-open-files
// file-system-copy-busy
// file-system-copy-error
