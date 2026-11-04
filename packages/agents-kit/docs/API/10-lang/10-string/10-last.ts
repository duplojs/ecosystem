/**
 * @title DString.last
 *
 * Lire le dernier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.last("hello");
// La valeur obtenue est "o".
type _CheckResult = DCommon.ExpectType<typeof result, "o", "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.last,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "o", "strict">;
