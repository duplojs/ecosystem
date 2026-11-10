/**
 * @title DGenerator.asyncLoop
 *
 * Produire une séquence asynchrone en distinguant les valeurs de `next` et celles de la sortie `exit`.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

// La callback peut être asynchrone ; `count` est le seul état fourni à chaque tour.
const withoutExitValue = DCommon.pipe(
	DGenerator.asyncLoop(async({ count, next, exit }: DGenerator.LoopParams<number>) => {
		await DCommon.timeout();

		if (count === 3) {
			return exit();
		}

		return next(count + 1);
	}),
	DArray.from,
);

// La promesse se résout vers [1, 2, 3] : `exit()` termine sans ajouter de valeur.
type _CheckWithoutExitValue = DCommon.ExpectType<
	typeof withoutExitValue,
	Promise<readonly number[]>,
	"strict"
>;

// La callback est attendue à chaque tour ; les sorties sont émises avant l’appel du tour suivant.
const withExitValue = DCommon.pipe(
	DGenerator.asyncLoop(async({ count, next, exit }: DGenerator.LoopParams<number | "done">) => {
		await DCommon.timeout();

		if (count === 3) {
			return exit("done");
		}

		return next(count + 1);
	}),
	DArray.from,
);

// La promesse se résout vers [1, 2, 3, "done"] : `exit` ajoute sa valeur en dernier.
type _CheckWithExitValue = DCommon.ExpectType<
	typeof withExitValue,
	Promise<readonly (number | "done")[]>,
	"strict"
>;
