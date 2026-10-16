/**
 * @title Composer des étapes asynchrones.
 *
 * Attendre le résultat final avec asyncPipe.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare function loadName(): Promise<string>;

const name = await DCommon.asyncPipe(
	loadName(),
	DString.trim,
	DString.toLowerCase,
);
