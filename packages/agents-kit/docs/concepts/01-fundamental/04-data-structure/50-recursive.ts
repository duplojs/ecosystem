/**
 * @title Contrats de données récursifs.
 *
 * Références différées et cohérence entre un type déclaré et sa structure runtime.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";

// Une structure récursive se référence elle-même. Le type attendu est déclaré en amont
// pour permettre à TypeScript de typer cette dépendance récursive.
interface Tree {
	readonly value: string;
	readonly children: readonly Tree[];
}

const treeStructure: DDataStructure.Structure<Tree> = DDataStructure.object({
	value: DDataStructure.string(),
	children: DDataStructure.array(
		DDataStructure.lazy(() => treeStructure),
	),
}).contract();
type _CheckTreeStructure = DCommon.ExpectType<DDataStructure.StructureValue<typeof treeStructure>, Tree, "strict">;

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
type _CheckTreeResult = DCommon.ExpectType<
	typeof result,
	DEither.Left<"async-error", DDataStructure.ErrorPromise>
		| DEither.Left<"check-error", DDataStructure.Error>
		| DEither.Right<"check-success", Tree>,
	"strict"
>;
