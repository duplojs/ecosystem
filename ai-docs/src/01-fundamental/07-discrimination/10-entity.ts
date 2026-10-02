/**
 * @title Discrimination des `Entity`.
 *
 * Les `Entity` possèdent une identité associée à leur nom.
 *
 * Le domaine `pattern` permet d'utiliser cette identité pour discriminer
 * une union d'entités sans dépendre de leur structure ou de leurs propriétés.
 *
 * `matchWithEntity` réalise une discrimination exhaustive.
 * `matchWithEntityOtherwise` permet de ne traiter explicitement
 * qu'une partie des entités et de regrouper les autres dans un fallback.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";

interface User extends DModeling.Entity<"User"> {
	readonly id: string;
	readonly name: string;
}

interface Admin extends DModeling.Entity<"Admin"> {
	readonly id: string;
	readonly permissions: readonly string[];
}

type Entity =
	| User
	| Admin;

declare const entity: Entity;

// `matchWithEntity` discrimine une union à partir du nom de chaque `Entity`.
//
// La sélection est exhaustive : chaque entité présente dans l'union
// doit posséder un handler.
//
// Chaque callback reçoit directement le type précis correspondant
// au nom de l'entité.

// string | number
const matchedEntity = DPattern.matchWithEntity(
	entity,
	{
		// User
		User: (user) => user.name,

		// Admin
		Admin: (admin) => admin.permissions.length,
	},
);

// La sélection exhaustive crée un point d'ancrage dans le typage.
//
// Si une nouvelle `Entity` est ajoutée à l'union, le matcher devra
// également définir son traitement.
//
// À l'inverse, une clé ne correspondant à aucune entité de l'union
// ne peut pas être ajoutée au matcher.

// `matchWithEntity` possède également une forme curried afin d'être
// directement utilisée dans un pipe.

// string | number
const matchedEntityInPipe = DCommon.pipe(
	entity,
	DPattern.matchWithEntity({
		// User
		User: (user) => user.name,

		// Admin
		Admin: (admin) => admin.permissions.length,
	}),
);

// `matchWithEntityOtherwise` permet de ne sélectionner explicitement
// qu'une partie des entités.
//
// `otherwise` reçoit uniquement les entités qui n'ont pas déjà
// été prises en charge par le matcher.

// string | number
const matchedEntityOtherwise = DPattern.matchWithEntityOtherwise(
	entity,
	{
		// User
		User: (user) => user.name,
	},
	// Admin
	(admin) => admin.permissions.length,
);

// La forme curried est également disponible.
//
// Le typage de `otherwise` évolue avec les handlers déjà déclarés.
// Il représente toujours précisément le reste de l'union.

// string | number
const matchedEntityOtherwiseInPipe = DCommon.pipe(
	entity,
	DPattern.matchWithEntityOtherwise(
		{
			// User
			User: (user) => user.name,
		},
		// Admin
		(admin) => admin.permissions.length,
	),
);
