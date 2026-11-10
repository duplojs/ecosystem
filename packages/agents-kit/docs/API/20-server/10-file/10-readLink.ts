/**
 * @title DSFile.readLink
 *
 * Lire la cible d’un lien symbolique.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.readLink(path);

// Le résultat dépend de la cible enregistrée sur le système de fichiers.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-link-not-found": () => "missing",
			"file-system-read-link-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-read-link-not-found
// file-system-read-link-permission-denied
// file-system-read-link-invalid-argument
// file-system-read-link-not-directory
// file-system-read-link-too-many-open-files
// file-system-read-link-error
