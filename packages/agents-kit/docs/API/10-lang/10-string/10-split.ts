/**
 * @title DString.split
 *
 * Découper une chaîne selon un séparateur, avec une limite facultative.
 */
import type * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.split("a,b,c", ",");
// La valeur obtenue contient exactement trois éléments : ["a", "b", "c"].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly string[] & DArray.MinElements<3> & DArray.LengthEqual<3> & DArray.MaxElements<3>,
	"strict"
>;

const piped = DCommon.pipe(
	"a,b,c",
	DString.split(","),
);
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly string[] & DArray.MinElements<3> & DArray.LengthEqual<3> & DArray.MaxElements<3>,
	"strict"
>;

const limited = DString.split("a,b,c", ",", { limit: 2 });
// La limite réduit la sortie aux deux premiers groupes : ["a", "b"].
type _CheckLimited = DCommon.ExpectType<
	typeof limited,
	readonly string[] & DArray.MinElements<2> & DArray.LengthEqual<2> & DArray.MaxElements<2>,
	"strict"
>;
