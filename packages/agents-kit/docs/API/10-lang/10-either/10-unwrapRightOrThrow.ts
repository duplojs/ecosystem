/**
 * @title DEither.unwrapRightOrThrow
 *
 * Extraire un Right ou lever une exception lorsque le statut attendu n’est pas présent.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const value = DEither.unwrapRightOrThrow(DEither.success("saved"));

// Pour une entrée connue comme Right, la valeur extraite est directement typée.
type _CheckValue = DCommon.ExpectType<typeof value, "saved", "strict">;

// Un Left provoque `NotRightError` au runtime.
declare const maybeRight: DEither.Success<string> | DEither.Left<"missing", null>;
const narrowed = DEither.unwrapRightOrThrow(maybeRight);
type _CheckNarrowed = DCommon.ExpectType<typeof narrowed, string, "strict">;
