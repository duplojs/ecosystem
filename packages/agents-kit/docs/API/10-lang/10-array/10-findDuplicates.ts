/**
 * @title DArray.findDuplicates
 *
 * Trouver les valeurs primitives ou temporelles apparaissant plusieurs fois dans un tableau.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const values = ["a", "b", "a", "c", "b"];

// Les valeurs répétées sont retournées une seule fois, dans leur ordre de première répétition.
const result = DArray.findDuplicates(values);

// La valeur obtenue est ["a", "b"] ; aucun doublon produit undefined.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	undefined | (readonly string[] & DArray.MinElements<1>),
	"strict"
>;
