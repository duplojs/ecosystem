/**
 * @title DArray.from
 *
 * Convertir une source array-like, itérable ou asynchrone en tableau.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

// Une source itérable est matérialisée en tableau synchrone.
const result = DArray.from(new Set([1, 2, 3]));

// La valeur obtenue est [1, 2, 3].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Une source asynchrone produit une promesse de tableau.
async function *values() {
	await Promise.resolve();
	yield "a";
	yield "b";
}

const asyncResult = DArray.from(values());

// La promesse résout vers ["a", "b"].
type _CheckAsyncResult = DCommon.ExpectType<typeof asyncResult, Promise<readonly ("a" | "b")[]>, "strict">;
