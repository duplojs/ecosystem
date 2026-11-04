/**
 * @title DString.replace
 *
 * Remplacer la première occurrence d'un motif par une chaîne ou une fonction de remplacement.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.replace("hello world", "world", "DuploJS");
// La valeur obtenue est "hello DuploJS".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	"hello world",
	DString.replace("world", ({ matchedValue }) => DString.toUpperCase(matchedValue)),
);
// Le replacer reçoit les informations structurées sur la correspondance.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
