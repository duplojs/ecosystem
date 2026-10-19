/**
 * @title DGenerator.flat
 *
 * Aplatir récursivement les valeurs itérables jusqu’à une profondeur donnée.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

// Profondeur par défaut : un seul niveau est aplati et la sortie contient [1, 2, 3].
const result = DGenerator.flat([[1, 2], [3]] as const);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	Generator<1 | 2 | 3, void, unknown>,
	"strict"
>;

// Une profondeur de deux aplati deux niveaux et produit également [1, 2, 3].
const deeplyFlattened = DGenerator.flat([[[1], [2]], [[3]]] as const, 2);

type _CheckDeeplyFlattened = DCommon.ExpectType<
	typeof deeplyFlattened,
	Generator<1 | 2 | 3, void, unknown>,
	"strict"
>;
