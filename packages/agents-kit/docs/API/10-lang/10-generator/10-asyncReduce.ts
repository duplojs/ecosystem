/**
 * @title DGenerator.asyncReduce
 *
 * Réduire un itérable avec un accumulateur et des sorties next ou exit dans une promesse.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input = (async function *() {
	await DCommon.timeout();
	yield 1;
	yield 2;
	yield 3;
})();

// Appel classique : le nombre initial est directement inféré comme accumulateur numérique.
const result = DGenerator.asyncReduce(
	input,
	0,
	async({ lastValue, item, next }) => {
		await DCommon.timeout();
		return next(DNumber.sum([lastValue, item]));
	},
);

// La promesse se résout vers 6 et l’accumulateur est inféré comme number.
type _CheckResult = DCommon.ExpectType<typeof result, Promise<number>, "strict">;

type Accumulator =
	| { total: number }
	| { values: readonly number[] };

// Appel curifié : le générique porté par reduceFrom décrit une union sans utiliser `as`.
const piped = DCommon.pipe(
	[1, 2, 3],
	DGenerator.asyncReduce(DGenerator.reduceFrom<Accumulator>({ total: 0 }), async({ lastValue, next }) => {
		await DCommon.timeout();
		return next(lastValue);
	}),
);

// La promesse conserve l’union { total: number } | { values: readonly number[] }.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<Accumulator>,
	"strict"
>;

// Une sortie exit interrompt la réduction : son type string est indépendant de l’accumulateur number.
const stopped = DGenerator.asyncReduce(
	[1, 2, 3],
	0,
	({ item, lastValue, next, exit }) => item === 2
		? exit("stop")
		: next(DNumber.sum([lastValue, item])),
);

type _CheckStopped = DCommon.ExpectType<
	typeof stopped,
	Promise<number | string>,
	"strict"
>;
