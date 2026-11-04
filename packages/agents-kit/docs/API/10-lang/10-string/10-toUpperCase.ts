/**
 * @title DString.toUpperCase
 *
 * Convertir une chaîne en majuscules.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.toUpperCase("DuploJS");
// La valeur obtenue est "DUPLOJS".
type _CheckResult = DCommon.ExpectType<typeof result, "DUPLOJS", "strict">;

const piped = DCommon.pipe(
	"DuploJS",
	DString.toUpperCase,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "DUPLOJS", "strict">;
