/**
 * @title DGenerator.asyncMap
 *
 * Transformer chaque valeur dans un générateur asynchrone, en autorisant une callback synchrone ou asynchrone.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input = (async function *() {
	await DCommon.timeout();
	yield 1;
	yield 2;
})();

// Appel classique : chaque valeur est doublée après l’exécution de la callback asynchrone.
const result = DGenerator.asyncMap(
	input,
	async(item) => {
		await DCommon.timeout();
		return DNumber.sum([item, item]);
	},
);

// La sortie est un AsyncGenerator qui produit [2, 4].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<number, unknown, unknown>,
	"strict"
>;

// Appel curifié : la transformation est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	[1, 2, 3],
	DGenerator.asyncMap(async(item) => {
		await DCommon.timeout();
		return DNumber.sum([item, item, item]);
	}),
	DArray.from,
);

// La promesse se résout vers [3, 6, 9].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<readonly number[]>,
	"strict"
>;
