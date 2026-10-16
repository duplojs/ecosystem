/**
 * @title DArray.filter
 *
 * Construire un nouveau tableau avec les éléments qui satisfont un prédicat.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [1, 2, 3, 4];

// Appel classique : seuls les nombres pairs sont conservés.
const result = DArray.filter(numbers, DNumber.isEven);

// La valeur obtenue est [2, 4].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly (number & DNumber.Even)[],
	"strict"
>;

// Appel curifié : le prédicat est utilisé dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.filter(DNumber.greaterThan(2)),
);

// La valeur obtenue est [3, 4].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly (number & DNumber.GreaterThan<2>)[],
	"strict"
>;

// Le filtrage ne peut pas augmenter le nombre d’éléments : la borne maximale est conservée.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.filter(constrained, DNumber.greaterThan(1));

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	readonly (number & DNumber.GreaterThan<1>)[] & DArray.MaxElements<4>,
	"strict"
>;
