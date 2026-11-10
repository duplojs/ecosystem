/**
 * @title DSFile.readTextFile
 *
 * Lire le contenu UTF-8 d'un fichier et distinguer les erreurs d'accès.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import * as DSFile from "@duplojs/server/file";

declare const configurationPath: string & DPath.Path;

const result = await DSFile.readTextFile(configurationPath);

if (DEither.isRight(result)) {
	// Le contenu dépend du fichier au moment de la lecture.
	const text = DEither.unwrapRight(result);
} else {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-text-file-not-found": () => "missing-configuration",
			"file-system-read-text-file-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-read-text-file-not-found
// file-system-read-text-file-permission-denied
// file-system-read-text-file-is-directory
// file-system-read-text-file-not-directory
// file-system-read-text-file-too-many-open-files
// file-system-read-text-file-busy
// file-system-read-text-file-error
