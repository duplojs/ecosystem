/**
 * @title DCommon.memoPromise
 *
 * Mémoriser le résultat d’un calcul synchrone ou asynchrone.
 */
import * as DCommon from "@duplojs/lang/common";

const memoized = DCommon.memoPromise(() => "done");
const result = memoized.value;

// Le premier accès peut fournir la valeur ou la Promise partagée du calcul.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	string | Promise<string>,
	"strict"
>;
