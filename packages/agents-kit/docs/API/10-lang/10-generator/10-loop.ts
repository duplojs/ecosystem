/**
 * @title DGenerator.loop
 *
 * Produire une séquence dans un pipe en distinguant l’arrêt avec ou sans dernière valeur émise.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

// Arrêt sans dernière valeur : `exit()` termine la boucle sans émettre d’élément supplémentaire.
const withoutExitValue = DCommon.pipe(
	DGenerator.loop(({ previousOutput, next, exit }: DGenerator.LoopParams<number>) => {
		if (previousOutput === 3) {
			return exit();
		}

		return next(
			previousOutput === undefined
				? 1
				: DNumber.sum([previousOutput, 1]),
		);
	}),
	DArray.from,
);

// La sortie vaut [1, 2, 3] : `next` émet les valeurs intermédiaires, mais `exit()` n’en émet aucune.
type _CheckWithoutExitValue = DCommon.ExpectType<
	typeof withoutExitValue,
	readonly number[],
	"strict"
>;

// Arrêt avec dernière valeur : `exit(value)` termine la boucle en émettant cette valeur.
const withExitValue = DCommon.pipe(
	DGenerator.loop(({ previousOutput, next, exit }: DGenerator.LoopParams<number>) => {
		if (previousOutput === 3) {
			return exit(4);
		}

		return next(
			previousOutput === undefined
				? 1
				: DNumber.sum([previousOutput, 1]),
		);
	}),
	DArray.from,
);

// La sortie vaut [1, 2, 3, 4] : `exit(4)` ajoute la dernière valeur à la séquence.
type _CheckWithExitValue = DCommon.ExpectType<
	typeof withExitValue,
	readonly number[],
	"strict"
>;
