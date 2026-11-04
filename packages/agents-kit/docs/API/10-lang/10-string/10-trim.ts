/**
 * @title DString.trim
 *
 * Supprimer les espaces au début et à la fin d'une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.trim("  DuploJS  ");
// La valeur obtenue est "DuploJS" et elle est marquée comme Trimmed.
type _CheckResult = DCommon.ExpectType<typeof result, string & DString.Trimmed & DString.MaxCharacters<11>, "strict">;

const piped = DCommon.pipe(
	"  DuploJS  ",
	DString.trim,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string & DString.Trimmed & DString.MaxCharacters<11>, "strict">;
