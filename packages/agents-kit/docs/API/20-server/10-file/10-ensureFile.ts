/**
 * @title DSFile.ensureFile
 *
 * Créer un fichier absent sans tronquer un fichier existant.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.ensureFile(path);

// Le dossier parent doit déjà exister.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-ensure-file-permission-denied": () => "access-denied",
			"file-system-ensure-file-no-space": () => "no-space",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-ensure-file-permission-denied
// file-system-ensure-file-is-directory
// file-system-ensure-file-not-directory
// file-system-ensure-file-no-space
// file-system-ensure-file-read-only
// file-system-ensure-file-invalid-argument
// file-system-ensure-file-too-many-open-files
// file-system-ensure-file-busy
// file-system-ensure-file-error
