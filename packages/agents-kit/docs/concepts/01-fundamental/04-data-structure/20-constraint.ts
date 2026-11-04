/**
 * @title Contraintes de validation dans les structures.
 *
 * Ajouter et cumuler des contraintes compatibles, fournies ou personnalisées.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DString from "@duplojs/lang/string";
import type * as DNumber from "@duplojs/lang/number";
import type * as DArray from "@duplojs/lang/array";

// Une structure vérifie la nature de la donnée, puis ses propriétés supplémentaires.
// Les contraintes sont vérifiées au runtime et enrichissent le type obtenu par StructureValue.
// Toute structure peut en recevoir, à condition que la contrainte soit compatible.

const emailStructure = DDataStructure.string([DDataStructure.email()]);
type _CheckEmailStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof emailStructure>,
	string & DString.Email,
	"strict"
>;

// Une contrainte ne remplace pas le type de base.
// Elle apporte une information supplémentaire garantie après validation.

const ageStructure = DDataStructure.number([
	DDataStructure.integer(),
	DDataStructure.greaterThanOrEqual(18),
]);
type _CheckAgeStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof ageStructure>,
	number & DNumber.Integer & DNumber.GreaterThanOrEqual<18>,
	"strict"
>;

type Age = DDataStructure.StructureValue<typeof ageStructure>;

// Plusieurs contraintes peuvent être cumulées.
// Toutes doivent être vérifiées pour que la donnée soit valide.

const usernameStructure = DDataStructure.string([
	DDataStructure.minCharacters(3),
	DDataStructure.trimmed(),
]);
type _CheckUsernameStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof usernameStructure>, string & DString.MinCharacters<3> & DString.Trimmed, "strict">;

// Les contraintes ne concernent pas uniquement les `TypeStructure`.
// Elles peuvent s'appliquer aux autres structures comme les tableaux.

const tagsStructure = DDataStructure.array(
	DDataStructure.string(),
	[DDataStructure.minElements(1)],
);
type _CheckTagsStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof tagsStructure>, readonly string[] & DArray.MinElements<1>, "strict">;

// Une contrainte peut également être ajoutée après la création d'une structure.
// La structure originale n'est pas modifiée.

const stringStructure = DDataStructure.string();
type _CheckStringStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof stringStructure>, string, "strict">;

const constrainedStringStructure = stringStructure.addConstraint(
	DDataStructure.email(),
);
type _CheckConstrainedStringStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof constrainedStringStructure>, string & DString.Email, "strict">;

// `refine` permet de définir une contrainte spécifique au domaine.
// Un type predicate permet également d'affiner le type produit par la structure.

type UserId = `user:${string}`;

const userIdStructure = DDataStructure.string([DDataStructure.refine(DString.startsWith("user:"))]);
type _CheckUserIdStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof userIdStructure>, UserId, "strict">;

// Une contrainte ne peut être utilisée que sur une structure compatible.

// @ts-expect-error `positive` est une contrainte de nombre.
DDataStructure.string([DDataStructure.positive()]);

// @ts-expect-error `email` est une contrainte de string.
DDataStructure.number([DDataStructure.email()]);

// La compatibilité est également vérifiée avec `addConstraint`.

// @ts-expect-error une structure de tableau ne peut pas recevoir une contrainte de string.
DDataStructure.array(DDataStructure.string()).addConstraint(DDataStructure.email());
