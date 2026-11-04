/**
 * @title DString.slice
 *
 * Extraire une portion d'une chaîne entre deux index.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.slice("hello world", 0, 5);
// La valeur obtenue est "hello".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<11>, "strict">;

const piped = DCommon.pipe(
	"hello world",
	DString.slice(0, 5),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<11>, "strict">;
