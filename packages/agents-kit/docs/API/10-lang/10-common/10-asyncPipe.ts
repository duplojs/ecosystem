/**
 * @title DCommon.asyncPipe
 *
 * Exécuter séquentiellement plusieurs transformations en attendant chaque résultat.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DCommon.asyncPipe(
	"value",
	DString.toUpperCase,
	DString.length,
);

// Le résultat final est la longueur positive de la chaîne transformée.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<number & DNumber.Positive>,
	"strict"
>;
