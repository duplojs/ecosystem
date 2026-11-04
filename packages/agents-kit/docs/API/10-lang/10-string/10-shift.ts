/**
 * @title DString.shift
 *
 * Retirer le premier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.shift("hello");
// La valeur obtenue est "ello".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<5>, "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.shift,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<5>, "strict">;
