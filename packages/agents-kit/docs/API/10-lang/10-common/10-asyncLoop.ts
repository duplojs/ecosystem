/**
 * @title DCommon.asyncLoop
 *
 * Contrôler une boucle asynchrone avec un compteur et une sortie typée.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.asyncLoop<"done", number>(async({
	count,
	previousOutput,
	next,
	exit,
}) => {
	const current = previousOutput ?? 0;
	await DCommon.timeout();

	if (count === 3) {
		return exit("done");
	}

	return next(current + 1);
});

// La callback est attendue asynchrone, mais conserve les mêmes paramètres que `loop`.
type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;
