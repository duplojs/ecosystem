/**
 * @title DSFile.setOwner
 *
 * Modifier le propriétaire et le groupe d’une entrée.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;
declare const owner: DSFile.SetOwnerParams;

const result = await DSFile.setOwner(path, owner);

// La disponibilité et les permissions dépendent de l’environnement.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-set-owner-not-found": () => "missing",
			"file-system-set-owner-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-set-owner-not-found
// file-system-set-owner-permission-denied
// file-system-set-owner-not-directory
// file-system-set-owner-read-only
// file-system-set-owner-invalid-argument
// file-system-set-owner-error
