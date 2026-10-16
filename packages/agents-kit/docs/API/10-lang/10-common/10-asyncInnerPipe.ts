/**
 * @title DCommon.asyncInnerPipe
 *
 * Construire une fonction qui enchaîne des opérations synchrones ou asynchrones.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DCommon.asyncPipe(
	"value",
	DCommon.asyncInnerPipe(
		DString.toUpperCase,
		DString.length,
	),
);

// La fonction composée retourne la longueur positive dans une Promise.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<number & DNumber.Positive>,
	"strict"
>;
