/**
 * @title DEither.ok
 *
 * Créer un Right standardisé représentant une réussite sans valeur.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.ok();

// La sortie est `Ok`, un Right dont la valeur est `undefined`.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Ok, "strict">;
