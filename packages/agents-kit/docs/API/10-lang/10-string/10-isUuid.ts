/**
 * @title DString.isUuid
 *
 * Vérifier qu'une chaîne respecte le format UUID pris en charge.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const value: string;

if (DString.isUuid(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DString.Uuid, "strict">;
}

const result = DString.isUuid("550e8400-e29b-41d4-a716-446655440000");
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
