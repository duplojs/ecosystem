/**
 * @title DString.at
 *
 * Lire le caractère situé à un index, avec `undefined` lorsque l'index est hors limites.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.at("hello", 1);
// La valeur obtenue est "e".
type _CheckResult = DCommon.ExpectType<typeof result, "e", "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.at(1),
);
// La forme curifiée s'intègre dans un pipe et conserve le caractère "e".
type _CheckPiped = DCommon.ExpectType<typeof piped, "e", "strict">;
