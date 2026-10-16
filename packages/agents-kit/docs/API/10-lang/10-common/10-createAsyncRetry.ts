/**
 * @title DCommon.createAsyncRetry
 *
 * Décorer une fonction asynchrone avec une stratégie de nouvelle tentative.
 */
import * as DCommon from "@duplojs/lang/common";

let callCount = 0;

const retry = DCommon.createAsyncRetry(
	async(value: string) => {
		callCount += 1;
		await DCommon.timeout();

		return callCount === 1 ? "retry" : value;
	},
	DCommon.equal("retry"),
	{
		maxRetry: 3,
		timeToSleep: 10,
	},
);
const result = retry("done");

// La fonction décorée conserve ses paramètres et retourne une Promise.
type _CheckRetry = DCommon.ExpectType<
	typeof retry,
	(value: string) => Promise<string>,
	"strict"
>;
type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;

// Le prédicat vrai (`result === "retry"`) relance l’opération ; `done` arrête les tentatives.
// `maxRetry` limite le nombre d’essais et `timeToSleep` règle la pause entre deux essais.
