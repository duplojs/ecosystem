/**
 * @title DCommon.removeConstraint
 *
 * Retirer les contraintes DuploJS d’un type tout en conservant sa forme de valeur.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

declare const constrained: string & DString.NotEmpty;
const result = DCommon.removeConstraint(constrained);

// La valeur reste une chaîne, mais ne porte plus la contrainte NotEmpty.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
