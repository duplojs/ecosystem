/**
 * @title DArray.reduceFrom
 *
 * Marquer explicitement la valeur initiale d’un reduce pour préserver sa forme de valeur.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const initial = DArray.reduceFrom({ count: 0 });

// La valeur obtenue porte la valeur initiale dans le marqueur attendu par DArray.reduce.
type _CheckInitial = DCommon.ExpectType<
	typeof initial,
	DArray.ReduceFromResult<{ count: number }>,
	"strict"
>;
