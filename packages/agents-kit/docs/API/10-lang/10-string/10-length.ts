/**
 * @title DString.length
 *
 * Retourner le nombre de caractères d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.length("DuploJS");
// La valeur obtenue est 7 et elle est toujours strictement positive.
type _CheckResult = DCommon.ExpectType<typeof result, number & DNumber.Positive, "strict">;

const piped = DCommon.pipe(
	"DuploJS",
	DString.length,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number & DNumber.Positive, "strict">;
