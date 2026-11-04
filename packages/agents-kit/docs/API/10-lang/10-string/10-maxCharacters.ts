/**
 * @title DString.maxCharacters
 *
 * Tester ou établir une longueur maximale pour une chaîne.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DString.maxCharacters("Duplo", 10);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const value: string;

const transformed = DCommon.pipe(
	value,
	DCommon.when(
		DString.maxCharacters(10),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, string & DString.MaxCharacters<10>, "strict">;
			return DString.length(value);
		},
	),
);
// La branche vraie peut exploiter la longueur maximale établie par le predicate.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
