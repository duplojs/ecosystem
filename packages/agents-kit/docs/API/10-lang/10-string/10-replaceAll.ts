/**
 * @title DString.replaceAll
 *
 * Remplacer toutes les occurrences d'un motif par une chaîne ou une fonction de remplacement.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.replaceAll("a-b-c", "-", "/");
// La valeur obtenue est "a/b/c".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	"a-b-c",
	DString.replaceAll("-", "/"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
