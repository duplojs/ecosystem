/**
 * @title DCommon.memo
 *
 * Évaluer une fonction au premier accès puis mémoriser sa valeur.
 */
import * as DCommon from "@duplojs/lang/common";

const memoized = DCommon.memo(() => "done");
const result = memoized.value;

// Le getter expose la valeur calculée avec son type inféré.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
