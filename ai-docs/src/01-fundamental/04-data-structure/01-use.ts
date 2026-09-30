/**
 * @title Utilisation des `DataStructures`.
 *
 * Une `DataStructure` décrit la représentation attendue d'une donnée
 * à la fois au niveau TypeScript et au runtime.
 *
 * Elle est principalement utilisée aux frontières du logiciel, lorsque
 * la donnée n'est pas encore considérée comme fiable.
 *
 * Une structure permet ensuite quatre opérations principales :
 *
 * - `check` : valider une donnée déjà dans sa représentation interne ;
 * - `decode` : convertir une représentation externe vers la représentation interne ;
 * - `encode` : convertir la représentation interne vers une représentation externe ;
 * - `is` : vérifier qu'une donnée respecte la structure.
 *
 * `check`, `decode` et `encode` retournent un `Either` contenant soit
 * la donnée validée, soit une erreur structurée.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";

const componentStructure = DDataStructure.object({
	id: DDataStructure.bigint(),
	name: DDataStructure.string(),
	alt: DDataStructure.optional(
		DDataStructure.string(),
	),
	image: DDataStructure.object({
		src: DDataStructure.string([DDataStructure.url()]),
	}),
});

// Le type TypeScript correspondant à une structure peut être récupéré
// avec `StructureValue`.
//
// {
//     readonly id: bigint;
//     readonly name: string;
//     readonly alt?: string | undefined;
//     readonly image: {
//         readonly src: string & DString.Url;
//     };
// }
type Component = DDataStructure.StructureValue<typeof componentStructure>;

declare const unknownComponent: unknown;

// `check` valide une donnée déjà dans sa représentation interne.
//
// Il est principalement utilisé lorsqu'une donnée provient d'une source
// non fiable mais ne nécessite aucune transformation de représentation.
const checkResult = componentStructure.check(
	unknownComponent,
);

// `decode` transforme une représentation externe vers la représentation
// interne décrite par la structure, puis valide la donnée obtenue.
//
// Ici, `codecsJson` permet notamment de transformer `string` en `bigint`.
const decodeResult = componentStructure.decode(
	DDataStructure.codecsJson,
	{
		id: "42",
		name: "Header",
		image: {
			src: "https://duplojs.dev/image.png",
		},
	},
);

declare const component: Component;

// `encode` réalise l'opération inverse de `decode`.
//
// Il transforme une donnée interne vers la représentation attendue
// par le système externe.
//
// Ici, `codecsJson` transforme notamment `bigint` en `string`.
const encodeResult = componentStructure.encode(
	DDataStructure.codecsJson,
	component,
);

declare const value: unknown;

// `is` permet de vérifier simplement si une donnée respecte la structure.
//
// Contrairement à `check`, il ne retourne pas les détails de l'erreur.
// Il agit également comme un type predicate TypeScript.
if (componentStructure.is(value)) {
	// Component
	void value;
}

// Les opérations existent également sous forme asynchrone lorsque
// la structure contient des traitements asynchrones.
const asyncCheckResult = componentStructure.asyncCheck(
	unknownComponent,
);
