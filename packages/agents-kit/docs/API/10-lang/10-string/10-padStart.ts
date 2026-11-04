/**
 * @title DString.padStart
 *
 * Compléter une chaîne par la gauche jusqu'à une longueur cible.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.padStart("42", 5, "0");
// La valeur obtenue est "00042".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MinCharacters<2>, "strict">;

const piped = DCommon.pipe(
	"42",
	DString.padStart(5, "0"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MinCharacters<2>, "strict">;
