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

const reachedValue = DCommon.loop<number, number>(({ previousOutput, next, exit }) => {
	const current = previousOutput ?? 0;

	// La condition est vérifiée avant le traitement, comme dans un while.
	if (current >= 3) {
		return exit(current);
	}

	return next(DNumber.sum([current, 1]));
});

// Résultat : 3. L'état circule dans next sans compteur externe mutable.
type _CheckReachedValue = DCommon.ExpectType<typeof reachedValue, number, "strict">;

declare function readBatchSize(index: number): Promise<number>;

const processedTotal = await DCommon.asyncLoop<number, number>(async({
	count,
	previousOutput,
	next,
	exit,
}) => {
	const current = previousOutput ?? 0;
	const size = await readBatchSize(count);

	// La première taille nulle termine la lecture ; le dernier total devient le résultat.
	if (size === 0) {
		return exit(current);
	}

	return next(DNumber.sum([current, size]));
});

type _CheckProcessedTotal = DCommon.ExpectType<typeof processedTotal, number, "strict">;
