/**
 * @title DGenerator.reduceFrom
 *
 * Marquer une valeur initiale, éventuellement élargie par un générique, pour une réduction.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

// Pour une valeur primitive, son type est inféré directement.
const numberInitial = DGenerator.reduceFrom(0);

type _CheckNumberInitial = DCommon.ExpectType<
	typeof numberInitial,
	DGenerator.ReduceFromResult<number>,
	"strict"
>;

type Accumulator =
	| { total: number }
	| { values: readonly number[] };

// Pour une structure plus large, le générique de reduceFrom fixe la shape ou l’union sans utiliser `as`.
const result = DGenerator.reduce(
	[1, 2, 3],
	DGenerator.reduceFrom<Accumulator>({ total: 0 }),
	({ lastValue, next }) => next(lastValue),
);

// La réduction désempaquette l’accumulateur et conserve l’union définie par reduceFrom.
type _CheckResult = DCommon.ExpectType<typeof result, Accumulator, "strict">;
