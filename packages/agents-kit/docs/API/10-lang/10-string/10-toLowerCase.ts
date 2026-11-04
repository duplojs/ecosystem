/**
 * @title DString.toLowerCase
 *
 * Convertir une chaîne en minuscules.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.toLowerCase("DuploJS");
// La valeur obtenue est "duplojs".
type _CheckResult = DCommon.ExpectType<typeof result, "duplojs", "strict">;

const piped = DCommon.pipe(
	"DuploJS",
	DString.toLowerCase,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "duplojs", "strict">;
