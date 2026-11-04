/**
 * @title DString.isEmail
 *
 * Vérifier qu'une chaîne respecte le format d'une adresse e-mail.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isEmail(value)) {
	// Le test établit la contrainte Email dans cette branche.
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Email, "strict">;
}

const result = DString.isEmail("contact@duplojs.dev");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
