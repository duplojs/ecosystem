/**
 * @title Discrimination selon le fait courant.
 *
 * Choisir une branche selon la Fact portée par une valeur et accéder aux données du fait.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";

// Une Fact appliquée à une entité y conserve son nom et sa payload.
// La sélection porte sur ce fait courant, même lorsque toutes les variantes sont la même Entity.
interface UserCreatedFact extends DModeling.Fact<
	"UserCreated",
	{
		name: string;
	}
> {}

interface UserDeletedFact extends DModeling.Fact<
	"UserDeleted",
	{
		reason: string;
	}
> {}

type UserCreated = (
	& DModeling.Entity<"User">
	& {
		readonly id: string;
	}
	& UserCreatedFact
);

type UserDeleted = (
	& DModeling.Entity<"User">
	& {
		readonly id: string;
	}
	& UserDeletedFact
);

type User =
	| UserCreated
	| UserDeleted;

declare const user: User;

// `matchWithFact` discrimine une union à partir du nom de la `Fact`
// portée par chaque valeur.
//
// La sélection est exhaustive : chaque fact présente dans l'union
// doit posséder un handler.
//
// Chaque callback reçoit directement la valeur avec la `Fact` précise
// correspondant au nom sélectionné. La payload est accessible sur cette valeur avec factKind.
// Cette lecture fonctionne dans les formes directe et curifiée.

// string | number
const matchedFact = DPattern.matchWithFact(
	user,
	{
		// UserCreated
		UserCreated: (createdUser) => (
			DModeling.factKind.getValue(createdUser).payload.name
		),

		// UserDeleted
		UserDeleted: (deletedUser) => (
			DModeling.factKind.getValue(deletedUser).payload.reason.length
		),
	},
);

// La sélection exhaustive crée un point d'ancrage dans le typage.
//
// Si une nouvelle `Fact` est ajoutée à l'union, le matcher devra
// également définir son traitement.
//
// À l'inverse, une clé ne correspondant à aucune fact de l'union
// ne peut pas être ajoutée au matcher.

// `matchWithFact` possède également une forme curried afin d'être
// directement utilisée dans un pipe.

// string | number
const matchedFactInPipe = DCommon.pipe(
	user,
	DPattern.matchWithFact({
		// UserCreated
		UserCreated: (createdUser) => (
			DModeling.factKind.getValue(createdUser).payload.name
		),

		// UserDeleted
		UserDeleted: (deletedUser) => (
			DModeling.factKind.getValue(deletedUser).payload.reason.length
		),
	}),
);

// `matchWithFactOtherwise` permet de ne sélectionner explicitement
// qu'une partie des facts.
//
// `otherwise` reçoit uniquement les valeurs portant les facts
// qui n'ont pas déjà été prises en charge par le matcher.

// string | UserDeleted
const matchedFactOtherwise = DPattern.matchWithFactOtherwise(
	user,
	{
		// UserCreated
		UserCreated: (createdUser) => (
			DModeling.factKind.getValue(createdUser).payload.name
		),
	},
	// UserDeleted
	(deletedUser) => (
		deletedUser
	),
);

// La forme curried est également disponible.
//
// Le typage de `otherwise` évolue avec les handlers déjà déclarés.
// Il représente toujours précisément le reste de l'union de facts.

// string | UserDeleted
const matchedFactOtherwiseInPipe = DCommon.pipe(
	user,
	DPattern.matchWithFactOtherwise(
		{
			// UserCreated
			UserCreated: (createdUser) => (
				DModeling.factKind.getValue(createdUser).payload.name
			),
		},
		// UserDeleted
		(deletedUser) => (
			deletedUser
		),
	),
);
