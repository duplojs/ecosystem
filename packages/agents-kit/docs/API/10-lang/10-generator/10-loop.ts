/**
 * @title DGenerator.loop
 *
 * Produire une séquence synchrone en distinguant les valeurs de `next` et celles de la sortie `exit`.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

// `count` est le seul état fourni à chaque tour ; `next` émet des valeurs et continue.
const withoutExitValue = DCommon.pipe(
	DGenerator.loop(({ count, next, exit }: DGenerator.LoopParams<number>) => {
		if (count === 3) {
			return exit();
		}

		return next(count + 1);
	}),
	DArray.from,
);

// La sortie vaut [1, 2, 3] : `exit()` termine sans ajouter de valeur.
type _CheckWithoutExitValue = DCommon.ExpectType<
	typeof withoutExitValue,
	readonly number[],
	"strict"
>;

// `exit(value)` termine la boucle et émet sa valeur après celles émises par `next`.
const withExitValue = DCommon.pipe(
	DGenerator.loop(({ count, next, exit }: DGenerator.LoopParams<number>) => {
		if (count === 3) {
			return exit(4);
		}

		return next(count + 1);
	}),
	DArray.from,
);

// La sortie vaut [1, 2, 3, 4] : les valeurs multiples de `next` et `exit` forment la séquence.
type _CheckWithExitValue = DCommon.ExpectType<
	typeof withExitValue,
	readonly number[],
	"strict"
>;
