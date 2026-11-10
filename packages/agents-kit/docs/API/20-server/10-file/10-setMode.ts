/**
 * @title DSFile.setMode
 *
 * Modifier les permissions d’une entrée.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.setMode(path, 0o640);

// Le résultat peut notamment signaler un refus d’accès.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-set-mode-not-found": () => "missing",
			"file-system-set-mode-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-set-mode-not-found
// file-system-set-mode-permission-denied
// file-system-set-mode-not-directory
// file-system-set-mode-read-only
// file-system-set-mode-invalid-argument
// file-system-set-mode-error
