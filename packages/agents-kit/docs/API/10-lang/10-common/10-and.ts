/**
 * @title DCommon.and
 *
 * Combiner plusieurs prédicats dans une condition qui doit tous les satisfaire.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

// Appel classique : les deux predicates doivent accepter la valeur.
const result = DCommon.and("duplojs", [
	DCommon.isType("string"),
	DCommon.truthy,
]);

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const source: string | number;

// Appel curifié : le predicate composé est passé directement à DCommon.when.
const transformed = DCommon.pipe(
	source,
	DCommon.when(
		DCommon.and([
			DCommon.isType("string"),
			DCommon.truthy,
		]),
		(value) => {
			type _CheckValue = DCommon.ExpectType<
				typeof value,
				string,
				"strict"
			>;

			return DString.toUpperCase(value);
		},
	),
);

// La sortie est la source en majuscules si elle est une chaîne non vide, sinon la source inchangée.
type _CheckTransformed = DCommon.ExpectType<
	typeof transformed,
	number | Uppercase<string>,
	"strict"
>;
