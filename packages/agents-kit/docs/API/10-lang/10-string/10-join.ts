/**
 * @title DString.join
 *
 * Réunir les chaînes d'une collection avec un séparateur.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const values = ["duplo", "js"] as const;
const result = DString.join(values, "-");
// La valeur obtenue est "duplo-js".
type _CheckResult = DCommon.ExpectType<typeof result, "duplo-js", "strict">;

const piped = DCommon.pipe(
	values,
	DString.join("-"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "duplo-js", "strict">;
