/**
 * @title Manipuler le système de fichiers
 *
 * Les fonctions de `@duplojs/server/file` suivent toutes une structure similaire :
 * elles prennent les paramètres nécessaires à l'opération, généralement un ou
 * plusieurs chemins, puis retournent un `Either`.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DServerFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";

const textResourcePath: string & DPath.Path = DCommon.cast("/path/to/text/resource");

const readTextResourceResult = await DServerFile.readTextFile(textResourcePath);

if (DEither.isRight(readTextResourceResult)) {
	// DEither.Right<"file-system-read-text-file", string>
	void readTextResourceResult;

	// string
	const textResource = DEither.unwrapRight(readTextResourceResult);
} else {
	// Les erreurs attendues sont discriminées individuellement.
	// `error` représente les autres erreurs possibles.
	//
	// | DEither.Left<"file-system-read-text-file-not-found", unknown>
	// | DEither.Left<"file-system-read-text-file-permission-denied", unknown>
	// | DEither.Left<"file-system-read-text-file-is-directory", unknown>
	// | DEither.Left<"file-system-read-text-file-not-directory", unknown>
	// | DEither.Left<"file-system-read-text-file-too-many-open-files", unknown>
	// | DEither.Left<"file-system-read-text-file-busy", unknown>
	// | DEither.Left<"file-system-read-text-file-error", unknown>
	void readTextResourceResult;
}
