/**
 * @title DGenerator.asyncConcat
 *
 * Enchaîner plusieurs itérables synchrones ou asynchrones dans un générateur asynchrone.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";

const head = (async function *() {
	await DCommon.timeout();
	yield 1 as const;
	yield 2 as const;
})();

const tail = (async function *() {
	await DCommon.timeout();
	yield 4 as const;
	yield 5 as const;
})();

// Appel classique : les valeurs sont produites dans l’ordre [1, 2, 3, 4, 5].
const result = DGenerator.asyncConcat(head, [3] as const, tail);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<1 | 2 | 3 | 4 | 5, unknown, unknown>,
	"strict"
>;

// Appel curifié : les itérables ajoutés sont configurés dans l’étape du pipe.
const piped = DCommon.pipe(
	[1, 2],
	DGenerator.asyncConcat(([
		3,
		4,
	] as number[])),
	DArray.from,
);

// La promesse se résout vers [1, 2, 3, 4].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<readonly number[]>,
	"strict"
>;
