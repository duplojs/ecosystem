/**
 * @title DEither.unwrapLeftOrThrow
 *
 * Extraire un Left ou lever une exception lorsque le statut attendu n’est pas présent.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const value = DEither.unwrapLeftOrThrow(DEither.left("invalid", "bad-input"));

// Pour une entrée connue comme Left, la valeur extraite est directement typée.
type _CheckValue = DCommon.ExpectType<typeof value, "bad-input", "strict">;

// Un Right provoque `NotLeftError` au runtime.
declare const maybeLeft: DEither.Left<"invalid", string> | DEither.Success<"saved">;
const narrowed = DEither.unwrapLeftOrThrow(maybeLeft);
type _CheckNarrowed = DCommon.ExpectType<typeof narrowed, string, "strict">;
