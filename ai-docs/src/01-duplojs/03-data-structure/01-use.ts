/**
 * @title L'utilisation des `DateStructure`.
 *
 * Les data structures permettent de représenter et valider de la donnée,
 * ainsi que d'encoder et de décoder de la donnée.
 */

import * as DDataStructure from "@duplojs/lang/dataStructure";

const componentStructure = DDataStructure.object({
	name: DDataStructure.string(),
	alt: DDataStructure.optional(DDataStructure.string()),
	images: DDataStructure.object({
		name: DDataStructure.string(),
		src: DDataStructure.string([DDataStructure.url()]),
	}),
});

type ComponentStructure = DDataStructure.StructureValue<typeof componentStructure>;
// {
//     readonly name: string;
//     readonly images: {
//         readonly name: string;
//         readonly src: string & DString.Url;
//     };
//     readonly alt?: string | undefined;
// }

// Les résultats renvoient tout le temps une monade Right ou Left.
const checkResult = componentStructure.check({});
const decodeResult = componentStructure.decode(DDataStructure.codecsJson, {});
const encodeResult = componentStructure.encode(DDataStructure.codecsJson, {});
if (componentStructure.is({})) {

}

// Toutes les méthodes existent également en version asynchrone.
const asyncCheckResult = componentStructure.asyncCheck({});
