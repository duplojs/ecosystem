/**
 * @title DString.first
 *
 * Lire le premier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.first("hello");
// La valeur obtenue est "h".
type _CheckResult = DCommon.ExpectType<typeof result, "h", "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.first,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "h", "strict">;
