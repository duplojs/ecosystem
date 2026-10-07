/**
 * @title Acquisition des contraintes.
 *
 * Vérification runtime et narrowing vers un type contraint.
 */
import * as DNumber from "@duplojs/lang/number";

// Une contrainte existe uniquement dans le typage : elle ne modifie ni ne valide la valeur.
// L’intersection compose ici deux garanties établies par les predicates.
type Age = number & DNumber.Integer & DNumber.Positive;

// @ts-expect-error Le littéral seul ne porte pas les contraintes attendues.
const age: Age = 12;

// Chaque vérification réussie enrichit le type sans changer la valeur runtime.
const maybeAge = 12;
if (
	DNumber.isInteger(maybeAge)
	&& DNumber.isPositive(maybeAge)
) {
	const age: Age = maybeAge;
}
