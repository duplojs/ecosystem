/**
 * @title DCommon.asserts
 *
 * Affirmer une contrainte de type et lever une erreur si le prédicat échoue.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | number;

DCommon.asserts(input, DCommon.isType("string"));

// Après l’assertion, input est garanti comme une chaîne.
type _CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
