/**
 * @title DCommon.pipeCall
 *
 * Corriger l’inférence d’une fonction sans générique utilisée dans un pipe.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DCommon.pipe(
	"value",
	DCommon.pipeCall(DString.length),
);

// La fonction unaire est adaptée au pipe et conserve son type de sortie.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	number & DNumber.Positive,
	"strict"
>;
