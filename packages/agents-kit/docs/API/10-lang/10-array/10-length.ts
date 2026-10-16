/**
 * @title DArray.length
 *
 * Lire la longueur d’un tableau avec les contraintes de cardinalité présentes dans son type.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";

const values = [1, 2, 3];
const result = DArray.length(values);

// La valeur obtenue est 3 ; le type porte la garantie que la longueur est positive.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	number & DNumber.Positive,
	"strict"
>;

// Une contrainte maximale enrichit aussi le type de la longueur.
declare const bounded: readonly number[] & DArray.MaxElements<5>;
const boundedLength = DArray.length(bounded);

type _CheckBoundedLength = DCommon.ExpectType<
	typeof boundedLength,
	number & DNumber.Positive & DNumber.LessThanOrEqual<5>,
	"strict"
>;
