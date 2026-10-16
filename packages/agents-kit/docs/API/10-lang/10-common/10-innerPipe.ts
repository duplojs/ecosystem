/**
 * @title DCommon.innerPipe
 *
 * Composer plusieurs transformations dans une fonction réutilisable.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DCommon.pipe(
	"value",
	DCommon.innerPipe(
		DString.toUpperCase,
		DString.length,
	),
);

// La fonction composée retourne une longueur positive.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	number & DNumber.Positive,
	"strict"
>;
