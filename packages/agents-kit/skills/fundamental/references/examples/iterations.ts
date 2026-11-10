/**
 * @title Remplacer les boucles par les primitives DuploJS.
 *
 * Accumulateurs immuables, sortie anticipée et répétitions conditionnelles.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

interface RunningTotals {
	readonly total: number;
	readonly subtotals: readonly number[];
}

const runningTotals = DCommon.pipe(
	[2, -1, 4],
	DArray.reduce(
		DArray.reduceFrom<RunningTotals>({
			total: 0,
			subtotals: [],
		}),
		({ element, lastValue, nextWithObject }) => {
			const total = DNumber.sum([lastValue.total, element]);
			return nextWithObject(lastValue, {
				total,
				subtotals: DArray.push(lastValue.subtotals, total),
			});
		},
	),
);

// Résultat : { total: 5, subtotals: [2, 1, 5] }. Chaque étape dépend du total précédent.
// L'accumulateur initial et la source ne sont pas mutés.
type _CheckRunningTotals = DCommon.ExpectType<typeof runningTotals, RunningTotals, "strict">;

const totalOrStop = DCommon.pipe(
	[2, -1, 4],
	DArray.reduce(
		0,
		({ element, lastValue, next, exit }) => element < 0
			? exit("negative-value")
			: next(DNumber.sum([lastValue, element])),
	),
);

// Résultat : "negative-value" ; 4 n'est pas traité. exit peut changer le type du résultat.
type _CheckTotalOrStop = DCommon.ExpectType<typeof totalOrStop, number | string, "strict">;

declare function loadAmount(id: string): Promise<number>;

const loadedTotal = await DCommon.asyncPipe(
	["first", "second"],
	DGenerator.asyncReduce(
		0,
		async({ item, lastValue, next }) => {
			const amount = await loadAmount(item);
			return next(DNumber.sum([lastValue, amount]));
		},
	),
);

// Chaque chargement est attendu avant le suivant ; la source peut aussi être un AsyncIterable.
type _CheckLoadedTotal = DCommon.ExpectType<typeof loadedTotal, number, "strict">;

const reachedValue = DCommon.loopAccumulator(0, ({ accumulator, next, exit }) => {
	// La condition est vérifiée avant le traitement, comme dans un while.
	if (accumulator >= 3) {
		return exit(accumulator);
	}

	return next(DNumber.sum([accumulator, 1]));
});

// Résultat : 3. L'état circule dans l'accumulateur de la boucle.
type _CheckReachedValue = DCommon.ExpectType<typeof reachedValue, number, "strict">;

declare function readBatchSize(index: number): Promise<number>;

const processedTotal = await DCommon.asyncLoopAccumulator(0, async({
	count,
	accumulator,
	next,
	exit,
}) => {
	const size = await readBatchSize(count);

	// La première taille nulle termine la lecture ; exit retourne le total accumulé.
	if (size === 0) {
		return exit(accumulator);
	}

	return next(DNumber.sum([accumulator, size]));
});

type _CheckProcessedTotal = DCommon.ExpectType<typeof processedTotal, number, "strict">;

const emitted = DArray.from(DGenerator.loop(({ count, next, exit }) => count === 3
	? exit("done")
	: next(count)));

// DGenerator.loop émet les sorties de next puis celles de exit.
type _CheckEmitted = DCommon.ExpectType<typeof emitted, readonly (number | "done")[], "strict">;

const emittedWithAccumulator = DArray.from(
	DGenerator.loopAccumulator(0, ({ accumulator, count, next, exit }) => count === 3
		? exit(accumulator)
		: next(accumulator + 1, accumulator)),
);

// Chaque sortie peut être produite au même moment que le nouvel accumulateur est choisi.
type _CheckEmittedWithAccumulator = DCommon.ExpectType<typeof emittedWithAccumulator, readonly number[], "strict">;
