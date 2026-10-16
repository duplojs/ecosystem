/**
 * @title DEither.fail
 *
 * Créer un Left standardisé représentant un échec sans valeur.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.fail();

// La sortie est `Fail`, un Left dont la valeur est `undefined`.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Fail, "strict">;
