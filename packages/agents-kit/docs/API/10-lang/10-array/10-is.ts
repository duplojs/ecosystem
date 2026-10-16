/**
 * @title DArray.is
 *
 * Vérifier au runtime qu’une valeur est un tableau et affiner son type TypeScript.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

declare const input: unknown;

// Le test runtime réussit uniquement pour une valeur qui est effectivement un tableau.
if (DArray.is(input)) {
	// Dans cette branche, input est affiné en tableau de valeurs inconnues.
	type _CheckInput = DCommon.ExpectType<typeof input, readonly unknown[], "strict">;
}
