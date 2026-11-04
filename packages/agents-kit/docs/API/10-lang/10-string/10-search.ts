/**
 * @title DString.search
 *
 * Retourner la position d'un motif, ou `undefined` lorsqu'il ne correspond pas.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.search("hello42", /\d+/);
// La valeur obtenue est 5.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

const piped = DCommon.pipe(
	"hello42",
	DString.search(/\d+/),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
