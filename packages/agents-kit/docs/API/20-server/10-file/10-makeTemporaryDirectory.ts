/**
 * @title DSFile.makeTemporaryDirectory
 *
 * Créer un dossier temporaire avec un préfixe.
 */
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

const result = await DSFile.makeTemporaryDirectory("export-");

// La position et le nom obtenus dépendent du runtime et du préfixe.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-make-temporary-directory-permission-denied": () => "access-denied",
			"file-system-make-temporary-directory-no-space": () => "no-space",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-make-temporary-directory-permission-denied
// file-system-make-temporary-directory-not-directory
// file-system-make-temporary-directory-no-space
// file-system-make-temporary-directory-read-only
// file-system-make-temporary-directory-invalid-argument
// file-system-make-temporary-directory-too-many-open-files
// file-system-make-temporary-directory-error
