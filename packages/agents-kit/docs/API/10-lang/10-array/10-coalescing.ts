/**
 * @title DArray.coalescing
 *
 * Convertir une valeur en tableau sans ré-encapsuler une valeur déjà contenue dans un tableau.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

// Une valeur simple devient un tuple à un élément.
const value = DArray.coalescing(42);

// La valeur obtenue est [42].
type _CheckValue = DCommon.ExpectType<typeof value, readonly [42], "strict">;

// Un tableau est conservé avec sa forme et ses éléments.
declare const input: readonly [1, 2];
const array = DArray.coalescing(input);

// La valeur obtenue est [1, 2].
type _CheckArray = DCommon.ExpectType<typeof array, readonly [1, 2], "strict">;
