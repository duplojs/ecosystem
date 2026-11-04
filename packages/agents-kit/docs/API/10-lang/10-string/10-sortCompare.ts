/**
 * @title DString.sortCompare
 *
 * Comparer deux chaînes avec l'ordre de tri du domaine String.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.sortCompare("file2", "file10");
// La valeur obtenue est un nombre négatif car "file2" précède "file10".
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

const piped = DCommon.pipe(
	"file2",
	DString.sortCompare("file10"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
