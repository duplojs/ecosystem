/**
 * @title DString.isUrl
 *
 * Vérifier qu'une chaîne est une URL valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isUrl(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Url, "strict">;
}

const result = DString.isUrl("https://duplojs.dev");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
