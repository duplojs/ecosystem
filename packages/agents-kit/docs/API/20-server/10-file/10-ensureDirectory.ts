/**
 * @title DSFile.ensureDirectory
 *
 * Créer un dossier et ses parents si nécessaire.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.ensureDirectory(path);

// La réussite confirme que le dossier a été assuré.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-ensure-directory-permission-denied": () => "access-denied",
			"file-system-ensure-directory-no-space": () => "no-space",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-ensure-directory-permission-denied
// file-system-ensure-directory-not-directory
// file-system-ensure-directory-no-space
// file-system-ensure-directory-read-only
// file-system-ensure-directory-invalid-argument
// file-system-ensure-directory-too-many-open-files
// file-system-ensure-directory-busy
// file-system-ensure-directory-error
