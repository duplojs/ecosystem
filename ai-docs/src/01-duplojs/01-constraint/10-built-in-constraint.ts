/**
 * @title Utiliser les contraintes fournies
 *
 * DuploJS fournit des contraintes pour les cas courants.
 * Avant de définir une nouvelle contrainte, vérifier si une contrainte
 * existante représente déjà la propriété recherchée.
 *
 * Elles couvrent notamment les number, string, array,
 * et autres propriétés courantes.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DNumber from "@duplojs/lang/number";
import type * as DString from "@duplojs/lang/string";

type Name = (
	& string
	& DString.MaxCharacters<35>
	& DString.MinCharacters<5>
	& DString.Trimmed
);

type Age = (
	& number
	& DNumber.Integer
	& DNumber.StrictPositive
	& DNumber.GreaterThanOrEqual<18>
	& DNumber.LessThan<100>
);

type Friends = (
	& {
		name: Name;
		age: Age;
	}[]
	& DArray.MinElements<1>
	& DArray.MaxElements<15>
);
