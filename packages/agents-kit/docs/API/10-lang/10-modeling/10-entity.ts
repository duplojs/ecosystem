/**
 * @title DModeling — Entity
 *
 * Déclarer une entité métier, hydrater ses données et reconstruire sa valeur au cours de son cycle de vie.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";

// Une entité porte une identité et une shape métier stable au fil de son cycle de vie :
// création, modifications et éventuellement destruction. Ses transitions sont définies
// par le domaine ; la structure seule ne les exécute pas.
export namespace User {
	const namespace = DModeling.createEntityNamespace("User");
	export const Id = namespace.createNewType("Id", DDataStructure.string());
	export const Name = namespace.createNewType("Name", DDataStructure.string(), [DDataStructure.minCharacters(2)]);
	export type Id = DDataStructure.StructureValue<typeof Id>;
	export type Name = DDataStructure.StructureValue<typeof Name>;

	export const ActiveState = DModeling.createTaggedObject("Active", {});
	export const SuspendedState = DModeling.createTaggedObject("Suspended", {});
	export type ActiveState = DDataStructure.StructureValue<typeof ActiveState>;
	export type SuspendedState = DDataStructure.StructureValue<typeof SuspendedState>;

	// La shape combine ici NewType et objets tagués. Le nom du namespace
	// préfixe les NewType et devient l'identité de l'entité.
	export const Entity = namespace.createEntity(() => ({
		id: Id,
		name: Name,
		state: DDataStructure.union([ActiveState, SuspendedState]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
}
type _CheckUser = DCommon.ExpectType<
	User.Entity,
	DModeling.Entity<"User"> & {
		readonly id: User.Id;
		readonly name: User.Name;
		readonly state: User.ActiveState | User.SuspendedState;
	},
	"strict"
>;

// createEntity propose aussi une déclaration directe avec un nom et une shape différée.
export namespace Account {
	export const Entity = DModeling.createEntity("Account", () => ({ ownerId: User.Id }));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
}
type _CheckAccount = DCommon.ExpectType<
	Account.Entity,
	DModeling.Entity<"Account"> & { readonly ownerId: User.Id },
	"strict"
>;
export namespace Invalid {
	// @ts-expect-error Une propriété primitive de la shape doit avoir un NewType.
	export const Entity = DModeling.createEntity("Invalid", () => ({ name: DDataStructure.string() }));
}

// new construit l'entité avec des propriétés déjà typées ; il ne les valide pas.
declare const id: User.Id;
declare const name: User.Name;
const user = User.Entity.new({
	id,
	name,
	state: User.ActiveState.new({}),
});
type _CheckNew = DCommon.ExpectType<
	typeof user,
	DModeling.Entity<"User"> & {
		readonly id: User.Id;
		readonly name: User.Name;
		readonly state: User.ActiveState;
	},
	"strict"
>;

// map hydrate des propriétés brutes, ajoute l'identité et vérifie les contraintes.
// Un nom trop court produit un Left « map-error ».
const mapped = User.Entity.map({
	id: "u1",
	name: "Alice",
	state: User.ActiveState.new({}),
});
const rejected = User.Entity.map({
	id: "u1",
	name: "A",
	state: User.ActiveState.new({}),
});
type _CheckMapped = DCommon.ExpectType<
	typeof mapped,
	| DEither.Right<"map-success", User.Entity>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"map-error", DDataStructure.Error>,
	"strict"
>;
type _CheckRejected = DCommon.ExpectType<
	typeof rejected,
	typeof mapped,
	"strict"
>;

// decodeMap décode les propriétés avec les codecs avant de les hydrater.
const decoded = User.Entity.decodeMap(DDataStructure.codecsString, {
	id: "u1",
	name: "Alice",
	state: User.ActiveState.new({}),
});
const decodedInPipe = DCommon.pipe(
	{
		id: "u1",
		name: "Alice",
		state: User.ActiveState.new({}),
	},
	User.Entity.decodeMap(DDataStructure.codecsString),
);
type _CheckDecoded = DCommon.ExpectType<
	typeof decoded,
	typeof mapped,
	"strict"
>;
type _CheckDecodedInPipe = DCommon.ExpectType<
	typeof decodedInPipe,
	typeof mapped,
	"strict"
>;

// Les variantes asynchrones prennent aussi en charge les validations asynchrones.
const asyncMapped = User.Entity.asyncMap({
	id: "u1",
	name: "Alice",
	state: User.ActiveState.new({}),
});
const asyncDecoded = User.Entity.asyncDecodeMap(DDataStructure.codecsString, {
	id: "u1",
	name: "Alice",
	state: User.ActiveState.new({}),
});
const asyncDecodedInPipe = DCommon.pipe(
	{
		id: "u1",
		name: "Alice",
		state: User.ActiveState.new({}),
	},
	User.Entity.asyncDecodeMap(DDataStructure.codecsString),
);
type _CheckAsyncMapped = DCommon.ExpectType<
	typeof asyncMapped,
	Promise<DEither.Right<"map-success", User.Entity> | DEither.Left<"map-error", DDataStructure.Error>>,
	"strict"
>;
type _CheckAsyncDecoded = DCommon.ExpectType<
	typeof asyncDecoded,
	typeof asyncMapped,
	"strict"
>;

type _CheckAsyncDecodedInPipe = DCommon.ExpectType<
	typeof asyncDecodedInPipe,
	typeof asyncMapped,
	"strict"
>;

// Les flags certifient une condition de l'entité courante après sa vérification.
// Une transition métier utilise update dans un fait, puis établit les nouvelles preuves.
type ActiveFlag = DModeling.Flag<"Active", User.ActiveState>;
declare const activeUser: User.Entity & ActiveFlag;
declare const replacementName: User.Name | undefined;
const updated = User.Entity.update(activeUser, { name: replacementName });
const updatedInPipe = DCommon.pipe(
	activeUser,
	User.Entity.update({ name: replacementName }),
);
// update conserve la valeur précédente pour une propriété mise à undefined ; il ne valide
// pas les nouvelles valeurs et reconstruit la shape sans les flags ou faits précédents.
type _CheckUpdated = DCommon.ExpectType<
	typeof updated,
	User.Entity,
	"strict"
>;
type _CheckUpdatedInPipe = DCommon.ExpectType<
	typeof updatedInPipe,
	User.Entity,
	"strict"
>;
