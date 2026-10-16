/**
 * @title DCommon.promiseAll
 *
 * Attendre un tuple ou un itérable de promesses en conservant la forme du tuple.
 */
import * as DCommon from "@duplojs/lang/common";

declare const values: readonly [Promise<string>, number];
const result = DCommon.promiseAll(values);

// Le tuple résolu conserve l’ordre et la position de ses types.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<[string, number]>,
	"strict"
>;
