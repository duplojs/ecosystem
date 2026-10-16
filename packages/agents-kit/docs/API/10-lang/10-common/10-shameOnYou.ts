/**
 * @title DCommon.shameOnYou
 *
 * Contourner explicitement une contrainte attendue dans un contrat de type.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

const acceptLongString = (value: string & DString.MinCharacters<10>) => value;

const result = acceptLongString(
	DCommon.shameOnYou("short"),
);

// La valeur brute est acceptée malgré la contrainte, puis présentée au contrat comme contrainte.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	string & DString.MinCharacters<10>,
	"strict"
>;
