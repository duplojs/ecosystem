/**
 * @title DArray.reverse
 *
 * Inverser l’ordre d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// L’ordre est inversé sans mutation de numbers.
const result = DArray.reverse(numbers);

// La valeur obtenue est [3, 2, 1].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// L’inversion conserve la borne maximale du tableau source.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.reverse(constrained);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
