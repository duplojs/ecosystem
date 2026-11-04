/**
 * @title DString.stringify
 *
 * Convertir une valeur quelconque en représentation textuelle sans laisser `undefined` au résultat.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.stringify({ status: "ready" });
// La valeur obtenue est la représentation JSON "{\"status\":\"ready\"}".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
