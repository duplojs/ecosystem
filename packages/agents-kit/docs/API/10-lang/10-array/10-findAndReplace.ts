/**
 * @title DArray.findAndReplace
 *
 * Remplacer le premier élément satisfaisant un prédicat dans une nouvelle copie, ou retourner undefined.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

const numbers = [1, 2, 3];

// Appel classique : seul le premier élément pair est remplacé.
const result = DArray.findAndReplace(numbers, DNumber.isEven, 20);

// La valeur obtenue est [1, 20, 3] ; une recherche sans correspondance renverrait undefined.
type _CheckResult = DCommon.ExpectType<typeof result, readonly number[] | undefined, "strict">;

// Appel curifié : le prédicat et la valeur de remplacement sont configurés dans le pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.findAndReplace(DNumber.greaterThan(2), 30),
);

// La valeur obtenue est [1, 2, 30], ou undefined si la recherche échoue.
type _CheckPiped = DCommon.ExpectType<typeof piped, readonly number[] | undefined, "strict">;

// Le remplacement conserve la borne maximale, mais la recherche peut échouer.
declare const constrained: readonly number[] & DArray.MaxElements<4>;
const constrainedResult = DArray.findAndReplace(constrained, DNumber.greaterThan(1), 0);

type _CheckConstrained = DCommon.ExpectType<
	typeof constrainedResult,
	(readonly number[] & DArray.MaxElements<4>) | undefined,
	"strict"
>;
