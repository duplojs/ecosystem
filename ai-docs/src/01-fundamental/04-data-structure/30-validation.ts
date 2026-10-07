/**
 * @title Validation des données entrantes.
 *
 * Vérification, conversion et narrowing aux frontières du logiciel, en synchrone ou asynchrone.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";

// La structure décrit la donnée attendue à la fois dans TypeScript et au runtime.
// Les opérations ci-dessous s’appliquent aux frontières du logiciel, avant de considérer
// une donnée externe comme fiable.
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

// check, decode et encode retournent un Either : donnée valide ou erreur structurée.
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
// Il vérifie la donnée interne avant de la transformer vers la représentation attendue
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

// Les variantes asyncCheck, asyncDecode et asyncEncode attendent les traitements asynchrones.
// Une opération synchrone rencontrant une Promise retourne un Left "async-error".
// is retourne false dans ce cas ; il ne peut pas attendre une validation asynchrone.
const asyncCheckResult = componentStructure.asyncCheck(
	unknownComponent,
);

const asyncDecodeResult = componentStructure.asyncDecode(
	DDataStructure.codecsJson,
	unknownComponent,
);

const asyncEncodeResult = componentStructure.asyncEncode(
	DDataStructure.codecsJson,
	component,
);
