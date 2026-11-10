/**
 * @title DSFile.makeDirectory
 *
 * Créer un dossier, éventuellement avec ses parents.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.makeDirectory(path, { recursive: true });

// Le Left décrit un éventuel échec de création.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-make-directory-not-found": () => "missing",
			"file-system-make-directory-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-make-directory-not-found
// file-system-make-directory-permission-denied
// file-system-make-directory-already-exists
// file-system-make-directory-not-directory
// file-system-make-directory-no-space
// file-system-make-directory-read-only
// file-system-make-directory-invalid-argument
// file-system-make-directory-too-many-open-files
// file-system-make-directory-busy
// file-system-make-directory-error
