/**
 * @title DString.sort
 *
 * Trier une copie d'une collection de chaînes dans l'ordre croissant ou décroissant.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const values: readonly string[] = ["b", "a", "c"];
const result = DString.sort(values, "ASC");
// La valeur obtenue est une nouvelle collection triée ["a", "b", "c"].
type _CheckResult = DCommon.ExpectType<typeof result, string[], "strict">;

const piped = DCommon.pipe(
	values,
	DString.sort("DSC"),
);
// Le pipe retourne une copie triée dans l'ordre décroissant.
type _CheckPiped = DCommon.ExpectType<typeof piped, string[], "strict">;
