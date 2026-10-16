/**
 * @title DCommon.loop
 *
 * Contrôler une boucle synchrone avec un compteur et une sortie typée.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.loop<"done", number>(({ count, previousOutput, next, exit }) => {
	const current = previousOutput ?? 0;

	if (count === 3) {
		return exit("done");
	}

	return next(current + 1);
});

// `count` commence à 0 ; `previousOutput` vaut undefined à la première itération.
// `next` poursuit la boucle avec une nouvelle sortie, tandis que `exit` la termine.
type _CheckResult = DCommon.ExpectType<typeof result, "done", "strict">;
