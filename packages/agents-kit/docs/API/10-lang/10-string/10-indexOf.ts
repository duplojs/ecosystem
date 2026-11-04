/**
 * @title DString.indexOf
 *
 * Retourner la position d'une sous-chaîne, ou `undefined` si elle est absente.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.indexOf("hello world", "world");
// La valeur obtenue est 6.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

const piped = DCommon.pipe(
	"hello world",
	DString.indexOf("world"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
