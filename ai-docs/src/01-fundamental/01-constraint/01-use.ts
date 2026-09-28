/**
 * @title L'utilisation des `Constraint`.
 *
 * Les contraintes existent uniquement au niveau du typage, mais elles
 * garantissent en amont l'appel de fonctions qui vérifie la contrainte au runtime.
 */
import * as DNumber from "@duplojs/lang/number";

type Age = number & DNumber.Integer & DNumber.Positive;

// @ts-expect-error Impossible d'être assigner comme tels sans vérification en amont.
const age: Age = 12;

const maybeAge = 12;
if (
	DNumber.isInteger(maybeAge)
	&& DNumber.isPositive(maybeAge)
) {
	const age: Age = maybeAge;
}
