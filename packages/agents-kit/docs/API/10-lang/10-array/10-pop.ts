/**
 * @title DArray.pop
 *
 * Retirer le dernier élément d’un tableau dans une nouvelle copie.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];
const result = DArray.pop(numbers);

// La valeur obtenue est [1, 2] ; numbers reste inchangé.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// La suppression conserve une borne maximale portée par le tableau source.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.pop(constrained);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly number[] & DArray.MaxElements<4>,
	"strict"
>;
