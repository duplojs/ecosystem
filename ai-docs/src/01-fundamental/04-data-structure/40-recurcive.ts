/**
 * @title Les `DataStructures` récursives.
 *
 * Une structure récursive doit pouvoir se référencer elle-même.
 *
 * TypeScript ne peut pas inférer entièrement ce type de structure.
 * Il faut donc déclarer le type attendu en amont, puis utiliser `lazy`
 * pour différer l'accès à la structure récursive.
 *
 * `contract` permet ensuite de vérifier que le type déclaré manuellement
 * est strictement égal au type réellement produit par la structure.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";

interface Tree {
	readonly value: string;
	readonly children: readonly Tree[];
}

// Tree
const treeStructure: DDataStructure.Structure<Tree> = DDataStructure.object({
	value: DDataStructure.string(),
	children: DDataStructure.array(
		DDataStructure.lazy(() => treeStructure),
	),
}).contract();

// `lazy` retarde la résolution de `treeStructure`.
//
// Sans lui, la construction de la structure devrait accéder immédiatement
// à une variable qui est elle-même en train d'être construite.
//
// Le type doit être déclaré en amont car TypeScript ne peut pas inférer
// une structure qui dépend récursivement de son propre type.
//
// `contract()` compare strictement le type attendu par `Structure<Tree>`
// avec le type obtenu par l'inférence de la structure.
//
// Si la structure ne correspond pas exactement à `Tree`, l'appel à
// `contract()` produit une erreur de typage. Cela évite qu'une interface
// déclarée manuellement diverge de sa représentation runtime.

const tree = {
	value: "root",
	children: [
		{
			value: "child",
			children: [],
		},
	],
};

const result = treeStructure.check(tree);
