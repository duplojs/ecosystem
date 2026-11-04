/**
 * @title DString.pop
 *
 * Retirer le dernier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.pop("hello");
// La valeur obtenue est "hell".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<5>, "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.pop,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<5>, "strict">;
