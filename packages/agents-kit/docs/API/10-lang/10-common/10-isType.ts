/**
 * @title DCommon.isType
 *
 * Construire un prédicat de type à partir d’un type runtime.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const input: string | number;

// Appel classique : tester directement le type runtime.
const result = DCommon.isType(input, "string");
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : le predicate est passé directement à DCommon.when.
const transformed = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.isType("string"),
		DString.toUpperCase,
	),
);

// Seules les chaînes sont transformées.
type _CheckTransformed = DCommon.ExpectType<
	typeof transformed,
	number | Uppercase<string>,
	"strict"
>;
