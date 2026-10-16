/**
 * @title DEither.right
 *
 * Créer un résultat Right avec une information et une valeur optionnelle.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const withoutValue = DEither.right("ready");
type _CheckWithoutValue = DCommon.ExpectType<typeof withoutValue, DEither.Right<"ready", undefined>, "strict">;

const withValue = DEither.right("user-found", "Alice");
type _CheckWithValue = DCommon.ExpectType<typeof withValue, DEither.Right<"user-found", "Alice">, "strict">;
