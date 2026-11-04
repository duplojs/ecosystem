/**
 * @title DString.uncapitalize
 *
 * Mettre en minuscule le premier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.uncapitalize("Duplo");
// La valeur obtenue est "duplo".
type _CheckResult = DCommon.ExpectType<typeof result, "duplo", "strict">;

const piped = DCommon.pipe(
	"Duplo",
	DString.uncapitalize,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "duplo", "strict">;
