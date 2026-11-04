/**
 * @title DString.capitalize
 *
 * Mettre en majuscule le premier caractère d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.capitalize("duplo");
// La valeur obtenue est "Duplo".
type _CheckResult = DCommon.ExpectType<typeof result, "Duplo", "strict">;

const piped = DCommon.pipe(
	"duplo",
	DString.capitalize,
);
// La fonction unaire peut être passée directement au pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, "Duplo", "strict">;
