/**
 * @title Composition des contraintes fournies.
 *
 * Réutilisation et composition des contraintes disponibles dans les domaines.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DNumber from "@duplojs/lang/number";
import type * as DString from "@duplojs/lang/string";

// Avant de créer une contrainte, vérifier celles du domaine concerné.
// Une intersection cumule les garanties ; déclarer ce type ne valide aucune donnée.
// Nom sans espaces aux extrémités, contenant entre 5 et 35 caractères.
type Name = (
	& string
	& DString.MaxCharacters<35>
	& DString.MinCharacters<5>
	& DString.Trimmed
);

// Entier strictement positif, supérieur ou égal à 18 et strictement inférieur à 100.
type Age = (
	& number
	& DNumber.Integer
	& DNumber.StrictPositive
	& DNumber.GreaterThanOrEqual<18>
	& DNumber.LessThan<100>
);

// Tableau de 1 à 15 éléments, dont chaque élément respecte aussi son contrat.
type Friends = (
	& {
		name: Name;
		age: Age;
	}[]
	& DArray.MinElements<1>
	& DArray.MaxElements<15>
);
