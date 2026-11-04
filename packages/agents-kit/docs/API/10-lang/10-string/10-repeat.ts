/**
 * @title DString.repeat
 *
 * Répéter une chaîne un nombre positif de fois.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.repeat("ha", 3);
// La valeur obtenue est "hahaha".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	"ha",
	DString.repeat(3),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
