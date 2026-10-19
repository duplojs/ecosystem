/**
 * @title DGenerator.asyncLoop
 *
 * Produire une séquence asynchrone dans un pipe en distinguant l’arrêt avec ou sans dernière valeur émise.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

// Arrêt sans dernière valeur : `exit()` termine la boucle asynchrone sans émettre d’élément supplémentaire.
const withoutExitValue = DCommon.pipe(
	DGenerator.asyncLoop(async({ previousOutput, next, exit }: DGenerator.LoopParams<number>) => {
		await DCommon.timeout();

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

// La promesse se résout vers [1, 2, 3] : `exit()` n’émet aucune dernière valeur.
type _CheckWithoutExitValue = DCommon.ExpectType<
	typeof withoutExitValue,
	Promise<readonly number[]>,
	"strict"
>;

// Arrêt avec dernière valeur : `exit("done")` termine la boucle en l’émettant.
const withExitValue = DCommon.pipe(
	DGenerator.asyncLoop(async({ previousOutput, next, exit }: DGenerator.LoopParams<number>) => {
		await DCommon.timeout();

		if (previousOutput === 3) {
			return exit("done");
		}

		return next(
			previousOutput === undefined
				? 1
				: DNumber.sum([previousOutput, 1]),
		);
	}),
	DArray.from,
);

// La promesse se résout vers [1, 2, 3, "done"] : la valeur de `exit` est émise comme dernier élément.
type _CheckWithExitValue = DCommon.ExpectType<
	typeof withExitValue,
	Promise<readonly (number | "done")[]>,
	"strict"
>;
