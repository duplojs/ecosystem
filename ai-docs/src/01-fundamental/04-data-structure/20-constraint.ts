/**
 * @title Les contraintes dans les `DataStructures`.
 *
 * Une `Structure` décrit d'abord la nature de la donnée puis peut lui appliquer
 * des contraintes supplémentaires.
 *
 * Les contraintes sont vérifiées au runtime et leur résultat est également
 * reporté dans le type produit par `StructureValue`.
 *
 * Toutes les structures peuvent recevoir des contraintes, à condition que
 * celles-ci soient compatibles avec la donnée représentée.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

// string & DString.Email
const emailStructure = DDataStructure.string([DDataStructure.email()]);

// Une contrainte ne remplace pas le type de base.
// Elle apporte une information supplémentaire garantie après validation.

// number & DNumber.Integer & DNumber.GreaterThanOrEqual<18>
const ageStructure = DDataStructure.number([
	DDataStructure.integer(),
	DDataStructure.greaterThanOrEqual(18),
]);

// Plusieurs contraintes peuvent être cumulées.
// Toutes doivent être vérifiées pour que la donnée soit valide.

// string & DString.MinCharacters<3> & DString.Trimmed
const usernameStructure = DDataStructure.string([
	DDataStructure.minCharacters(3),
	DDataStructure.trimmed(),
]);

// Les contraintes ne concernent pas uniquement les `TypeStructure`.
// Elles peuvent s'appliquer aux autres structures comme les tableaux.

// readonly string[] & DArray.MinElements<1>
const tagsStructure = DDataStructure.array(
	DDataStructure.string(),
	[DDataStructure.minElements(1)],
);

// Une contrainte peut également être ajoutée après la création d'une structure.
// La structure originale n'est pas modifiée.

// string
const stringStructure = DDataStructure.string();

// string & DString.Email
const constrainedStringStructure = stringStructure.addConstraint(
	DDataStructure.email(),
);

// `refine` permet de définir une contrainte spécifique au domaine.
// Un type predicate permet également d'affiner le type produit par la structure.

type UserId = `user:${string}`;

// `user:${string}`
const userIdStructure = DDataStructure.string([
	DDataStructure.refine(
		(value): value is UserId => value.startsWith("user:"),
	),
]);

// Une contrainte ne peut être utilisée que sur une structure compatible.

// @ts-expect-error `positive` est une contrainte de nombre.
DDataStructure.string([DDataStructure.positive()]);

// @ts-expect-error `email` est une contrainte de string.
DDataStructure.number([DDataStructure.email()]);

// La compatibilité est également vérifiée avec `addConstraint`.

// @ts-expect-error une structure de tableau ne peut pas recevoir une contrainte de string.
DDataStructure.array(DDataStructure.string()).addConstraint(DDataStructure.email());
