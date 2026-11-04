/**
 * @title DString.trimStart
 *
 * Supprimer les espaces au début d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.trimStart("  DuploJS  ");
// La valeur obtenue est "DuploJS  ".
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.MaxCharacters<11>, "strict">;

const piped = DCommon.pipe(
	"  DuploJS  ",
	DString.trimStart,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.MaxCharacters<11>, "strict">;
