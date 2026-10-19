/**
 * @title DGenerator.asyncFlat
 *
 * Aplatir récursivement les valeurs itérables d’un générateur asynchrone jusqu’à une profondeur donnée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const input = (async function *() {
	await DCommon.timeout();
	yield [[1], [2]] as const;
	yield [[3]] as const;
})();

// Profondeur par défaut : un seul niveau est aplati, donc la sortie contient [[1], [2], [3]].
const result = DGenerator.asyncFlat(input);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<readonly [1] | readonly [2] | readonly [3], void, unknown>,
	"strict"
>;

const nestedInput = (async function *() {
	await DCommon.timeout();
	yield [[1], [2]] as const;
	yield [[3]] as const;
})();

// Une profondeur de deux aplati également les tuples internes : la sortie contient [1, 2, 3].
const deeplyFlattened = DGenerator.asyncFlat(nestedInput, 2);

type _CheckDeeplyFlattened = DCommon.ExpectType<
	typeof deeplyFlattened,
	AsyncGenerator<1 | 2 | 3, void, unknown>,
	"strict"
>;
