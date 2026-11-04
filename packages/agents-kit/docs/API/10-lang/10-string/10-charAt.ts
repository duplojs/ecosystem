/**
 * @title DString.charAt
 *
 * Lire le caractère situé à un index positif ou nul.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.charAt("hello", 1);
// La valeur obtenue est une chaîne d'au plus un caractère, ici "e".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<1>, "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.charAt(1),
);
// La forme curifiée conserve la garantie de longueur maximale.
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<1>, "strict">;
