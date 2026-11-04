/**
 * @title DString.to
 *
 * Convertir une valeur stringifiable en chaîne en conservant les littéraux connus lorsque c'est possible.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.to(42);
// La valeur obtenue est "42" et son type reste littéral.
type _CheckResult = DCommon.ExpectType<typeof result, "42", "strict">;
