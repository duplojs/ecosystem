/**
 * @title DCommon.forwardLog
 *
 * Afficher une valeur puis la retourner pour observer une composition.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.forwardLog("value");

// La valeur observée est aussi la valeur produite.
type _CheckResult = DCommon.ExpectType<typeof result, "value", "strict">;
