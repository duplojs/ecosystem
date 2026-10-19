/**
 * @title DGenerator.concat
 *
 * Enchaîner plusieurs itérables dans un générateur synchrone.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";

// Appel classique : les valeurs sont produites dans l’ordre [1, 2, 3, 4].
const result = DGenerator.concat(
	[1, 2] as const,
	[3] as const,
	[4] as const,
);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	Generator<1 | 2 | 3 | 4, unknown, unknown>,
	"strict"
>;

const tail: Iterable<number> = [3, 4];

// Appel curifié : les itérables ajoutés sont configurés dans l’étape du pipe.
const piped = DCommon.pipe(
	[1, 2],
	DGenerator.concat(tail),
	DArray.from,
);

// La sortie vaut [1, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly number[],
	"strict"
>;
