/**
 * @title DString.trimEnd
 *
 * Supprimer les espaces à la fin d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.trimEnd("  DuploJS  ");
// La valeur obtenue est "  DuploJS".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<11>, "strict">;

const piped = DCommon.pipe(
	"  DuploJS  ",
	DString.trimEnd,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<11>, "strict">;
