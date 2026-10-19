/**
 * @title DGenerator.execute
 *
 * Consommer une génératrice jusqu’à sa fin, en retournant une promesse pour les génératrices asynchrones.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

// Appel synchrone : `loop` rappelle sa callback comme une boucle `while`,
// puis `map` traite chaque valeur avant qu’`execute` ne consomme la génératrice.
const result = DCommon.pipe(
	DGenerator.loop(({ count, next, exit }: DGenerator.LoopParams<number>) => {
		if (count === 3) {
			return exit();
		}

		return next(count);
	}),
	DGenerator.map(DCommon.forwardLog),
	DGenerator.execute,
);

// La génératrice est consommée jusqu’à sa fin et chaque valeur est transmise à `forwardLog`.
type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

// Appel asynchrone : `asyncLoop` produit une génératrice asynchrone,
// et `execute` retourne une promesse résolue après le traitement de chaque valeur.
const asyncResult = DCommon.pipe(
	DGenerator.asyncLoop(async({ count, next, exit }: DGenerator.LoopParams<number>) => {
		await DCommon.timeout();

		return count === 3
			? exit()
			: next(count);
	}),
	DGenerator.asyncMap(DCommon.forwardLog),
	DGenerator.execute,
);

type _CheckAsyncResult = DCommon.ExpectType<
	typeof asyncResult,
	Promise<void>,
	"strict"
>;
