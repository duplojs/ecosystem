/**
 * @title DCommon.pipe
 *
 * Appliquer une suite de transformations de gauche à droite.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DCommon.pipe(
	"value",
	DString.toUpperCase,
	DString.length,
);

// Chaque étape reçoit la sortie de la précédente.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	number & DNumber.Positive,
	"strict"
>;
