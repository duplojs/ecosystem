/**
 * @title DSFile.rename
 *
 * Renommer une entrée dans son dossier parent.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;
declare const name: string & DPath.Segment;

const result = await DSFile.rename(path, name);

// Le résultat porte le nouveau chemin en cas de succès.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-rename-not-found": () => "missing",
			"file-system-rename-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-rename-not-found
// file-system-rename-permission-denied
// file-system-rename-already-exists
// file-system-rename-is-directory
// file-system-rename-not-directory
// file-system-rename-directory-not-empty
// file-system-rename-read-only
// file-system-rename-invalid-argument
// file-system-rename-busy
// file-system-rename-cross-device
// file-system-rename-error
