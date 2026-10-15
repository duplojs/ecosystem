/**
 * @title Composition des contrats de données.
 *
 * Construire et réutiliser des structures pour décrire des données simples ou composées.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Une Structure associe un type TypeScript à une représentation capable de vérifier la donnée.
// Une TypeStructure repose sur un Type ; les autres structures composent plusieurs contrats.

// string
const nameStructure = DDataStructure.string();

// number
const ageStructure = DDataStructure.number();

// boolean
const activeStructure = DDataStructure.boolean();

// Les structures simples comme `string`, `number` ou `boolean` sont des
// `TypeStructure`. Elles représentent directement un type fondamental.

// "user"
const userKindStructure = DDataStructure.literal("user");

// `literal` produit également une `TypeStructure` lorsqu'une seule valeur
// est représentée.

// "admin" | "member" | "guest"
const roleStructure = DDataStructure.literal([
	"admin",
	"member",
	"guest",
]);

// Lorsque plusieurs valeurs sont représentées, `literal` construit une
// `UnionStructure` composée de plusieurs `TypeStructure`.

// {
//     readonly street: string;
//     readonly city: string;
//     readonly zipCode: string;
// }
const addressStructure = DDataStructure.object({
	street: DDataStructure.string(),
	city: DDataStructure.string(),
	zipCode: DDataStructure.string(),
});

// `ObjectStructure` compose plusieurs structures pour représenter les
// propriétés d'un objet.

// {
//     readonly name: string;
//     readonly age: number;
//     readonly active: boolean;
//     readonly role: "admin" | "member" | "guest";
//     readonly address: Address;
// }
const userStructure = DDataStructure.object({
	name: nameStructure,
	age: ageStructure,
	active: activeStructure,
	role: roleStructure,
	address: addressStructure,
});

// Une structure déjà définie peut et doit être réutilisée pour construire
// des structures plus complexes.

// readonly User[]
const usersStructure = DDataStructure.array(
	userStructure,
);

// `array` applique une même structure à chaque élément du tableau.

// {
//     readonly name: string;
//     readonly bio?: string | undefined;
// }
const profileStructure = DDataStructure.object({
	name: DDataStructure.string(),
	bio: DDataStructure.optional(
		DDataStructure.string(),
	),
});

type Profile = DDataStructure.StructureValue<typeof profileStructure>;

// `optional` ajoute `undefined` à une structure.
// Dans un `ObjectStructure`, cela permet également d'omettre la propriété.

// {
//     readonly user: User | null;
// }
const sessionStructure = DDataStructure.object({
	user: DDataStructure.nullable(
		userStructure,
	),
});

// `nullable` ajoute `null` à une structure sans rendre la propriété optionnelle.

// string | number
const identifierStructure = DDataStructure.union([
	DDataStructure.string(),
	DDataStructure.number(),
]);

// `union` représente plusieurs structures possibles.

// {
//     readonly type: "user-created";
//     readonly user: User;
// }
// |
// {
//     readonly type: "user-deleted";
//     readonly userId: string | number;
// }
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

// Les unions peuvent représenter plusieurs formes d'objets.
// Des valeurs littérales peuvent être utilisées pour créer une union discriminée.

// {
//     readonly fr: string;
//     readonly en: string;
// }
const translationsStructure = DDataStructure.record(
	DDataStructure.literal([
		"fr",
		"en",
	]),
	DDataStructure.string(),
);

// `record` représente un objet dont les clés possibles et les valeurs
// sont elles-mêmes décrites par des structures.

// {
//     readonly name?: string | undefined;
//     readonly age?: number | undefined;
//     readonly active?: boolean | undefined;
//     readonly role?: "admin" | "member" | "guest" | undefined;
//     readonly address?: Address | undefined;
// }
const updateUserStructure = DDataStructure.partial(
	userStructure,
);

// `partial` transforme toutes les propriétés d'un `ObjectStructure`
// en propriétés optionnelles.

// {
//     readonly name: string;
//     readonly bio: string;
// }
const requiredProfileStructure = DDataStructure.required(
	profileStructure,
);

// `required` réalise l'opération inverse et rend les propriétés obligatoires.

// {
//     readonly name: string;
//     readonly age: number;
//     readonly active: boolean;
//     readonly role: "admin" | "member" | "guest";
//     readonly address: Address;
//     readonly id: string | number;
//     readonly createdAt: string;
// }
const persistedUserStructure = DDataStructure.extend(
	userStructure,
	{
		id: identifierStructure,
		createdAt: DDataStructure.string(),
	},
);

// `extend` crée un nouvel `ObjectStructure` en ajoutant des propriétés
// à une structure objet existante.
