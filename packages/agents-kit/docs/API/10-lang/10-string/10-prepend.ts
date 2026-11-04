/**
 * @title DString.prepend
 *
 * Ajouter une ou plusieurs chaînes au début d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.prepend("hello", "say ");
// La valeur obtenue est "say hello".
type _CheckResult = DCommon.ExpectType<typeof result, "say hello", "strict">;

const piped = DCommon.pipe(
	"hello",
	DString.prepend("say "),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "say hello", "strict">;
