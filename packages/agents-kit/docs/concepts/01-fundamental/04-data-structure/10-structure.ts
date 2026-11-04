/**
 * @title Composition des contrats de données.
 *
 * Construire et réutiliser des structures pour décrire des données simples ou composées.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Une Structure associe un type TypeScript à une représentation capable de vérifier la donnée.
// Une TypeStructure repose sur un Type ; les autres structures composent plusieurs contrats.

const nameStructure = DDataStructure.string();
type _CheckNameStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof nameStructure>, string, "strict">;

const ageStructure = DDataStructure.number();
type _CheckAgeStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof ageStructure>, number, "strict">;

const activeStructure = DDataStructure.boolean();
type _CheckActiveStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof activeStructure>,
	boolean,
	"strict"
>;

// Les structures simples comme `string`, `number` ou `boolean` sont des
// `TypeStructure`. Elles représentent directement un type fondamental.

const userKindStructure = DDataStructure.literal("user");
type _CheckUserKindStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof userKindStructure>,
	"user",
	"strict"
>;

// `literal` produit également une `TypeStructure` lorsqu'une seule valeur
// est représentée.

const roleStructure = DDataStructure.literal([
	"admin",
	"member",
	"guest",
]);
type _CheckRoleStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof roleStructure>, "admin" | "member" | "guest", "strict">;

// Lorsque plusieurs valeurs sont représentées, `literal` construit une
// `UnionStructure` composée de plusieurs `TypeStructure`.

const addressStructure = DDataStructure.object({
	street: DDataStructure.string(),
	city: DDataStructure.string(),
	zipCode: DDataStructure.string(),
});
type _CheckAddressStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof addressStructure>,
	{
		readonly street: string;
		readonly city: string;
		readonly zipCode: string;
	},
	"strict"
>;

// `ObjectStructure` compose plusieurs structures pour représenter les
// propriétés d'un objet.

const userStructure = DDataStructure.object({
	name: nameStructure,
	age: ageStructure,
	active: activeStructure,
	role: roleStructure,
	address: addressStructure,
});
type _CheckUserStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof userStructure>,
	{
		readonly name: string;
		readonly age: number;
		readonly active: boolean;
		readonly role: "admin" | "member" | "guest";
		readonly address: DDataStructure.StructureValue<typeof addressStructure>;
	},
	"strict"
>;

// Une structure déjà définie peut et doit être réutilisée pour construire
// des structures plus complexes.

const usersStructure = DDataStructure.array(
	userStructure,
);
type _CheckUsersStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof usersStructure>,
	readonly DDataStructure.StructureValue<typeof userStructure>[],
	"strict"
>;

// `array` applique une même structure à chaque élément du tableau.

const profileStructure = DDataStructure.object({
	name: DDataStructure.string(),
	bio: DDataStructure.optional(
		DDataStructure.string(),
	),
});
type _CheckProfileStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof profileStructure>,
	{
		readonly name: string;
		readonly bio?: string | undefined;
	},
	"strict"
>;

type Profile = DDataStructure.StructureValue<typeof profileStructure>;

// `optional` ajoute `undefined` à une structure.
// Dans un `ObjectStructure`, cela permet également d'omettre la propriété.

const sessionStructure = DDataStructure.object({
	user: DDataStructure.nullable(
		userStructure,
	),
});
type _CheckSessionStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof sessionStructure>,
	{ readonly user: DDataStructure.StructureValue<typeof userStructure> | null },
	"strict"
>;

// `nullable` ajoute `null` à une structure sans rendre la propriété optionnelle.

const identifierStructure = DDataStructure.union([
	DDataStructure.string(),
	DDataStructure.number(),
]);
type _CheckIdentifierStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof identifierStructure>,
	string | number,
	"strict"
>;

// `union` représente plusieurs structures possibles.

const eventStructure = DDataStructure.union([
	DDataStructure.object({
		type: DDataStructure.literal("user-created"),
		user: userStructure,
	}),
	DDataStructure.object({
		type: DDataStructure.literal("user-deleted"),
		userId: identifierStructure,
	}),
]);
interface UserCreatedEvent {
	readonly type: "user-created";
	readonly user: DDataStructure.StructureValue<typeof userStructure>;
}
interface UserDeletedEvent {
	readonly type: "user-deleted";
	readonly userId: string | number;
}
type _CheckEventStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof eventStructure>,
	UserCreatedEvent | UserDeletedEvent,
	"strict"
>;

// Les unions peuvent représenter plusieurs formes d'objets.
// Des valeurs littérales peuvent être utilisées pour créer une union discriminée.

const translationsStructure = DDataStructure.record(
	DDataStructure.literal([
		"fr",
		"en",
	]),
	DDataStructure.string(),
);
type _CheckTranslationsStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof translationsStructure>,
	{
		readonly fr: string;
		readonly en: string;
	},
	"strict"
>;

// `record` représente un objet dont les clés possibles et les valeurs
// sont elles-mêmes décrites par des structures.

const updateUserStructure = DDataStructure.partial(
	userStructure,
);
type _CheckUpdateUserStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof updateUserStructure>,
	{
		readonly name?: string | undefined;
		readonly age?: number | undefined;
		readonly active?: boolean | undefined;
		readonly role?: "admin" | "member" | "guest" | undefined;
		readonly address?: DDataStructure.StructureValue<typeof addressStructure> | undefined;
	},
	"strict"
>;

// `partial` transforme toutes les propriétés d'un `ObjectStructure`
// en propriétés optionnelles.

const requiredProfileStructure = DDataStructure.required(
	profileStructure,
);
type _CheckRequiredProfileStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof requiredProfileStructure>,
	{
		readonly name: string;
		readonly bio: string;
	},
	"strict"
>;

// `required` réalise l'opération inverse et rend les propriétés obligatoires.

const persistedUserStructure = DDataStructure.extend(
	userStructure,
	{
		id: identifierStructure,
		createdAt: DDataStructure.string(),
	},
);
type _CheckPersistedUserStructure = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof persistedUserStructure>,
	{
		readonly name: string;
		readonly age: number;
		readonly active: boolean;
		readonly role: "admin" | "member" | "guest";
		readonly address: DDataStructure.StructureValue<typeof addressStructure>;
		readonly id: string | number;
		readonly createdAt: string;
	},
	"strict"
>;

// `extend` crée un nouvel `ObjectStructure` en ajoutant des propriétés
// à une structure objet existante.
