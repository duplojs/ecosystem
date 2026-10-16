/**
 * @title DArray.flat
 *
 * Aplatir les niveaux imbriqués d’un tableau selon une profondeur donnée.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const nested: number[][] = [[1, 2], [3]];

// Appel classique : le premier niveau est aplati par défaut.
const result = DArray.flat(nested);

// La valeur obtenue est [1, 2, 3].
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[], "strict">;

// Une profondeur explicite aplatit autant de niveaux que demandé.
const deeplyNested: number[][][] = [[[1], [2]], [[3]]];
const deepResult = DArray.flat(deeplyNested, 2);

// La valeur obtenue est [1, 2, 3].
type _CheckDeepResult = DCommon.ExpectType<typeof deepResult, readonly number[], "strict">;
