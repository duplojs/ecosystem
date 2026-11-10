/**
 * @title DSFile.remove
 *
 * Supprimer une entrée, éventuellement récursivement.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.remove(path, { recursive: true });

// Le résultat doit être traité même si une vérification préalable a réussi.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-remove-not-found": () => "missing",
			"file-system-remove-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-remove-not-found
// file-system-remove-permission-denied
// file-system-remove-is-directory
// file-system-remove-not-directory
// file-system-remove-directory-not-empty
// file-system-remove-read-only
// file-system-remove-invalid-argument
// file-system-remove-busy
// file-system-remove-error
