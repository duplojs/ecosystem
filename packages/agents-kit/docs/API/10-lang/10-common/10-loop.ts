/**
 * @title DCommon.loop
 *
 * Répéter une callback synchrone jusqu’à `exit`, avec un compteur et une valeur de retour typée.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.loop<"done">(({ count, next, exit }) => {
	if (count === 3) {
		return exit("done");
	}

	return next();
});

// `count` commence à 0. `next()` poursuit la boucle ; les valeurs d'une itération à l'autre
// doivent être portées par loopAccumulator, car `loop` ne conserve pas les données de `next`.
type _CheckResult = DCommon.ExpectType<typeof result, "done", "strict">;
