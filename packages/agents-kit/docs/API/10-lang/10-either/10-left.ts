/**
 * @title DEither.left
 *
 * Créer un résultat Left avec une information et une valeur optionnelle.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const withoutValue = DEither.left("missing");
type _CheckWithoutValue = DCommon.ExpectType<typeof withoutValue, DEither.Left<"missing", undefined>, "strict">;

const withValue = DEither.left("invalid", "bad-input");
type _CheckWithValue = DCommon.ExpectType<typeof withValue, DEither.Left<"invalid", "bad-input">, "strict">;
