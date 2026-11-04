/**
 * @title DString.padEnd
 *
 * Compléter une chaîne par la droite jusqu'à une longueur cible.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.padEnd("42", 5, "0");
// La valeur obtenue est "42000".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MinCharacters<2>, "strict">;

const piped = DCommon.pipe(
	"42",
	DString.padEnd(5, "0"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MinCharacters<2>, "strict">;
