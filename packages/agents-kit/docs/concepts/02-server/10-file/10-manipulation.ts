/**
 * @title Manipuler le système de fichiers
 *
 * Lecture, écriture et opérations de système de fichiers avec chemins typés et résultats `Either`.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

const textResourcePath: string & DPath.Path = DCommon.cast("/path/to/text/resource");

// Les fonctions de `@duplojs/server/file` prennent des chemins contraints
// et retournent un `Either` discriminable.
const readTextResourceResult = await DSFile.readTextFile(textResourcePath);

if (DEither.isRight(readTextResourceResult)) {
	// DEither.Right<"file-system-read-text-file", string>
	void readTextResourceResult;

	// string
	const textResource = DEither.unwrapRight(readTextResourceResult);
} else {
	// Le Left porte l'échec de l'opération ; sa valeur porte l'erreur précise.
	// DEither.Left<"file-system-read-text-file-error", DSFile.ReadTextFileErrors>
	const error = DEither.unwrapLeft(readTextResourceResult);

	type _CheckError = DCommon.ExpectType<typeof error, DSFile.ReadTextFileErrors, "strict">;

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-read-text-file-not-found": () => "missing-resource",
			"file-system-read-text-file-permission-denied": () => "access-denied",
		},
		// Conserver les autres erreurs, au lieu de toutes les traiter comme une absence.
		(otherError) => otherError,
	);
}
