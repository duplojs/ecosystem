/**
 * @title DGenerator.filter
 *
 * Conserver dans un générateur les valeurs acceptées par un prédicat.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input: number[] = [1, 2, 3, 4];

// Appel classique : seuls les nombres supérieurs à deux sont produits.
const result = DGenerator.filter(input, DNumber.greaterThan(2));

// La sortie est un générateur qui produit [3, 4] et conserve l’affinement du prédicat.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Generator<number & DNumber.GreaterThan<2>, unknown, unknown>,
	"strict"
>;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	input,
	DGenerator.filter(DNumber.isEven),
	DArray.from,
);

// La sortie vaut [2, 4].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly (number & DNumber.Even)[],
	"strict"
>;
