/**
 * @title DCommon.asyncLoop
 *
 * Répéter une callback asynchrone jusqu’à `exit`, avec un compteur et une valeur de retour typée.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.asyncLoop<"done">(async({
	count,
	next,
	exit,
}) => {
	await DCommon.timeout();

	if (count === 3) {
		return exit("done");
	}

	return next();
});

// La callback est attendue à chaque tour. `next` ne transmet pas d’état à l’itération suivante.
type _CheckResult = DCommon.ExpectType<typeof result, Promise<"done">, "strict">;
