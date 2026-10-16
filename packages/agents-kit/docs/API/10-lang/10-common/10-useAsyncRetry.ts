/**
 * @title DCommon.useAsyncRetry
 *
 * Réessayer une opération asynchrone selon son résultat et une limite d’essais.
 */
import * as DCommon from "@duplojs/lang/common";

let callCount = 0;

const result = DCommon.useAsyncRetry(
	async() => {
		callCount += 1;
		await DCommon.timeout();

		return callCount === 1 ? "retry" : "done";
	},
	DCommon.equal("retry"),
	{
		maxRetry: 3,
		timeToSleep: 10,
	},
);

// Le résultat est testé après chaque essai : si le prédicat est vrai (`result === "retry"`), on recommence.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<"retry" | "done">,
	"strict"
>;

// `maxRetry` est obligatoire ; `timeToSleep` ajoute une pause entre deux essais.
