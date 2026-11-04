/**
 * @title DGenerator.asyncFlat
 *
 * Aplatir récursivement les valeurs itérables d’un générateur asynchrone jusqu’à une profondeur donnée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const input = (async function *() {
	await DCommon.timeout();
	yield [[1], [2]];
	yield [[3]];
})();

// Profondeur par défaut : un seul niveau est aplati, donc la sortie contient [[1], [2], [3]].
const result = DGenerator.asyncFlat(input);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<number[], void, unknown>,
	"strict"
>;

const nestedInput = (async function *() {
	await DCommon.timeout();
	yield [[1], [2]];
	yield [[3]];
})();

// Une profondeur de deux aplati également les tuples internes : la sortie contient [1, 2, 3].
const deeplyFlattened = DGenerator.asyncFlat(nestedInput, 2);

type _CheckDeeplyFlattened = DCommon.ExpectType<
	typeof deeplyFlattened,
	AsyncGenerator<number, void, unknown>,
	"strict"
>;
