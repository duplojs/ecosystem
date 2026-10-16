/**
 * @title DCommon.simpleClone
 *
 * Créer une copie superficielle d’une valeur clonable.
 */
import * as DCommon from "@duplojs/lang/common";

const source = { value: "done" };
const result = DCommon.simpleClone(source);

// La copie conserve le type de la valeur clonée.
type _CheckResult = DCommon.ExpectType<typeof result, typeof source, "strict">;
