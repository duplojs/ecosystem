/**
 * @title DGenerator.reduce
 *
 * Réduire un itérable avec un accumulateur et des sorties next ou exit.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input = [1, 2, 3] as const;

// Appel classique : le nombre initial est directement inféré comme accumulateur numérique.
const result = DGenerator.reduce(
	input,
	0,
	({ lastValue, item, next }) => next(DNumber.sum([lastValue, item])),
);

// La sortie vaut 6 et le type de l’accumulateur est inféré comme number.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

type Accumulator =
	| { total: number }
	| { values: readonly number[] };

// Appel curifié : le générique porté par reduceFrom décrit une union sans utiliser `as`.
const piped = DCommon.pipe(
	input,
	DGenerator.reduce(
		DGenerator.reduceFrom<Accumulator>({ total: 0 }),
		({ lastValue, next }) => next(lastValue),
	),
);

// La sortie conserve l’union { total: number } | { values: readonly number[] }.
type _CheckPiped = DCommon.ExpectType<typeof piped, Accumulator, "strict">;

// Une sortie exit interrompt la réduction : son type string est indépendant de l’accumulateur number.
const stopped = DGenerator.reduce(
	input,
	0,
	({ item, lastValue, next, exit }) => item === 2
		? exit("stop")
		: next(DNumber.sum([lastValue, item])),
);

type _CheckStopped = DCommon.ExpectType<
	typeof stopped,
	number | string,
	"strict"
>;
