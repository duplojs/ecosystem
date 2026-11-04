/**
 * @title DString.normalize
 *
 * Normaliser une chaîne selon une forme Unicode.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.normalize("e\u0301", "NFC");
// La valeur obtenue est la représentation NFC de la chaîne.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	"e\u0301",
	DString.normalize("NFC"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
