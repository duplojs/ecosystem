/**
 * @title DEither.error
 *
 * Créer un Left standardisé avec l’information `error`.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.error("connection-failed");

// La sortie est un Left portant l’information littérale "error".
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Error<"connection-failed">, "strict">;
