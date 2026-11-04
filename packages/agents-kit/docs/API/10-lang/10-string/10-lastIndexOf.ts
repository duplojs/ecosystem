/**
 * @title DString.lastIndexOf
 *
 * Retourner la dernière position d'une sous-chaîne, ou `undefined` si elle est absente.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.lastIndexOf("one-two-two", "two");
// La valeur obtenue est 8.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

const piped = DCommon.pipe(
	"one-two-two",
	DString.lastIndexOf("two"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
