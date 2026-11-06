/**
 * @title DPattern.exhaustive
 *
 * Terminer un traitement exhaustif en extrayant les valeurs des PatternResult.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DNumber from "@duplojs/lang/number";

// exhaustive n’accepte que des PatternResult : tous les cas doivent déjà être traités.
declare const input: string | number;
const value = DCommon.pipe(
	input,
	DPattern.when(
		DCommon.isType("string"),
		DString.toUpperCase,
	),
	DPattern.when(
		DCommon.isType("number"),
		(number) => DNumber.sum([number, 1]),
	),
	DPattern.exhaustive,
);
// Une chaîne donne sa version majuscule ; un nombre est augmenté de 1.
type _CheckValue = DCommon.ExpectType<typeof value, Uppercase<string> | number, "strict">;
