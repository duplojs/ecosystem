/**
 * @title DSFile.readDirectory
 *
 * Lister les chemins d’un dossier avec récursivité et résolution absolue optionnelles.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import * as DSFile from "@duplojs/server/file";

declare const directory: string & DPath.Path;

const result = await DSFile.readDirectory(
	directory,
	{
		recursive: true,
		absolute: true,
	},
);

if (DEither.isRight(result)) {
	const paths = DEither.unwrapRight(result);

	type _CheckPaths = DCommon.ExpectType<
		typeof paths,
		readonly (string & DPath.Path & DPath.Absolute)[],
		"strict"
	>;
} else {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-directory-not-found": () => "missing-directory",
			"file-system-read-directory-permission-denied": () => "access-denied",
			"file-system-read-directory-not-directory": () => "not-a-directory",
		},
		(otherError) => otherError,
	);
}

// Sans absolute, les chemins sont relatifs au dossier lu.

// Identifiants d’erreur déclarés pour cette opération :
// file-system-read-directory-not-found
// file-system-read-directory-permission-denied
// file-system-read-directory-not-directory
// file-system-read-directory-too-many-open-files
// file-system-read-directory-busy
// file-system-read-directory-error
