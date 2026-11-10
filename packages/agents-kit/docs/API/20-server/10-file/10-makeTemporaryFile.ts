/**
 * @title DSFile.makeTemporaryFile
 *
 * Créer un fichier temporaire avec préfixe et suffixe.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const prefix: string & DPath.Segment;
declare const suffix: string & DPath.Segment;

const result = await DSFile.makeTemporaryFile(prefix, suffix);

// Le Right porte le chemin créé ; le Left porte l’erreur de création.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-make-temporary-file-permission-denied": () => "access-denied",
			"file-system-make-temporary-file-already-exists": () => "already-exists",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-make-temporary-file-permission-denied
// file-system-make-temporary-file-already-exists
// file-system-make-temporary-file-not-directory
// file-system-make-temporary-file-no-space
// file-system-make-temporary-file-read-only
// file-system-make-temporary-file-invalid-argument
// file-system-make-temporary-file-too-many-open-files
// file-system-make-temporary-file-error
