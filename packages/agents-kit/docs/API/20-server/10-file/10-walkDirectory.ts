/**
 * @title DSFile.walkDirectory
 *
 * Parcourir les entrées d’un dossier sous forme d’interfaces.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import * as DSFile from "@duplojs/server/file";

declare const directory: string & DPath.Path;

const result = await DSFile.walkDirectory(
	directory,
	{ recursive: true },
);

if (DEither.isRight(result)) {
	const entries = DEither.unwrapRight(result);

	// Le générateur produit des interfaces munies d'un chemin absolu.
	// Le test du kind permet d'utiliser les opérations propres aux fichiers.
	const descriptions = DArray.from(
		DGenerator.map(
			entries,
			(entry) => {
				type _CheckPath = DCommon.ExpectType<
					typeof entry.path,
					string & DPath.Path & DPath.Absolute,
					"strict"
				>;

				if (DSFile.isFileInterface(entry)) {
					return {
						path: entry.path,
						mimeType: entry.getMimeType(),
					};
				}

				if (DSFile.isFolderInterface(entry)) {
					return {
						path: entry.path,
						name: entry.getName(),
					};
				}

				// Une entrée inconnue conserve notamment path et stat().
				return { path: entry.path };
			},
		),
	);
} else {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-walk-directory-not-found": () => "missing-directory",
			"file-system-walk-directory-permission-denied": () => "access-denied",
			"file-system-walk-directory-not-directory": () => "not-a-directory",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-walk-directory-not-found
// file-system-walk-directory-permission-denied
// file-system-walk-directory-not-directory
// file-system-walk-directory-too-many-open-files
// file-system-walk-directory-busy
// file-system-walk-directory-error
