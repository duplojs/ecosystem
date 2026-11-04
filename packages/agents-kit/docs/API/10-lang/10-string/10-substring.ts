/**
 * @title DString.substring
 *
 * Extraire une sous-chaîne selon les règles de `substring`.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.substring("hello world", 6);
// La valeur obtenue est "world".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<11>, "strict">;

const piped = DCommon.pipe(
	"hello world",
	DString.substring(6),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<11>, "strict">;
