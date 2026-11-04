/**
 * @title DString.test
 *
 * Tester une chaîne avec une expression régulière.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.test("order-42", /\d+$/);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

const piped = DCommon.pipe(
	"order-42",
	DString.test(/\d+$/),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
