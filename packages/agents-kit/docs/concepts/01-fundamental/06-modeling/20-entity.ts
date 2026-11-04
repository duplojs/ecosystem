/**
 * @title Entités métier et hydratation.
 *
 * Déclarer les propriétés métier, hydrater les données externes et mettre à jour les valeurs typées.
 */
import * as DEither from "@duplojs/lang/either";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";
import type * as DNumber from "@duplojs/lang/number";

// Une Entity représente un objet métier doté d’une identité explicite.
// Ses valeurs primitives sont définies par des NewType qui associent un sens métier
// et des contraintes à leur représentation. Des collections, objets imbriqués,
// autres Entity ou TaggedObject peuvent également composer la shape.
export namespace User {
	// Un namespace d'entité permet de regrouper la définition de l'entité
	// et de ses `NewType`.
	//
	// Les noms des `NewType` créés avec ce namespace sont automatiquement
	// préfixés par le nom de l'entité.
	const namespace = DModeling.createEntityNamespace("User");

	export const Id = namespace.createNewType(
		"Id",
		DDataStructure.string(),
		[DDataStructure.uuid()],
	);
	export type Id = DDataStructure.StructureValue<typeof Id>;
	type _CheckId = DCommon.ExpectType<Id, string & DModeling.NewType<"UserId", DString.Uuid>, "strict">;

	export const Age = namespace.createNewType(
		"Age",
		DDataStructure.number(),
		[
			DDataStructure.integer(),
			DDataStructure.positive(),
		],
	);
	export type Age = DDataStructure.StructureValue<typeof Age>;
	type _CheckAge = DCommon.ExpectType<
		Age,
		number & DModeling.NewType<"UserAge", DNumber.Integer | DNumber.Positive>,
		"strict"
	>;

	export const Name = namespace.createNewType(
		"Name",
		DDataStructure.string(),
		[
			DDataStructure.trimmed(),
			DDataStructure.minCharacters(3),
			DDataStructure.maxCharacters(45),
		],
	);
	export type Name = DDataStructure.StructureValue<typeof Name>;
	type _CheckName = DCommon.ExpectType<
		Name,
		string & DModeling.NewType<"UserName", DString.Trimmed | DString.MinCharacters<3> | DString.MaxCharacters<45>>,
		"strict"
	>;

	export const Tag = namespace.createNewType(
		"Tag",
		DDataStructure.string(),
		[
			DDataStructure.trimmed(),
			DDataStructure.minCharacters(2),
			DDataStructure.maxCharacters(20),
		],
	);
	export type Tag = DDataStructure.StructureValue<typeof Tag>;
	type _CheckTag = DCommon.ExpectType<Tag, string & DModeling.NewType<"UserTag", DString.Trimmed | DString.MinCharacters<2> | DString.MaxCharacters<20>>, "strict">;

	// L'entité est ensuite déclarée à partir de ses différentes propriétés.
	//
	export const Entity = namespace.createEntity(
		() => ({
			id: Id,
			age: Age,
			name: Name,
			tags: DDataStructure.array(Tag),
		}),
	);
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
	type _CheckEntity = DCommon.ExpectType<Entity, DModeling.Entity<"User"> & {
		readonly id: Id;
		readonly age: Age;
		readonly name: Name;
		readonly tags: readonly Tag[];
	}, "strict">;
}

// L’hydratation fait entrer dans le modèle métier des données de repository ou de base de données.
// Une donnée provenant d’un système externe possède généralement un typage
// amoindri par rapport au modèle métier.
//
// Les contraintes et les `NewType` ne sont plus présents, mais les types
// primitifs restent connus.
//
// `map` permet d'hydrater l'entité depuis cette représentation.
//
// Les contraintes sont vérifiées pendant cette opération.
// Le mapping pouvant échouer, son résultat est représenté par un `Either`.

const maybeMapUser = User.Entity.map({
	id: "invalid-id",
	name: "SuperName",
	age: 12,
	tags: ["superTag"],
});
type _CheckMaybeMapUser = DCommon.ExpectType<typeof maybeMapUser, DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error> | DEither.Right<"map-success", User.Entity>, "strict">;

// `decodeMap` applique le même principe à une donnée encodée.
//
// La représentation demandée en entrée dépend des codecs utilisés.
// Avec `codecsString`, les types fondamentaux qui possèdent une représentation
// string sont attendus sous cette forme.
//
// L'âge de l'entité est donc ici fourni dans sa représentation encodée
// plutôt que directement comme un `number`.

const maybeDecodeMapUser = User.Entity.decodeMap(DDataStructure.codecsString, {
	id: "550e8400-e29b-41d4-a716-446655440000",
	name: "SuperName",
	age: DCommon.cast("12"),
	tags: ["superTag"],
});
type _CheckMaybeDecodeMapUser = DCommon.ExpectType<typeof maybeDecodeMapUser, DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error> | DEither.Right<"map-success", User.Entity>, "strict">;

// `new` est utilisé lorsque les propriétés possèdent déjà leur typage métier.
//
// Ici, chaque `NewType` est d'abord hydraté individuellement avec `map`.
// `DEither.group` regroupe ensuite les différentes opérations avant de fournir
// leurs valeurs à `User.Entity.new`.
//
// `new` n'effectue donc pas lui-même le mapping des propriétés.
// Il construit l'entité à partir de valeurs déjà correctement typées.
//
// Le résultat du `rightPipe` conserve la monade `Success` produite après
// regroupement des différentes validations.

const maybeUser = DEither.rightPipe(
	DEither.group({
		id: User.Id.map("550e8400-e29b-41d4-a716-446655440000"),
		name: User.Name.map("SuperName"),
		age: User.Age.map(24),
		tags: DEither.rightPipe(
			User.Tag.map("superTag"),
			DArray.coalescing,
		),
	}),
	User.Entity.new,
);
type _CheckMaybeUser = DCommon.ExpectType<typeof maybeUser, DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error> | DEither.Success<DModeling.Entity<"User"> & {
	readonly id: User.Id;
	readonly name: User.Name;
	readonly age: User.Age;
	readonly tags: readonly [User.Tag];
}>, "strict">;

declare const user: User.Entity;
declare const maybeAge: User.Age | undefined;

const updatedUser = User.Entity.update(
	user,
	{
		age: maybeAge,
	},
);
type _CheckUpdatedUser = DCommon.ExpectType<typeof updatedUser, User.Entity, "strict">;

// `update` retourne une nouvelle entité en remplaçant uniquement
// les propriétés dont la nouvelle valeur n'est pas `undefined`.
//
// Contrairement à un spread classique, une valeur `undefined`
// n'écrase donc pas la valeur déjà présente sur l'entité.
//
// Si `maybeAge` vaut `undefined`, `user.age` est conservé.
// Sinon, sa valeur remplace l'âge existant.
//
// Les nouvelles valeurs ne sont pas validées par `update` :
// elles doivent déjà posséder le typage métier attendu.

// `map` et `decodeMap` existent aussi sur les `NewType`.
// Ces opérations ne sont donc pas spécifiques aux entités.
//
// Les variantes `asyncMap` et `asyncDecodeMap` permettent la même hydratation
// lorsque la structure contient des traitements asynchrones.
