/**
 * @title DGenerator.asyncFilter
 *
 * Conserver dans un générateur asynchrone les valeurs acceptées par un prédicat.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input = (async function *() {
	await DCommon.timeout();
	yield 1 as number;
	yield 2 as number;
	yield 3 as number;
	yield 4 as number;
})();

// Appel classique : seuls les nombres supérieurs à deux sont produits.
const result = DGenerator.asyncFilter(input, DNumber.greaterThan(2));

// La sortie est un AsyncGenerator qui produit [3, 4].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<number & DNumber.GreaterThan<2>, unknown, unknown>,
	"strict"
>;

// Appel curifié : le prédicat est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	[1, 2, 3, 4] as number[],
	DGenerator.asyncFilter(DNumber.isEven),
	DArray.from,
);

// La promesse se résout vers [2, 4].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<readonly (number & DNumber.Even)[]>,
	"strict"
>;
