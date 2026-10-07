/**
 * @title Manipuler le système de fichiers
 *
 * Lecture, écriture et opérations de système de fichiers avec chemins typés et résultats `Either`.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DServerFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";

const textResourcePath: string & DPath.Path = DCommon.cast("/path/to/text/resource");

// Les fonctions de `@duplojs/server/file` prennent des chemins contraints
// et retournent un `Either` discriminable.
const readTextResourceResult = await DServerFile.readTextFile(textResourcePath);

if (DEither.isRight(readTextResourceResult)) {
	// DEither.Right<"file-system-read-text-file", string>
	void readTextResourceResult;

	// string
	const textResource = DEither.unwrapRight(readTextResourceResult);
} else {
	// Les erreurs attendues restent discriminées individuellement :
	// | DEither.Left<"file-system-read-text-file-not-found", unknown>
	// | DEither.Left<"file-system-read-text-file-permission-denied", unknown>
	// | DEither.Left<"file-system-read-text-file-is-directory", unknown>
	// | DEither.Left<"file-system-read-text-file-not-directory", unknown>
	// | ...
	void readTextResourceResult;
}
