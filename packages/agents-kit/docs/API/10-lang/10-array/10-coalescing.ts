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
const array = DArray.coalescing([1, 2] as const);

// La valeur obtenue est [1, 2].
type _CheckArray = DCommon.ExpectType<typeof array, [1, 2], "strict">;
